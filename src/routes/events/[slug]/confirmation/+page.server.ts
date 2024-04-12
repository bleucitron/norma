import { access_token } from '$lib/server/accessToken';
import { get } from 'svelte/store';
import { assoSlug, helloassoBaseUrl } from '$lib';
import { supabase } from '$lib/supabase';
import { State } from '$lib/types/norma';
import emailjs from '@emailjs/nodejs';
import { PUBLIC_EMAILJS_KEY } from '$env/static/public';
import { PRIVATE_EMAILJS_KEY } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
export async function load({ params, fetch, url }) {
	const email = url.searchParams.get('email') ? decodeURI(url.searchParams.get('email')) : '';
	const orderId = url.searchParams.get('orderId') ? decodeURI(url.searchParams.get('orderId')) : '';
	const event = await fetch(
		helloassoBaseUrl + assoSlug + '/forms/event/' + params.slug + '/public',
		{
			method: 'GET',
			headers: {
				authorization: 'Bearer ' + get(access_token)
			}
		}
	).then((resp) => resp.json());
	if (!email) {
		redirect(302, '/events/' + params.slug + '/error');
	}
	const { error } = await supabase
		.from('dancers')
		.update({ order_id: orderId, state: State.Inscrit })
		.eq('event', params.slug)
		.eq('email', email)
		.select();
	if (error) {
		console.log(error);
		return false;
	}
	if (orderId) {
		const { data: user, error: SelectError } = await supabase
			.from('dancers')
			.select()
			.eq('event', params.slug)
			.eq('order_id', orderId)
			.eq('email', email)
			.limit(1)
			.single();
		if (SelectError) {
			throw SelectError;
		}
		if (user && event) {
			const templateParams = {
				email: user.email,
				firstname: user.firstname,
				lastname: user.lastname,
				eventName: event.title,
				unsubscribeLink: ''
			};
			console.log(templateParams);
			emailjs
				.send('service_wkav6z9', 'template_2a0ie3r', templateParams, {
					publicKey: PUBLIC_EMAILJS_KEY,
					privateKey: PRIVATE_EMAILJS_KEY
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
	}
	return {
		event: event,
		email: email
	};
}
