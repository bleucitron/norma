import { fail, redirect } from '@sveltejs/kit';
// import { access_token } from '$lib/server/accessToken';
// import { get } from 'svelte/store';
import { Level, Role, State } from '$lib/types/norma';
import type { Database } from '../../../../types/supabase';

type Dancer = Database['public']['Tables']['dancers']['Row'];

interface RegistrationFormData {
	email: string;
	level: Level;
	role: Role;
	partner_level: Level | undefined;
	partner_role: Role | undefined;
	partnaire_email: string | undefined;
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
	const partner_levelstr = formData.get('partner_level');
	let partner_level: number | undefined = undefined;
	if (partner_levelstr) {
		if (typeof partner_levelstr !== 'string') {
			throw new Error('Le niveau du danceur du partenaire devrait être une chaîne de caractère');
		} else {
			partner_level = parseInt(partner_levelstr);
			if (
				!(
					partner_level === Level.Débutant ||
					partner_level === Level.Confirmé ||
					partner_level === Level.Expert
				)
			) {
				throw new Error("Le niveau du danceur du partenaire n'est pas reconnu " + partner_levelstr);
			}
		}
	}
	const partner_rolestr = formData.get('partner_role');
	let partner_role: number | undefined = undefined;
	if (partner_rolestr) {
		if (typeof partner_rolestr !== 'string') {
			throw new Error('Le rôle du danceur du partenaire devrait être une chaîne de caractère');
		} else {
			partner_role = parseInt(partner_rolestr);
			if (!(partner_role === Role.Leader || partner_role === Role.Suiveur)) {
				throw new Error("Le rôle du danceur du partenaire n'est pas reconnu " + partner_rolestr);
			}
		}
	}

	return {
		email,
		level,
		role,
		partnaire_email,
		partner_level,
		partner_role
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
				error
			});
		}
		const { level, partnaire_email, role, partner_level, partner_role } = registrationData;
		const is_partner = partner_level && partner_role;

		// const event = await fetch(
		//     'https://api.helloasso.com/v5/organizations/norma-ecv/forms/event/' + params.slug + '/public',
		//     {
		//         method: 'GET',
		//         headers: {
		//             authorization: 'Bearer ' + get(access_token)
		//         }
		//     }
		// ).then((resp) => resp.json());

		//@ts-expect-error Supabase est mal typé
		let { data: registrationCount }: { data: number } = await supabase
			.from('dancers')
			.select('*(count)')
			.eq('event', params.slug)
			.or('state.eq.' + State.Inscrit + ',state.eq.' + State['Règlement en cours']);
		let url = '';

		if (!Number.isSafeInteger(registrationCount)) {
			registrationCount = 0;
		}
		if (registrationCount >= 50) {
			url = await register(params, registrationData, supabase, State.Attente);
		}
		const check_role = await checkRole(params.slug, role, level, supabase);

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
					throw new Error('TODO : sendInvitationMail(partnaire_email);');
				}
			}
			url = await register(params, registrationData, supabase, State['Règlement en cours']);
			if (is_partner) {
				url = await registerPartner(
					params,
					registrationData,
					supabase,
					State['Règlement en cours']
				);
			}
		} else {
			if (partnaire_email) {
				const { data: partenaire } = await supabase
					.from('dancers')
					.select()
					.eq('event', params.slug)
					.eq('email', partnaire_email);

				if (partenaire && partenaire[0]) {
					if (partenaire[0].state === State.Inscrit) {
						url = await register(params, registrationData, supabase, State['Règlement en cours']);
					}
				} else {
					throw new Error('TODO : sendInvitationMail(partnaire_email);');
				}
			}
			if (is_partner) {
				url = await registerPartner(params, registrationData, supabase, State.Attente);
			}
			url = await register(params, registrationData, supabase, State.Attente);
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

async function checkRole(event, role: Role, level: Level, supabase) {
	const { data: selectedCount } = await supabase
		.from('dancers')
		.select('*(count)')
		.eq('event', event)
		.eq('role', role)
		.eq('level', level);

	const { data: oppositeCount } = await supabase
		.from('dancers')
		.select('*(count)')
		.eq('role', role === Role.Leader ? Role.Suiveur : Role.Leader)
		.eq('level', level);

	return selectedCount <= oppositeCount + 2;
}
async function registerPartner(
	params,
	registrationData: RegistrationFormData,
	supabase,
	state: State
) {
	const { email, partner_level, partner_role, partnaire_email } = registrationData;

	const { data: alreadyExist }: { data: Dancer | undefined } = await supabase
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
				return '/events/' + params.slug + '/commande';
			case State.Inscrit:
				return '/events/' + params.slug + '/confirmation';
			case State['Attente']:
				return '/events/' + params.slug + '/reservation';
			default:
				const exhaustiveCheck: never = state;
				throw new Error(`Unhandled state: ${exhaustiveCheck}`);
		}
	}
	const { error: insertError } = await supabase.from('dancers').insert({
		email: partnaire_email,
		state: state,
		role: partner_role,
		level: partner_level,
		event: params.slug,
		partner_email: email
	});
	if (insertError) {
		return '';
	}
	switch (state) {
		case State['Règlement en cours']:
			return '/events/' + params.slug + '/commande';
		case State.Attente:
			return '/events/' + params.slug + '/reservation';
		case State.Inscrit:
			throw new Error(`L'utilisateur ne devrait pas être inscrit`);
		default:
			const exhaustiveCheck: never = state;
			throw new Error(`Unhandled state: ${exhaustiveCheck}`);
	}
}

