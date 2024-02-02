import { error, fail, redirect } from '@sveltejs/kit';
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
        if (countError) {
            return fail(400, {
                error: "Erreur lors de la recherche du nombre d'inscrits"
            });
        }

        if (!Number(registrationCount)) {
            registrationCount = 0
        }
        if (registrationCount >= 50) {

            return registerWaiting(params, formData, supabase)
        }
        let check_role = await checkRole(params.slug, role, level, supabase)

        if (check_role) {
            if (partnaire_email) {
                const { data: partenaire, error: partenaireError } = await supabase
                    .from('dancers')
                    .select('*(count)')
                    .eq('event', params.slug)
                    .eq('email', partnaire_email)
                if (partenaireError) {
                    return fail(400, {
                        error: "Erreur lors de la recherche du partenaire renseigné"
                    });
                }
                if (partenaire) {
                    if (partenaire.state === 'Attente') {
                        //envoi auto mail pour payer
                        setDancerOrderWaiting(params, partnaire_email, supabase)
                    }
                } else {
                    sendInvitationMail(partnaire_email)
                }

            }
            return registerOk(params, formData, supabase);

        } else {
            if (partnaire_email) {
                const { data: partenaire, error: partenaireError } = await supabase
                    .from('dancers')
                    .select('*(count)')
                    .eq('event', params.slug)
                    .eq('email', partnaire_email)

                if (partenaire) {
                    if (partenaire.state === 'Inscrit') {
                        return registerOk(params, formData, supabase);
                    }
                } else {
                    sendInvitationMail(partnaire_email)
                }
            }
            return registerWaiting(params, formData, supabase)
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

    return selectedCount <= oppositeCount + 2;
}

async function registerWaiting(params, formData, supabase) {
    try {
        await register(params, formData, supabase, 'Attente')
    } catch (e) {
        return fail(400, {
            error: e
        })
    }
    throw redirect(302, '/events/' + params.slug + '/reservation');

}
async function registerOk(params, formData, supabase) {
    try {
        await register(params, formData, supabase, 'Reglement en cours')
    } catch (e) {
        return fail(400, {
            error: e
        })
    }
    throw redirect(302, '/events/' + params.slug + '/commande');
}

async function register(params, formData, supabase, state) {
    const email = formData.get('email')?.toString();
    const firstname = formData.get('firstname')?.toString();
    const lastname = formData.get('lastname')?.toString();
    const level = formData.get('level')?.toString();
    const role = formData.get('role')?.toString();
    const partnaire_email = formData.get('partnaire_email')?.toString();

    const { data: alreadyExist, error: alreadyExistError } = await supabase
        .from('dancers')
        .select()
        .eq('email', email)
        .eq('event', params.slug)

    if (alreadyExist[0]) {
        const alreadyExistUser = alreadyExist[0]
        switch (alreadyExistUser.state) {
            case 'Reglement en cours':
                throw redirect(302, '/events/' + params.slug + '/commande');
            case 'Inscrit':
                throw redirect(302, '/events/' + params.slug + '/confirmation');
            case 'Attente':
                throw redirect(302, '/events/' + params.slug + '/reservation');
            default:
                return fail(400, {
                    error: 'Erreur'
                })
        }
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
        return fail(400, {
            error: 'Une erreur est survenue :' + insertError,
        });
    }
    return true;
}
function sendInvitationMail(email) {

}

async function setDancerOrderWaiting(params, partnaire_email, supabase) {
    const { error } = await supabase
        .from('countries')
        .update({ state: 'Reglement en cours' })
        .eq('email', partnaire_email)
        .eq('event', params.slug);
    if (!error) {
        //send mail auto pour payer
    }
}