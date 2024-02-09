import { access_token } from '$lib/server/accessToken';
import { get } from 'svelte/store';

export async function load({ fetch, locals }) {
	try {
		const [eventsResponse, ordersResponse] = await Promise.all([
			fetch(
				'https://api.helloasso.com/v5/organizations/norma-ecv/forms?pageIndex=1&pageSize=20&formTypes=event',
				{
					method: 'GET',
					headers: {
						authorization: 'Bearer ' + get(access_token)
					}
				}
			),
			fetch('https://api.helloasso.com/v5/organizations/norma-ecv/items', {
				method: 'GET',
				headers: {
					authorization: 'Bearer ' + get(access_token)
				}
			})
		]);
		const eventsData = await eventsResponse.json();
		const events = eventsData.data;

		const ordersData = await ordersResponse.json();
		const orders = ordersData.data;

		const { data: dancers, error } = await locals.supabase.from('dancers').select('*');
		if (error) {
			console.error('Error fetching users from Supabase', error);
			return { events: [], dancers: [], orders: [] };
		}

		return {
			events: events,
			dancers: dancers,
			orders: orders
		};
	} catch (error) {
		console.error('Error in load function', error);
		return { events: [], dancers: [], orders: [] };
	}
}
