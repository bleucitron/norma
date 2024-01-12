import { access_token } from '$lib/server/accessToken'
import { get } from 'svelte/store';
import { fail, redirect } from '@sveltejs/kit';
export async function load({ params, fetch }) {
    return params
}

export const actions = {
    default: async ({ params, cookies, request, locals: { supabase } }: any) => {
        const formData = await request.formData();
        const email = formData.get('email')?.toString();
        const password = formData.get('password')?.toString();
        if (!(email && password)) {
            console.log('champs non valide')
            return fail(400, {
                error: 'champs non valide',
            });
        }

        const { data: dancer, error: loginError } = await supabase
            .from('dancers')
            .select()
            .eq('email', email)
            .eq('password', password)
        if (loginError || !dancer.length) {
            return fail(400, {
                error: 'Votre identifiant ou votre mot de passe est incorrect',
            });
        }

        //TODO: Mettre le danceur en session
        cookies.set('dancer', btoa(JSON.stringify(dancer[0])))
        throw redirect(302, '/events/' + params.eventSlug + '/dancer-info');
    },
}