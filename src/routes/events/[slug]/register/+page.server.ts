import { fail, redirect } from '@sveltejs/kit';
import { access_token } from '$lib/server/accessToken';
import { get } from 'svelte/store';

export async function load({ cookies, params, fetch }) {

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
        const event = await fetch(
            'https://api.helloasso.com/v5/organizations/norma-ecv/forms/event/' + params.slug + '/public',
            {
                method: 'GET',
                headers: {
                    authorization: 'Bearer ' + get(access_token)
                }
            }
        ).then((resp) => resp.json());
        let { data: registrationCount, error: countError } = await supabase
            .from('dancers')
            .select('*(count)')
            .eq('event', params.slug)
            .eq('state', 'inscrit')

        if (!Number(registrationCount)) {
            registrationCount = 0
        }
        if (registrationCount >= 50) {

            registerWaiting(params, formData, supabase)
        }
        let check_role = await checkRole(params.slug, role, level, supabase)

        if (check_role) {
            if (partnaire_email) {
                const { data: partenaire, error: partenaireError } = await supabase
                    .from('dancers')
                    .select('*(count)')
                    .eq('event', params.slug)
                    .eq('email', partnaire_email)
                if (partenaire) {
                    if (partenaire.state === 'Attente') {
                        //envoi auto mail pour payer
                    }
                } else {
                    sendInvitationMail(partnaire_email)
                }

            }
            registerOk(params, formData, supabase);

        } else {
            if (partnaire_email) {
                const { data: partenaire, error: partenaireError } = await supabase
                    .from('dancers')
                    .select('*(count)')
                    .eq('event', params.slug)
                    .eq('email', partnaire_email)

                if (partenaire) {
                    if (partenaire.state === 'Inscrit') {
                        registerOk(params, formData, supabase);
                    }
                } else {
                    sendInvitationMail(partnaire_email)
                }
            }
            registerWaiting(params, formData, supabase)
        }
    },
};

async function checkRole(event, role, level, supabase) {
    const { data: selectedCount, error: selectedCountError } = await supabase
        .from('dancers')
        .select('*(count)')
        .eq('event', event)
        .eq('role', role)
        .eq('level', level)

    const { data: oppositeCount, error: oppositeCountError } = await supabase
        .from('dancers')
        .select('*(count)')
        .eq('role', (role === 'leader' ? 'suiveur' : 'leader'))
        .eq('level', level)

    return selectedCount <= oppositeCount + 4;
}

async function registerWaiting(params, formData, supabase) {

    //await register(params, formData, supabase, 'Attente') 

    throw redirect(302, '/events/' + params.slug + '/reservation');
}
async function registerOk(params, formData, supabase) {
    //await register(params, formData, supabase, 'Reglement en cours')
    throw redirect(302, '/events/' + params.slug + '/commande');
}

async function register(params, formData, supabase, state) {
    const email = formData.get('email')?.toString();
    const firstname = formData.get('firstname')?.toString();
    const lastname = formData.get('lastname')?.toString();
    const level = formData.get('level')?.toString();
    const role = formData.get('role')?.toString();
    const partnaire_email = formData.get('partnaire_email')?.toString();

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
        return fail(400, {
            error: 'Une erreur est survenue :' + insertError,
        });
    }
}
function sendInvitationMail(email) {

}
