import { access_token } from '$lib/server/accessToken';
import { assoSlug, helloassoBaseUrl } from '$lib';
import { get } from 'svelte/store';
export async function load({ params, fetch }) {
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
		event: event
	};
}
