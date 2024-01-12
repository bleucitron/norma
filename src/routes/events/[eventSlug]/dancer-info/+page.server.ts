import { fail, redirect } from '@sveltejs/kit';


export const actions = {
    default: async ({ params, request, locals: { supabase } }: any) => {
        const formData = await request.formData();
        const level = formData.get('level')?.toString();
        const role = formData.get('role')?.toString();
        if (!(level && role)) {
            console.log('champs non valide')
            return fail(400, {
                error: 'champs non valide',
            });
        }

        /*const { error: insetError } = await supabase
            .from('event_dancers')
            .insert({
                dancer_id: '',
                role: role,
                level: level,
                event: params.eventSlug
            })
        if (insetError) {
            console.log(insetError)
            return fail(400, {
                error: 'Une erreur est survenue',
            });
        }*/


        //TODO: Implémenter la modal de succés
        //throw redirect(302, '/events/' + params.eventSlug + '/dancer-info');
    },
}