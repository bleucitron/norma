import { access_token } from '$lib/server/accessToken';
import { get } from 'svelte/store';

export async function load({ fetch }) {
	const eventsResponse = await fetch(
		'https://api.helloasso.com/v5/organizations/norma-ecv/forms?pageIndex=1&pageSize=20&formTypes=event',
		{
			method: 'GET',
			headers: {
				authorization: 'Bearer ' + get(access_token)
			}
		}
	);
	const events = await eventsResponse.json();

	const eventsName = events.data.map((event: { formSlug: string }) => event.formSlug);

	const eventDetailsPromises = eventsName.map(async (eventName: string) => {
		try {
			const response = await fetch(
				`https://api.helloasso.com/v5/organizations/norma-ecv/forms/event/${eventName}/public`,
				{
					method: 'GET',
					headers: {
						authorization: 'Bearer ' + get(access_token)
					}
				}
			);
			return await response.json();
		} catch (error) {
			console.error("Erreur lors de la récupération de l'événement:", error);
			return null;
		}
	});

	const eventsBySlug = await Promise.all(eventDetailsPromises);
	const filteredEventsBySlug = eventsBySlug.filter((event) => event !== null);

	return {
		events: events.data,
		eventsDetail: filteredEventsBySlug
	};
}

export const actions = {
	default: async ({ locals: { supabase } }) => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error('Error logging out:', error);
			return { status: 500, errors: { message: 'Logout failed' } };
		}
		return {
			status: 200,
			body: { message: 'Logout successful' }
		};
	}
};
