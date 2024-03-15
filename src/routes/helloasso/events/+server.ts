
import { json } from '@sveltejs/kit';
import { State } from '$lib/types/norma';
import { supabase } from '$lib/supabase';

type Order = {
	order: {
		id: number;
		formSlug: string;
	};
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
				const order_id = data.order.id;
				const email = data.payer.email;
				const event = data.order.formSlug;

				const { error } = await supabase
					.from('dancers')
					.update({ order_id: order_id, state: State.Inscrit })
					.eq('event', event)
					.eq('email', email);
				if (error) {
					console.log(error);
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
