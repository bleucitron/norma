import { access_token } from '$lib/server/accessToken';
import { assoSlug, helloassoBaseUrl } from '$lib';
import { get } from 'svelte/store';

export async function load({ params, fetch, locals }) {
	try {
		const slug = params.slug;

		const [events, event] = await Promise.all([
			fetch(helloassoBaseUrl + assoSlug + '/forms?pageIndex=1&pageSize=20&formTypes=event', {
				method: 'GET',
				headers: {
					authorization: 'Bearer ' + get(access_token)
				}
			})
				.then((response) => response.json())
				.then((result) => result.data),

			fetch(helloassoBaseUrl + assoSlug + '/forms/event/' + slug + '/public', {
				method: 'GET',
				headers: {
					authorization: 'Bearer ' + get(access_token)
				}
			}).then((response) => response.json())
		]);

		const { data: dancers, error } = await locals.supabase.from('dancers').select('*');

		if (error) {
			console.error('Error fetching users from Supabase', error);
			return { event: [], dancers: [], orders: [] };
		}

		return {
			event,
			events,
			dancers
		};
	} catch (error) {
		console.error('Error in load function', error);
	}
}
