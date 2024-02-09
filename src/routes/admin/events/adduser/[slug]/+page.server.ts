import { fail, redirect } from '@sveltejs/kit';


export async function load({ params, fetch }) {
    return {
        slug: params.slug
    }
}
export const actions = {
    default: async ({ params, request, locals: { supabase } }) => {
        const formData = await request.formData();
        const email = formData.get('email')?.toString();
        const firstname = formData.get('firstname')?.toString();
        const lastname = formData.get('lastname')?.toString();
        const level = formData.get('level')?.toString();
        const role = formData.get('role')?.toString();
        const partnaire_email = formData.get('partnaire_email')?.toString();
        if (!(email && firstname && lastname && level && role)) {
            return fail(400, {
                error: 'champs non valide'
            });
        }
        if (email === partnaire_email) {
            return fail(400, {
                error: "L'email de votre partenaire ne peux pas etre identique au votre"
            });
        }

        const error = await register(params, formData, supabase, 2)
        if (error) {
            return fail(400, {
                error: error
            });
        } else {
            redirect(302, '/admin/events/' + params.slug + '/users')
        }
    },
};

async function register(params, formData, supabase, state) {
    const email = formData.get('email')?.toString();
    const firstname = formData.get('firstname')?.toString();
    const lastname = formData.get('lastname')?.toString();
    const level = formData.get('level')?.toString();
    const role = formData.get('role')?.toString();
    const partnaire_email = formData.get('partnaire_email')?.toString();
    let error = ''

    const { data: alreadyExist, error: alreadyExistError } = await supabase
        .from('dancers')
        .select()
        .eq('email', email)
        .eq('event', params.slug)

    if (alreadyExist[0]) {
        error = 'un danceur existe déjà avec cet email';
        return error;
    }

    const { error: insertError } = await supabase
        .from('dancers')
        .insert({
            email: email,
            firstname: firstname,
            lastname: lastname,
            state: state,
            role: role,
            level: level,
            event: params.slug,
            partner_email: partnaire_email
        })
    if (insertError) {
        error = 'Une erreur est survenue :' + insertError;
    }
    return error;
}
