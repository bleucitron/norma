import { error, redirect } from '@sveltejs/kit';

export const load = async ({ parent, depends }) => {
	const { session, supabase } = await parent();
	const userId = session?.user?.id;

	depends('app:users');

	if (!userId) {
		throw redirect(307, '/');
	}
};
