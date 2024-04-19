import { access_token } from '$lib/server/accessToken';
import { get } from 'svelte/store';
import { assoSlug, helloassoBaseUrl } from '$lib';

export async function load({ locals, params, fetch }) {
	const { data: users, error } = await locals.supabase.from('dancers').select('*');

	if (error) {
		console.error('Error fetching users', error);
		return { users: [] };
	}

	const eventNameFromUrl = params.slug;
	const filteredUsers = users.filter((user) => user.event === eventNameFromUrl);

	const dataResponse = await fetch(
		helloassoBaseUrl + assoSlug + '/forms/event/' + eventNameFromUrl + '/items',
		{
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + get(access_token)
			}
		}
	);

	const responseData = await dataResponse.json();

	if (!responseData || !Array.isArray(responseData.data)) {
		console.error('Expected data to be an array but got:', responseData);
		return { users: filteredUsers, eventName: eventNameFromUrl, payers: [] };
	}

	const userInfosByEmail = responseData.data.reduce((acc, item) => {
		const email = item.payer.email;
		acc[email] = { ...item.payer, pass: item.name };
		return acc;
	}, {});

	const mergedUsers = filteredUsers.map((user) => {
		if (userInfosByEmail[user.email]) {
			return { ...user, ...userInfosByEmail[user.email] };
		}
		return user;
	});

	return {
		users: mergedUsers,
		eventName: eventNameFromUrl
	};
}
