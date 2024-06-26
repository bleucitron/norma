import { assoSlug, helloassoBaseUrl } from '$lib';
import { access_token } from '$lib/server/accessToken';
import { get } from 'svelte/store';
import { fail, redirect } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
export async function load({ params, fetch, url }) {
	const emailParam = url.searchParams.get('email');
	const email = emailParam ? decodeURIComponent(emailParam) : '';
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
	payForPartner: any;
}

function formDataToPayment(formData: FormData, url: URL): PaymentFormData {
	const tiers = formData.get('tiers');
	if (!tiers) {
		throw new Error('Billet non choisi');
	}
	if (typeof tiers !== 'string') {
		throw new Error('Billet devrait être une chaîne de caractère');
	}
	const tier = JSON.parse(tiers);

	const payForPartner = url.searchParams.get('partner') === 'on';

	return {
		tier,
		payForPartner
	};
}

export const actions = {
	default: async ({ params, request, url }) => {
		const formData = await request.formData();
		const emailParam = url.searchParams.get('email');
		const email = emailParam ? decodeURIComponent(emailParam) : '';

		let paymentData;
		try {
			paymentData = formDataToPayment(formData, url);
		} catch (error) {
			return fail(400, {
				error
			});
		}
		if (paymentData.tier.price === 0) {
			redirect(
				302,
				'/events/' +
					params.slug +
					'/confirmation?email=' +
					encodeURIComponent(email) +
					'&partner=' +
					paymentData.payForPartner +
					'&orderId=Gratuit' +
					'&tierId=' +
					paymentData.tier.id
			);
		}
		const { data: user } = await supabase
			.from('dancers')
			.select()
			.eq('event', params.slug)
			.eq('email', email)
			.limit(1)
			.single();
		const body = {
			totalAmount: paymentData.payForPartner ? paymentData.tier.price * 2 : paymentData.tier.price,
			initialAmount: paymentData.payForPartner
				? paymentData.tier.price * 2
				: paymentData.tier.price,
			itemName: paymentData.tier.label,
			backUrl:
				'https://norma-azure.vercel.app/events/' +
				params.slug +
				'/commande?email=' +
				encodeURIComponent(email) +
				'&partner=' +
				paymentData.payForPartner,
			errorUrl: 'https://norma-azure.vercel.app/events/' + params.slug + '/error',
			returnUrl:
				'https://norma-azure.vercel.app/events/' +
				params.slug +
				'/confirmation?email=' +
				encodeURIComponent(email) +
				'&partner=' +
				paymentData.payForPartner +
				'&tierId=' +
				paymentData.tier.id,
			containsDonation: true,
			terms: [],
			payer: {
				firstName: user.firstname ? user.firstname : '',
				lastName: user.lastname ? user.lastname : '',
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
						count: paymentData.payForPartner ? 2 : 1
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
