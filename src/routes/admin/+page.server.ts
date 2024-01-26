import { access_token } from '$lib/server/accessToken';
import { get } from 'svelte/store';

export async function load({ fetch, locals }) {
	try {
		const eventsResponse = await fetch(
			'https://api.helloasso.com/v5/organizations/norma-ecv/forms?pageIndex=1&pageSize=20&formTypes=event',
			{
				method: 'GET',
				headers: {
					authorization: 'Bearer ' + get(access_token)
				}
			}
		);
		const eventsData = await eventsResponse.json();
		const events = eventsData.data;

		const { data: dancers, error } = await locals.supabase.from('dancers').select('*');
		if (error) {
			console.error('Error fetching users from Supabase', error);
			return { events: [], dancers: [] };
		}

		return {
			events: events,
			dancers: dancers
		};
	} catch (error) {
		console.error('Error in load function', error);
		return { events: [], dancers: [] };
	}
}
