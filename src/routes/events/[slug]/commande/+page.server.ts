import { access_token } from '$lib/server/accessToken';
//import { supabase } from '$lib/supabase';
import { get } from 'svelte/store';
import { fail, redirect } from '@sveltejs/kit';
export async function load({ params, fetch, url }) {
	const email = url.searchParams.get('email') ? decodeURI(url.searchParams.get('email')) : '';
	const event = await fetch(
		'https://api.helloasso.com/v5/organizations/norma-ecv/forms/event/' + params.slug + '/public',
		{
			method: 'GET',
			headers: {
				authorization: 'Bearer ' + get(access_token)
			}
		}
	).then((resp) => resp.json());
	return {
		event: event,
		email: email
	};
}
interface PaymentFormData {
	email: string;
	tiers: {
		id: number;
		label: string;
		price: number;
	};
}

function formDataToPayment(formData: FormData): PaymentFormData {
	const email = formData.get('email');
	if (!email) {
		throw new Error('Adresse email manquante');
	}
	if (typeof email !== 'string') {
		throw new Error('Adresse email devrait être une chaîne de caractère');
	}
	const jsonTiers = formData.get('tiers');
	if (!jsonTiers) {
		throw new Error('Type de billet manquant');
	}
	if (typeof jsonTiers !== 'string' || !JSON.parse(jsonTiers)) {
		throw new Error('Problème sur le type de billet');
	}
	const tiers = JSON.parse(jsonTiers);

	return {
		email,
		tiers
	};
}

export const actions = {
	default: async ({ params, request }) => {
		const event = await fetch(
			'https://api.helloasso.com/v5/organizations/norma-ecv/forms/event/' + params.slug + '/public',
			{
				method: 'GET',
				headers: {
					authorization: 'Bearer ' + get(access_token)
				}
			}
		).then((resp) => resp.json());
		const formData = await request.formData();
		let paymentData;
		try {
			paymentData = formDataToPayment(formData);
		} catch (error) {
			return fail(400, {
				error
			});
		}
		const redirectUrl = await fetch(
			'https://api.helloasso.com/v5/organizations/norma-ecv/checkout-intents',
			{
				method: 'POST',
				headers: {
					authorization: 'Bearer ' + get(access_token)
				},
				body: {
					totalAmount: paymentData.tiers.price,
					initialAmount: paymentData.tiers.price,
					itemName: event.title,
					backUrl:
						'https://norma-azure.vercel.app/events/' +
						params.slug +
						'/commande?email=' +
						paymentData.email,
					errorUrl:
						'https://norma-azure.vercel.app/events/' +
						params.slug +
						'/error?email=' +
						paymentData.email,
					returnUrl:
						'https://norma-azure.vercel.app/events/' +
						params.slug +
						'/confirmation?email=' +
						paymentData.email,
					containsDonation: false,
					payer: {
						email: paymentData.email
					},
					metadata: {
						produits: [
							{
								id: paymentData.tiers.id,
								count: 1
							}
						]
					}
				}
			}
		).then((resp) => {
			console.log(resp);
			return resp.json();
		});

		if (redirectUrl.redirectUrl) {
			redirect(302, redirectUrl.redirectUrl);
		} else {
			console.log(redirectUrl);
		}
	}
};

/*const handleDancerUpdate = (payload) => {
	console.log('Change received!', payload)
	if (true) {

	}
}

supabase
	.channel('dancers')
	.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'dancers' }, handleDancerUpdate)
	.subscribe()
	*/
