import type { AuthSession } from '@supabase/supabase-js';
import { fail, redirect } from '@sveltejs/kit';
import { access_token } from '$lib/server/accessToken'
import { get } from 'svelte/store';


export const actions = {
    default: async ({ request, locals: { supabase } }: any) => {
        const formData = await request.formData();
        const firstname = formData.get('firstname')?.toString();
        const lastname = formData.get('lastname')?.toString();
        const email = formData.get('email')?.toString();
        const password = formData.get('password')?.toString();
        const password_confirm = formData.get('password-confirm')?.toString();
        if (!(firstname && lastname && email && password)) {
            console.log('champs non valide')
            return fail(400, {
                error: 'champs non valide',
            });
        }
        if (password !== password_confirm) {
            console.log('Le mot de pas n\'est pas identique dans les deux champs')
            return fail(400, {
                error: 'Le mot de pas n\'est pas identique dans les deux champs',
            });
        }

        const { error: insetError } = await supabase
            .from('dancers')
            .insert({
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: password
            })
        if (insetError) {
            console.log(insetError)
            return fail(400, {
                error: 'Une erreur est survenue',
            });
        }


        //TODO: Implémenter la modal de succés
        throw redirect(302, '/');
    },
};


export async function load({ params, fetch }) {
    const event = await fetch("https://api.helloasso.com/v5/organizations/norma-ecv/forms/event/" + params.eventSlug + "/public", {
        method: "GET",
        headers: {
            authorization: 'Bearer ' + get(access_token)
        }
    }).then(resp => resp.json())
    return event
}