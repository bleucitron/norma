import { fail, redirect } from '@sveltejs/kit';
import { Level, Role, State } from '$lib/types/norma';
import type { Database } from '../../../../types/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import { access_token } from '$lib/server/accessToken';
import emailjs from '@emailjs/nodejs';
import { get } from 'svelte/store';
import { PUBLIC_EMAILJS_KEY2 } from '$env/static/public';
import { PRIVATE_EMAILJS_KEY2 } from '$env/static/private';
import { sendEmail } from '$lib/mailfunction';

type Dancer = Database['public']['Tables']['dancers']['Row'];
type NormaDatabase = SupabaseClient<Database>;

interface RegistrationFormData {
	email: string;
	level: Level;
	role: Role;
	partnaire_email: string | undefined;
	payForPartner: boolean | undefined;
}

function formDataToRegistration(formData: FormData): RegistrationFormData {
	const email = formData.get('email');
	if (!email) {
		throw new Error('Adresse email manquante');
	}
	if (typeof email !== 'string') {
		throw new Error('Adresse email devrait être une chaîne de caractère');
	}
	const levelstr = formData.get('level');
	let level: number;
	if (!levelstr) {
		throw new Error('Niveau du danceur manquant');
	}
	if (typeof levelstr !== 'string') {
		throw new Error('Le niveau du danceur devrait être une chaîne de caractère');
	} else {
		level = parseInt(levelstr);
		if (!(level === Level.Débutant || level === Level.Confirmé || level === Level.Expert)) {
			throw new Error("Le niveau du danceur n'est pas reconnu " + levelstr);
		}
	}
	const rolestr = formData.get('role');
	let role: number;
	if (!rolestr) {
		throw new Error('Rôle du danceur manquant');
	}
	if (typeof rolestr !== 'string') {
		throw new Error('Le rôle du danceur devrait être une chaîne de caractère');
	} else {
		role = parseInt(rolestr);
		if (!(role === Role.Leader || role === Role.Suiveur)) {
			throw new Error("Le rôle du danceur n'est pas reconnu " + rolestr);
		}
	}
	const partnaire_email = formData.get('partnaire_email') || undefined;
	if (email === partnaire_email) {
		throw new Error("L'adresse mail de danceur ne doit pas être la même que celle du partenaire");
	}
	if (partnaire_email && typeof partnaire_email !== 'string') {
		throw new Error(" L'adresse email du partenaire devrait être une chaîne de caractère");
	}
	const payForPartner = formData.get('partner') || undefined;
	if (payForPartner && typeof payForPartner !== 'string' && typeof payForPartner !== 'boolean') {
		throw new Error('Le paiement pour le partenaire devrait être une chaîne de caractère');
	}

	return {
		email,
		level,
		role,
		partnaire_email,
		//@ts-expect-error any any
		payForPartner
	};
}

export const actions = {
	default: async ({ params, request, locals: { supabase } }) => {
		const formData = await request.formData();
		let registrationData;
		try {
			registrationData = formDataToRegistration(formData);
		} catch (error) {
			return fail(400, {
				error: error
			});
		}
		const { level, partnaire_email, role, email, payForPartner } = registrationData;

		if (payForPartner && !partnaire_email) {
			return fail(400, {
				error: "Vous devez renseigner l'adresse mail de votre partenaire"
			});
		}
		if (partnaire_email === email) {
			return fail(400, {
				error: "L'adresse mail de danceur ne doit pas être la même que celle du partenaire"
			});
		}

		//@ts-expect-error any any Supabase est mal typé
		const { count: registrationCount }: { count: number } = await supabase
			.from('dancers')
			.select('*', { count: 'exact', head: true })
			.eq('event', params.slug)
			.or('state.eq.' + State.Inscrit + ',state.eq.' + State['Règlement en cours']);
		let url = '';

		const { data: event } = await supabase
			.from('event')
			.select()
			.eq('slug', params.slug)
			.maybeSingle();

		//@ts-expect-error any any
		if (event && registrationCount >= event.total_limit) {
			url = await register(params, registrationData, supabase, State.Attente);
		} else {
			const check_role = await checkRole(params.slug, role, level, supabase);

			const checkLevelLimit = await fetchDancersByLevel(level, params.slug, supabase);

			//@ts-expect-error any any
			if (checkLevelLimit.countLevel >= checkLevelLimit.levelLimit) {
				url = await register(params, registrationData, supabase, State.Attente);
				redirect(302, url);
			}

			if (check_role) {
				if (partnaire_email) {
					const { data: partenaire, error: partenaireError } = await supabase
						.from('dancers')
						.select()
						.eq('event', params.slug)
						.eq('email', partnaire_email);
					if (partenaireError) {
						return fail(400, {
							error: 'Erreur lors de la recherche du partenaire renseigné'
						});
					}
					if (partenaire[0]) {
						if (partenaire[0].state === State.Attente) {
							//envoi auto mail pour payer
							setDancerOrderWaiting(params, partnaire_email, supabase);
						}
					} else {
						sendInvitationMail(partenaire, email);
					}
				}

				url = await register(params, registrationData, supabase, State['Règlement en cours']);
			} else {
				if (partnaire_email) {
					url = await register(params, registrationData, supabase, State['Règlement en cours']);
				}
			}
		}
		if (url) {
			redirect(302, url);
		} else {
			return fail(400, {
				error: 'Erreur'
			});
		}
	}
};

