import { Level, Role, State } from '$lib/types/norma';
import { fail, redirect } from '@sveltejs/kit';
import type { Database } from '../../../../../types/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

type NormaDatabase = SupabaseClient<Database>;

interface RegistrationFormData {
	email: string;
	level: Level;
	firstname: string;
	lastname: string;
	role: Role;
	partnaire_email: string | undefined;
}

function formDataToRegistration(formData: FormData): RegistrationFormData {
	const email = formData.get('email');
	if (!email) {
		throw new Error('Adresse email manquante');
	}
	if (typeof email !== 'string') {
		throw new Error('Adresse email devrait être une chaîne de caractère');
	}
	const levelstr = formData.get('level');
	let level: number;
	if (!levelstr) {
		throw new Error('Niveau du danceur manquant');
	}
	if (typeof levelstr !== 'string') {
		throw new Error('Le niveau du danceur devrait être une chaîne de caractère');
	} else {
		level = parseInt(levelstr);
		if (!(level === Level.Débutant || level === Level.Confirmé || level === Level.Expert)) {
			throw new Error("Le niveau du danceur n'est pas reconnu " + levelstr);
		}
	}
	const rolestr = formData.get('role');
	let role: number;
	if (!rolestr) {
		throw new Error('Rôle du danceur manquant');
	}
	if (typeof rolestr !== 'string') {
		throw new Error('Le rôle du danceur devrait être une chaîne de caractère');
	} else {
		role = parseInt(rolestr);
		if (!(role === Role.Leader || role === Role.Suiveur)) {
			throw new Error("Le rôle du danceur n'est pas reconnu " + rolestr);
		}
	}
	const partnaire_email = formData.get('partnaire_email') || undefined;
	if (email === partnaire_email) {
		throw new Error("L'adresse mail de danceur ne doit pas être la même que celle du partenaire");
	}
	if (partnaire_email && typeof partnaire_email !== 'string') {
		throw new Error(" L'adresse email du partenaire devrait être une chaîne de caractère");
	}
	const firstname = formData.get('firstname');
	if (!firstname) {
		throw new Error('Le prénom est manquant');
	}
	if (typeof firstname !== 'string') {
		throw new Error('Le prénom devrait être une chaîne de caractère');
	}
	const lastname = formData.get('lastname');
	if (!lastname) {
		throw new Error('Le nom est manquant');
	}
	if (typeof lastname !== 'string') {
		throw new Error('Le nom devrait être une chaîne de caractère');
	}

	return {
		email,
		level,
		role,
		partnaire_email,
		firstname,
		lastname
	};
}

export async function load({ params }) {
	return {
		slug: params.slug
	};
}
export const actions = {
	default: async ({ params, request, locals: { supabase } }) => {
		const formData = await request.formData();
		let registrationData;
		try {
			registrationData = formDataToRegistration(formData);
		} catch (error) {
			return fail(400, {
				error
			});
		}

		const error = await register(params, registrationData, supabase, 2);
		if (error) {
			return fail(400, {
				error: error
			});
		} else {
			redirect(302, '/admin/events/' + params.slug + '/users');
		}
	}
};

async function register(
	params: { slug: string },
	registrationData: RegistrationFormData,
	supabase: NormaDatabase,
	state: State
) {
	const { email, level, role, partnaire_email, firstname, lastname } = registrationData;
	let error = '';

	const { data: alreadyExist } = await supabase
		.from('dancers')
		.select()
		.eq('email', email)
		.eq('event', params.slug)
		.maybeSingle();

	if (alreadyExist) {
		error = 'un danceur existe déjà avec cet email';
		return error;
	}

	const { error: insertError } = await supabase.from('dancers').insert({
		email: email,
		firstname: firstname,
		lastname: lastname,
		state: state,
		role: role,
		level: level,
		event: params.slug,
		partner_email: partnaire_email
	});
	if (insertError) {
		error = 'Une erreur est survenue :' + insertError;
	}
	return error;
}
