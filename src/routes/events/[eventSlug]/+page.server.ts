import { access_token } from '$lib/server/accessToken'
import { get } from 'svelte/store';
export async function load({ params, cookies, fetch }) {
    const event = await fetch("https://api.helloasso.com/v5/organizations/norma-ecv/forms/event/" + params.eventSlug + "/public", {
        method: "GET",
        headers: {
            authorization: 'Bearer ' + get(access_token)
        }
    }).then(resp => resp.json())
    let dancer = cookies.get('dancer') ? JSON.parse(atob(cookies.get('dancer'))) : false
    return {
        dancer: dancer,
        event: event
    }
}