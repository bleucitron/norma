import { assoSlug, helloassoBaseUrl } from '$lib';
import { access_token } from '$lib/server/accessToken';
import { get } from 'svelte/store';
import { fail, redirect } from '@sveltejs/kit';
export async function load({ params, fetch, url }) {
	const email = url.searchParams.get('email') ? decodeURI(url.searchParams.get('email')) : '';
	const payForPartner = url.searchParams.get('partner');
	const event = await fetch(
		helloassoBaseUrl + assoSlug + '/forms/event/' + params.slug + '/public',
		{
			method: 'GET',
			headers: {
				authorization: 'Bearer ' + get(access_token)
			}
		}
	).then((resp) => resp.json());
	return {
		event: event,
		email: email,
		payForPartner: payForPartner
	};
}
interface PaymentFormData {
	tier: {
		id: number;
		label: string;
		price: number;
	};
}

function formDataToPayment(formData: FormData): PaymentFormData {
	const tiers = formData.get('tiers');
	if (!tiers) {
		throw new Error('Billet non choisi');
	}
	if (typeof tiers !== 'string') {
		throw new Error('Billet devrait être une chaîne de caractère');
	}
	const tier = JSON.parse(tiers);

	/*const payForPartner = formData.get('payForPartner');
	if (typeof payForPartner !== 'boolean') {
		throw new Error('Erreur sur le choix du paiment pour partenaire');
	}*/
	return {
		tier
		//payForPartner
	};
}

export const actions = {
	default: async ({ params, request, url }) => {
		const formData = await request.formData();
		console.log(url.searchParams.get('email'));
		const email = url.searchParams.get('email') ? decodeURI(url.searchParams.get('email')) : '';

		let paymentData;
		try {
			paymentData = formDataToPayment(formData);
		} catch (error) {
			return fail(400, {
				error
			});
		}
		if (paymentData.tier.price === 0) {
			redirect(302, '/events/' + params.slug + '/confirmation?email=' + email + '&orderId=Gratuit');
		}
		const body = {
			totalAmount: paymentData.tier.price,
			initialAmount: paymentData.tier.price,
			itemName: paymentData.tier.label,
			backUrl: 'https://norma-azure.vercel.app/events/' + params.slug + '/commande?email=' + email,
			errorUrl: 'https://norma-azure.vercel.app/events/' + params.slug + '/error',
			returnUrl:
				'https://norma-azure.vercel.app/events/' + params.slug + '/confirmation?email=' + email,
			containsDonation: true,
			terms: [],
			payer: {
				firstName: '',
				lastName: '',
				email: email,
				address: '',
				city: '',
				zipCode: '',
				country: 'FRA',
				companyName: ''
			},
			metadata: {
				produits: [
					{
						id: paymentData.tier.id,
						count: 1 //(paymentData.payForPartner ? 2 : 1)
					}
				]
			}
		};
		const resForRedirect = await fetch(helloassoBaseUrl + assoSlug + '/checkout-intents', {
			method: 'POST',
			headers: {
				authorization: 'Bearer ' + get(access_token),
				accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		}).then((resp) => {
			return resp.json();
		});
		redirect(302, resForRedirect.redirectUrl);
	}
};