async function fetchDancersByLevel(level: any, eventSlug: string, supabase: NormaDatabase) {
	try {
		const { error, count: countLevel } = await supabase
			.from('dancers')
			.select('*', { count: 'exact', head: true })
			.eq('event', eventSlug)
			.eq('level', level)
			.or(`state.eq.${State.Inscrit},state.eq.${State['Règlement en cours']}`);

		const { data: event } = await supabase
			.from('event')
			.select()
			.eq('slug', eventSlug)
			.maybeSingle();

		if (error) {
			console.error('Error fetching dancers:', error);
			throw error;
		}
		const levelLimit = event?.level_limit;
		return { countLevel, levelLimit };
	} catch (error) {
		console.error('Error in fetchDancersByLevel:', error);
		throw error;
	}
}

async function checkRole(event: string, role: Role, level: Level, supabase: NormaDatabase) {
	//@ts-expect-error Supabase est mal typé
	const { data: selectedCount }: { data: number } = await supabase
		.from('dancers')
		.select('*(count)')
		.eq('event', event)
		.eq('role', role)
		.eq('level', level);

	//@ts-expect-error Supabase est mal typé
	const { data: oppositeCount }: { data: number } = await supabase
		.from('dancers')
		.select('*(count)')
		.eq('event', event)
		.eq('role', role === Role.Leader ? Role.Suiveur : Role.Leader)
		.eq('level', level);

	const { data: eventInfo } = await supabase.from('event').select().eq('slug', event).maybeSingle();

	const limit = eventInfo?.level_gap ? eventInfo.level_gap : 5;

	return selectedCount <= oppositeCount + limit;
}

async function register(
	params: { slug: string },
	registrationData: RegistrationFormData,
	supabase: NormaDatabase,
	state: State
): Promise<string> {
	const { email, level, role, partnaire_email, payForPartner } = registrationData;

	const { data: alreadyExist }: { data: Dancer | null } = await supabase
		.from('dancers')
		.select()
		.eq('email', email)
		.eq('event', params.slug)
		.maybeSingle();

	if (alreadyExist) {
		const alreadyExistUser = alreadyExist;
		const state: State = alreadyExistUser.state;
		switch (state) {
			case State['Règlement en cours']:
				return '/events/' + params.slug + '/commande?email=' + encodeURIComponent(email);
			case State.Inscrit:
				return '/events/' + params.slug + '/confirmation?email=' + encodeURIComponent(email);
			case State['Attente']:
				return '/events/' + params.slug + '/reservation';
			default:
				const exhaustiveCheck: never = state;
				throw new Error(`Unhandled state: ${exhaustiveCheck}`);
		}
	}
	let partenaireId;
	if (partnaire_email) {
		const { data: partenaireExist } = await supabase
			.from('dancers')
			.select()
			.eq('event', params.slug)
			.eq('email', partnaire_email)
			.limit(1)
			.single();
		if (partenaireExist) {
			if (partenaireExist.role === role) {
				throw new Error('Erreur : le partenaire existe déjà avec le même rôle');
			} else {
				partenaireId = partenaireExist.id;
			}
		}
	}
	await supabase.from('dancers').insert({
		email: email,
		state: state,
		role: role,
		level: level,
		event: params.slug
	});
	if (partnaire_email) {
		if (partenaireId) {
			const { error: updatePartnerError } = await supabase
				.from('dancers')
				.update({
					state: state
				})
				.eq('id', partenaireId)
				.eq('state', State.Attente);
			if (updatePartnerError) {
				throw new Error('Erreur lors de la mise à jour du partenaire');
			}
		} else {
			const oppositeRole = role === Role.Leader ? Role.Suiveur : Role.Leader;
			const { error: insertPartnerError } = await supabase.from('dancers').insert({
				email: partnaire_email,
				state: state,
				role: oppositeRole,
				level: level,
				event: params.slug
			});
			dancerIdAttribution(email, partnaire_email, supabase, params);
			if (insertPartnerError) {
				throw new Error("Erreur lors de l'enregistrement avec un partenaire");
			}
		}
	}

	switch (state) {
		case State['Règlement en cours']:
			return (
				'/events/' +
				params.slug +
				'/commande?email=' +
				encodeURIComponent(email) +
				(payForPartner ? '&partner=' + payForPartner : '')
			);
		case State.Attente:
			return '/events/' + params.slug + '/reservation';
		case State.Inscrit:
			throw new Error(`L'utilisateur ne devrait pas être inscrit`);
		default:
			const exhaustiveCheck: never = state;
			throw new Error(`Unhandled state: ${exhaustiveCheck}`);
	}
}

