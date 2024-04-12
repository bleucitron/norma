import { supabase } from '$lib/supabase';
import { access_token } from '$lib/server/accessToken';
import { get } from 'svelte/store';
import { assoSlug, helloassoBaseUrl } from '$lib';
import emailjs from '@emailjs/nodejs';
import { PUBLIC_EMAILJS_KEY } from '$env/static/public';
import { PRIVATE_EMAILJS_KEY } from '$env/static/private';

export async function sendEmail(userId) {
	const { data: user, error } = await supabase
		.from('dancers')
		.select('*')
		.eq('id', userId)
		.single();

	if (error) {
		console.error('Error fetching user:', error);
		return { status: 404, body: { error: 'User not found' } };
	}

	const event = await fetch(
		helloassoBaseUrl + assoSlug + '/forms/event/' + user.event + '/public',
		{
			method: 'GET',
			headers: {
				authorization: 'Bearer ' + get(access_token)
			}
		}
	).then((resp) => resp.json());

	const serviceId = 'service_wkav6z9';
	const templateId = 'template_8lxwydg';

	const templateParams = {
		email: user.email,
		firstname: user.firstname,
		lastname: user.lastname,
		eventName: event.title,
		lien: helloassoBaseUrl + assoSlug + '/events/' + user.event + '/commande?email=' + user.email
	};
	emailjs
		.send(serviceId, templateId, templateParams, {
			publicKey: PUBLIC_EMAILJS_KEY,
			privateKey: PRIVATE_EMAILJS_KEY
		})
		.then(
			(response) => {
				console.log('SUCCES', response.status, response.text);
			},
			(error) => {
				console.log('FAILED', error);
			}
		);
}
