import { json } from '@sveltejs/kit';
import { State } from '$lib/types/norma';
import { sendEmail } from '$lib/mailfunction';

export async function DELETE({ locals, params }: { locals: any; params: { userId: number } }) {
	const { userId } = params;

	const { error } = await locals.supabase.from('dancers').delete().eq('id', userId);

	if (error) {
		return error(500, { message: "Erreur lors de la suppression de l'utilisateur" });
	}

	return json({ message: "L'utilisateur a été supprimé avec succès" });
}

export async function PATCH({ locals, request, params }) {
	const { userId } = params;
	const userData = await request.json();

	const { data: dancer } = await locals.supabase
		.from('dancers')
		.select()
		.eq('id', userId)
		.limit(1)
		.single();

	const { error } = await locals.supabase.from('dancers').update(userData).eq('id', userId);

	if (error) {
		throw error;
	}

	const newSate = parseInt(userData.state);
	if (dancer?.state === State.Attente && newSate === State['Règlement en cours']) {
		await sendEmail(parseInt(userId));
	}

	return json({ message: "L'utilisateur a été modifié avec succès" });
}
