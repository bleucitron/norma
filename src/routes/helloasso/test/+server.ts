import { supabase } from '$lib/supabase';
import { access_token } from '$lib/server/accessToken';
import { get } from 'svelte/store';
import emailjs from '@emailjs/nodejs';
import { PUBLIC_EMAILJS_KEY } from '$env/static/public';
import { PRIVATE_EMAILJS_KEY } from '$env/static/private';

export async function GET() {
	const email = 'corentin.corre@hotmail.fr';
	const event = 'concert-annexe';

	const { data: user, error: SelectError } = await supabase
		.from('dancers')
		.select()
		.eq('event', event)
		//.eq('order_id', order_id)
		.eq('email', email)
		.limit(1)
		.single();
	if (SelectError) {
		throw SelectError;
	}
	const eventInfos = await fetch(
		'https://api.helloasso.com/v5/organizations/norma-ecv/forms/event/' + event + '/public',
		{
			method: 'GET',
			headers: {
				authorization: 'Bearer ' + get(access_token)
			}
		}
	).then((resp) => resp.json());
	if (user && eventInfos) {
		const templateParams = {
			email: user.email,
			firstname: user.firstname,
			lastname: user.lastname,
			eventName: eventInfos.title,
			unsubscribeLink: ''
		};
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
	return new Response('Test envoyé');
}
