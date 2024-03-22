import { json } from '@sveltejs/kit';
import { State } from '$lib/types/norma';
import { supabase } from '$lib/supabase';
import { access_token } from '$lib/server/accessToken';
import { get } from 'svelte/store';
import emailjs from '@emailjs/browser';
import { PUBLIC_EMAILJS_KEY } from '$env/static/public';
import { PRIVATE_EMAILJS_KEY } from '$env/static/private';

type Order = {
	id: number;
	formSlug: string;
	payer: {
		email: string;
		firstName: string;
		lastName: string;
	};
};

type HelloAssoNotificationBody<T = unknown> = {
	eventType: string;
	data: T;
};

export async function GET() {
	return new Response('Hello');
}

export async function POST(event) {
	const body: HelloAssoNotificationBody = await event.request.json();
	if (body.eventType) {
		switch (body.eventType) {
			case 'Order':
				console.log(body.data);
				const data = body.data as Order;
				const order_id = data.id;
				const email = data.payer.email;
				const event = data.formSlug;

				const { error } = await supabase
					.from('dancers')
					.update({ order_id: order_id, state: State.Inscrit })
					.eq('event', event)
					.eq('email', email);
				if (error) {
					console.log(error);
				} else {
					const { data: user, error: SelectError } = await supabase
						.from('dancers')
						.select()
						.eq('event', event)
						.eq('order_id', order_id)
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
				}
				break;

			case 'Payment':
				console.log('Payment');
				break;
			case 'Form':
				console.log('Form');
				break;
			case 'Organization':
				console.log('Organization');
				break;
			default:
				break;
		}
	}
	return json({ success: true });
}
