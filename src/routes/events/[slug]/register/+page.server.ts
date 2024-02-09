import { fail, redirect } from '@sveltejs/kit';
// import { access_token } from '$lib/server/accessToken';
// import { get } from 'svelte/store';
import { State } from '$lib/utils/enums';

export const actions = {
	default: async ({ params, request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString();
		const level = formData.get('level')?.toString();
		const role = formData.get('role')?.toString();
		const partnaire_email = formData.get('partnaire_email')?.toString();

		const is_partner = formData.get('partner')?.toString();
		if (!(email && level && role)) {
			return fail(400, {
				error: 'champs non valide'
			});
		}
		if (email === partnaire_email) {
			return fail(400, {
				error: "L'email de votre partenaire ne peux pas etre identique au votre"
			});
		}

		// const event = await fetch(
		//     'https://api.helloasso.com/v5/organizations/norma-ecv/forms/event/' + params.slug + '/public',
		//     {
		//         method: 'GET',
		//         headers: {
		//             authorization: 'Bearer ' + get(access_token)
		//         }
		//     }
		// ).then((resp) => resp.json());
		const { data: registrationCount, error: countError } = await supabase
			.from('dancers')
			.select('*(count)')
			.eq('event', params.slug)
			.or('state.eq.' + State.Inscrit + ',state.eq.' + State['Règlement en cours']);
		if (countError) {
			return fail(400, {
				error: "Erreur lors de la recherche du nombre d'inscrits"
			});
		}
		let url = '';

		if (!Number(registrationCount)) {
			registrationCount = 0;
		}
		if (registrationCount >= 50) {
			url = await register(params, formData, supabase, State.Attente);
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
				if (partenaire) {
					if (partenaire.state === State.Attente) {
						//envoi auto mail pour payer
						setDancerOrderWaiting(params, partnaire_email, supabase);
					}
				} else {
					sendInvitationMail(partnaire_email);
				}
			}
			url = await register(params, formData, supabase, State['Règlement en cours']);
			if (is_partner) {
				url = await registerPartner(params, formData, supabase, State['Règlement en cours']);
			}
		} else {
			if (partnaire_email) {
				const { data: partenaire } = await supabase
					.from('dancers')
					.select()
					.eq('event', params.slug)
					.eq('email', partnaire_email);

				if (partenaire) {
					if (partenaire.state === State.Inscrit) {
						url = await register(params, formData, supabase, State['Règlement en cours']);
					}
				} else {
					sendInvitationMail(partnaire_email);
				}
			}
			if (is_partner) {
				url = await registerPartner(params, formData, supabase, State.Attente);
			}
			url = await register(params, formData, supabase, State.Attente);
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

async function checkRole(event, role, level, supabase) {
	const { data: selectedCount } = await supabase
		.from('dancers')
		.select('*(count)')
		.eq('event', event)
		.eq('role', role)
		.eq('level', level);

	const { data: oppositeCount } = await supabase
		.from('dancers')
		.select('*(count)')
		.eq('role', role === 'leader' ? 'suiveur' : 'leader')
		.eq('level', level);

	return selectedCount <= oppositeCount + 2;
}
async function registerPartner(params, formData, supabase, state) {
	const email = formData.get('email')?.toString();
	const partner_level = formData.get('partner_level')?.toString();
	const partner_role = formData.get('partner_role')?.toString();
	const partnaire_email = formData.get('partnaire_email')?.toString();

	const { data: alreadyExist } = await supabase
		.from('dancers')
		.select()
		.eq('email', email)
		.eq('event', params.slug);

	if (alreadyExist[0]) {
		const alreadyExistUser = alreadyExist[0];
		console.log(alreadyExistUser.state);
		console.log(params.slug);
		switch (alreadyExistUser.state) {
			case State['Règlement en cours']:
				return '/events/' + params.slug + '/commande';
			case State.Inscrit:
				return '/events/' + params.slug + '/confirmation';
			case State['Attente']:
				return '/events/' + params.slug + '/reservation';
			default:
				return '';
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
		default:
			return '';
	}
}

async function register(params, formData, supabase, state) {
	const email = formData.get('email')?.toString();
	const level = formData.get('level')?.toString();
	const role = formData.get('role')?.toString();
	const partnaire_email = formData.get('partnaire_email')?.toString();

	const { data: alreadyExist } = await supabase
		.from('dancers')
		.select()
		.eq('email', email)
		.eq('event', params.slug);

	if (alreadyExist[0]) {
		const alreadyExistUser = alreadyExist[0];
		console.log(alreadyExistUser.state);
		console.log(params.slug);
		switch (alreadyExistUser.state) {
			case State['Règlement en cours']:
				return '/events/' + params.slug + '/commande';
			case State.Inscrit:
				return '/events/' + params.slug + '/confirmation';
			case State['Attente']:
				return '/events/' + params.slug + '/reservation';
			default:
				return '';
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
		return '';
	}
	switch (state) {
		case State['Règlement en cours']:
			return '/events/' + params.slug + '/commande';
		case State.Attente:
			return '/events/' + params.slug + '/reservation';
		default:
			return '';
	}
}

// function sendInvitationMail(email) {

// }

async function setDancerOrderWaiting(params, partnaire_email, supabase) {
	const { error } = await supabase
		.from('countries')
		.update({ state: State['Règlement en cours'] })
		.eq('email', partnaire_email)
		.eq('event', params.slug);
	if (!error) {
		//send mail auto pour payer
	}
}
