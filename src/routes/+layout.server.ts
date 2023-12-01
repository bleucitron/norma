import { HELLOASSO_CLIENT_ID, HELLOASSO_SECRET_ID } from '$env/static/private'


export async function load({ fetch, cookies }) {
    /*const token = await fetch("https://api.helloasso.com/oauth2/token", {
        method: "POST",
        body: `client_id=${encodeURIComponent(HELLOASSO_CLIENT_ID)}&client_secret=${encodeURIComponent(
            HELLOASSO_SECRET_ID
        )}&grant_type=client_credentials`
    }).then(resp => resp.json())
    console.log(token)
    let access_token = token.access_token
    let refresh_token = token.refresh_token
    const refreshingToken = await fetch("https://api.helloasso.com/oauth2/token", {
        method: "POST",
        body: `client_id=${encodeURIComponent(HELLOASSO_CLIENT_ID)}&grant_type=refresh_token&refresh_token=${encodeURIComponent(refresh_token)}`
    }).then(resp => resp.json())

    console.log(refreshingToken)


    cookies.set("token", JSON.stringify(token))*/
}