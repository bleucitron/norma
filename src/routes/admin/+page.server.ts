import { access_token } from '$lib/server/accessToken';
import { get } from 'svelte/store';
import type { Database } from '../../types/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

type NormaDatabase = SupabaseClient<Database>;

export async function load({ fetch, locals: { supabase } }) {
	try {
		const { data: events, error } = await fetch(
			`https://api.helloasso.com/v5/organizations/norma-ecv/forms?pageIndex=1&pageSize=20&formTypes=event`,
			{
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + get(access_token)
				}
			}
		).then((res) => res.json());

		if (error) {
			console.error('Error fetching users from Supabase', error);
			return { events: [], dancers: [], orders: [] };
		}

		const slugs = events.map((event: any) => event.formSlug);
		await insertNewSlugs(slugs, supabase);

		return {
			events
		};
	} catch (error) {
		console.error('Error in load function', error);
		return { events: [], dancers: [] };
	}
}

async function insertNewSlugs(slugs: string[], supabase: NormaDatabase) {
	const insertPromises = slugs.map(async (slug: string) => {
		const { data: existingSlugs, error: selectError } = await supabase
			.from('event')
			.select('slug')
			.eq('slug', slug);

		if (selectError) {
			console.error(`Error querying slug ${slug}:`, selectError.message);
			return;
		}

		if (existingSlugs.length === 0) {
			const { error: insertError } = await supabase.from('event').insert({ slug: slug });

			if (insertError) {
				console.error('Error inserting slug:', insertError.message);
			} else {
				console.log(`Successfully inserted slug: ${slug}`);
			}
		} else {
			console.log(`Slug already exists in the database: ${slug}`);
		}
	});

	await Promise.all(insertPromises);
}
