import { access_token } from '$lib/server/accessToken';
//import { supabase } from '$lib/supabase';
import { get } from 'svelte/store';
//import { fail } from '@sveltejs/kit';
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
/*interface PaymentFormData {
	email: string;
	firstname: string;
	lastame: string;

}*/

/*function formDataToPayment(formData: FormData): PaymentFormData {
	const email = formData.get('email');
	if (!email) {
		throw new Error('Adresse email manquante');
	}
	if (typeof email !== 'string') {
		throw new Error('Adresse email devrait être une chaîne de caractère');
	}

	return {
		email,
		level,
		role,
		partnaire_email
	};
}*/


export const actions = {
	default: async ({ params, request }) => {
		/*const event = await fetch(
			'https://api.helloasso.com/v5/organizations/norma-ecv/forms/event/' + params.slug + '/public',
			{
				method: 'GET',
				headers: {
					authorization: 'Bearer ' + get(access_token)
				}
			}
		).then((resp) => resp.json());*/
		//const formData = await request.formData();
		/*let paymentData;
		try {
			paymentData = formDataToPayment(formData);
		} catch (error) {
			return fail(400, {
				error
			});
		}*/
		const body = {
			"totalAmount": 7000,
			"initialAmount": 3000,
			"itemName": "Adhesion Football",
			"backUrl": "https://norma-azure.vercel.app/events/" + params.slug + "/commande?email=",
			"errorUrl": "https://norma-azure.vercel.app/events/" + params.slug + "/error",
			"returnUrl": "https://norma-azure.vercel.app/events/" + params.slug + "/confirmation?email=",
			"containsDonation": true,
			"terms": [],
			"payer": {
				"firstName": "",
				"lastName": "",
				"email": "john.doe@test.com",
				"dateOfBirth": "",
				"address": "",
				"city": "",
				"zipCode": "",
				"country": "",
				"companyName": ""
			},
			"metadata": {
				"reference": 12345,
				"libelle": "Adhesion Football",
				"userId": 98765,
				"produits": [
					{
						"id": 56,
						"count": 1
					},
					{
						"id": 78,
						"count": 3
					}
				]
			}
		}
		console.log(body)
	}
}

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
