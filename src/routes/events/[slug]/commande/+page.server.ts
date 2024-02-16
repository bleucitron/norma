import { access_token } from '$lib/server/accessToken';
import { supabase } from '$lib/supabase';
import { get } from 'svelte/store';
export async function load({ params, fetch }) {
	const event = await fetch(
		'https://api.helloasso.com/v5/organizations/norma-ecv/forms/event/' + params.slug + '/public',
		{
			method: 'GET',
			headers: {
				authorization: 'Bearer ' + get(access_token)
			}
		}
	).then((resp) => resp.json());
	return event;
}

const handleDancerUpdate = (payload) => {
	console.log('Change received!', payload)
}

supabase
	.channel('dancers')
	.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'dancers' }, handleDancerUpdate)
	.subscribe()