async function sendInvitationMail(partenaire: any, email: any) {
	const eventData = await fetch(
		'https://api.helloasso.com/v5/organizations/norma-ecv/forms/event/' +
			partenaire.envent +
			'/public',
		{
			method: 'GET',
			headers: {
				authorization: 'Bearer ' + get(access_token)
			}
		}
	).then((response) => response.json());
	const templateParams = {
		email: partenaire.email,
		firstname: partenaire.firstname,
		lastname: partenaire.lastname,
		eventName: eventData.title,
		partner: email,
		lien:
			'https://norma-azure.vercel.app/events/' +
			partenaire.event +
			'/commande?email=' +
			partenaire.email
	};
	emailjs
		.send('service_wcy3klk', 'template_p7qk0h3', templateParams, {
			publicKey: PUBLIC_EMAILJS_KEY2,
			privateKey: PRIVATE_EMAILJS_KEY2
		})
		.then(
			(response) => {
				console.log('SUCCESS!', response.status, response.text);
			},
			(error) => {
				console.log('FAILED...', error);
			}
		);
}

async function setDancerOrderWaiting(
	params: { slug: string },
	partnaire_email: string,
	supabase: NormaDatabase
) {
	const { data: userSendMail } = await supabase
		.from('dancers')
		.update({ state: State['Règlement en cours'] })
		.eq('email', partnaire_email)
		.eq('event', params.slug)
		.select();
	//@ts-expect-error any
	if (userSendMail && userSendMail.id) {
		//@ts-expect-error any
		await sendEmail(userSendMail.id);
	}
}

// Récupère les id du danceur et de son partenaire afin de les relier entre eux dans la BD
async function dancerIdAttribution(
	email: string,
	partner_email: string,
	supabase: NormaDatabase,
	params: { slug: string }
) {
	// Sélection du danseur principal
	const { data: dancer } = await supabase
		.from('dancers')
		.select()
		.eq('email', email)
		.eq('event', params.slug)
		.maybeSingle();

	// Mise à jour de l'ID du partenaire pour le danseur principal
	if (dancer?.id) {
		await updatePartnerId(supabase, partner_email, params.slug, dancer.id);
	}

	// Sélection du partenaire
	const { data: dancerPartner } = await supabase
		.from('dancers')
		.select()
		.eq('email', partner_email)
		.eq('event', params.slug)
		.maybeSingle();

	// Mise à jour de l'ID du partenaire pour le partenaire
	if (dancerPartner?.id) {
		await updatePartnerId(supabase, email, params.slug, dancerPartner.id);
	}
}
async function updatePartnerId(
	supabase: NormaDatabase,
	email: string,
	enventSlug: string,
	partnerId: number
) {
	await supabase
		.from('dancers')
		.update({ partner_id: partnerId })
		.eq('email', email)
		.eq('event', enventSlug);
}