async function register(
	params,
	registrationData: RegistrationFormData,
	supabase,
	state: State
): Promise<string> {
	const { email, level, role } = registrationData;
	let { partnaire_email } = registrationData;

	const oppositeRole = role === Role.Leader ? Role.Suiveur : Role.Leader;

	if (!partnaire_email) {
		const { data: userWithNoPartner } = await supabase
			.from('dancers')
			.select()
			.eq('partner_email', '')
			.eq('role', oppositeRole)
			.eq('state', State.Inscrit)
			.eq('event', params.slug)
			.order('created_at', { ascending: true });

		if (userWithNoPartner && userWithNoPartner[0]) {
			const selectedUser = userWithNoPartner[0];
			partnaire_email = selectedUser.email;
			const { error: attributionPartnerError } = await supabase
				.from('dancers')
				.update({ partner_email: email })
				.match({ email: selectedUser.email, event: params.slug });

			if (attributionPartnerError) {
				throw new Error("Erreur lors de l'attribution d'un partenaire");
			}
		}
	}

	const { data: alreadyExist }: { data: Dancer | undefined } = await supabase
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
				return '/events/' + params.slug + '/commande';
			case State.Inscrit:
				return '/events/' + params.slug + '/confirmation';
			case State['Attente']:
				return '/events/' + params.slug + '/reservation';
			default:
				const exhaustiveCheck: never = state;
				throw new Error(`Unhandled state: ${exhaustiveCheck}`);
		}
	}

	const { error: insertError } = await supabase.from('dancers').insert({
		email: email,
		state: state,
		role: role,
		level: level,
		event: params.slug,
		partner_email: partnaire_email
	});
	if (insertError) {
		throw new Error("Erreur lors de l'enregistrement");
	}
	switch (state) {
		case State['Règlement en cours']:
			return '/events/' + params.slug + '/commande';
		case State.Attente:
			return '/events/' + params.slug + '/reservation';
		case State.Inscrit:
			throw new Error(`L'utilisateur ne devrait pas être inscrit`);
		default:
			const exhaustiveCheck: never = state;
			throw new Error(`Unhandled state: ${exhaustiveCheck}`);
	}
}

// function sendInvitationMail(email) {

// }

async function setDancerOrderWaiting(params, partnaire_email, supabase) {
	const { error } = await supabase
		.from('dancers')
		.update({ state: State['Règlement en cours'] })
		.eq('email', partnaire_email)
		.eq('event', params.slug);
	if (!error) {
		throw new Error('TODO : send mail auto pour payer');
	}
}
