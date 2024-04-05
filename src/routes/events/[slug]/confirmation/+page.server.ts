import { access_token } from '$lib/server/accessToken';
import { get } from 'svelte/store';
import { assoSlug, helloassoBaseUrl } from '$lib';
export async function load({ params, fetch, url }) {
	const email = url.searchParams.get('email') ? decodeURI(url.searchParams.get('email')) : '';
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
		event: event,
		email: email
	};
}
