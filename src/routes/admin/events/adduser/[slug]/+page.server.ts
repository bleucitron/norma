// import { fail, redirect } from '@sveltejs/kit';
// import { access_token } from '$lib/server/accessToken';
// import { get } from 'svelte/store';

// export async function load({ params, fetch }) {

// }
// export const actions = {
//     default: async ({ params, request, locals: { supabase } }) => {
//         const formData = await request.formData();
//         const email = formData.get('email')?.toString();
//         const firstname = formData.get('firstname')?.toString();
//         const lastname = formData.get('lastname')?.toString();
//         const level = formData.get('level')?.toString();
//         const role = formData.get('role')?.toString();
//         const partnaire_email = formData.get('partnaire_email')?.toString();
//         if (!(email && firstname && lastname && level && role)) {
//             return fail(400, {
//                 error: 'champs non valide'
//             });
//         }
//         if (email === partnaire_email) {
//             return fail(400, {
//                 error: "L'email de votre partenaire ne peux pas etre identique au votre"
//             });
//         }
//         const event = await fetch(
//             'https://api.helloasso.com/v5/organizations/norma-ecv/forms/event/' + params.slug + '/public',
//             {
//                 method: 'GET',
//                 headers: {
//                     authorization: 'Bearer ' + get(access_token)
//                 }
//             }
//         ).then((resp) => resp.json())
//         const save = await register(params, formData, supabase, 2)
//         return {
//             success: save
//         }
//     },
// };

// async function register(params, formData, supabase, state) {
//     const email = formData.get('email')?.toString();
//     const firstname = formData.get('firstname')?.toString();
//     const lastname = formData.get('lastname')?.toString();
//     const level = formData.get('level')?.toString();
//     const role = formData.get('role')?.toString();
//     const partnaire_email = formData.get('partnaire_email')?.toString();

//     const { data: alreadyExist, error: alreadyExistError } = await supabase
//         .from('dancers')
//         .select()
//         .eq('email', email)
//         .eq('event', params.slug)

//     const { error: insertError } = await supabase
//         .from('dancers')
//         .insert({
//             email: email,
//             firstname: firstname,
//             lastname: lastname,
//             state: state,
//             role: role,
//             level: level,
//             event: params.slug,
//             partner_email: partnaire_email
//         })
//     if (insertError) {
//         return fail(400, {
//             error: 'Une erreur est survenue :' + insertError,
//         });
//     }
//     return true;
// }
