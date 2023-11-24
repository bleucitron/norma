
import { createHash } from 'node:crypto'

//let token = 'zggz8e7zf4-rfefrfi_eze865EGR4t8trd5r-gfgrdwffv57796regrg659656e5f9e6f5e9fe56c5df6z5e9f659e8f9e5fd6z9f';
export async function load({ fetch, cookies }) {
    /*let s256Token = createHash('sha256').update(token).digest('hex')
    return {
        token: Buffer.from(s256Token, 'utf8').toString('base64')
    }*/
    const client_id = '3ee3baa68ec640ee87665c4ee3d4c0ab';
    const client_secret = 'yFOx6BqYJomxyWZnSH9F+Urjp7Ujj36R';
    const token = await fetch("https://api.helloasso.com/oauth2/token", {
        method: "POST",
        body: `client_id=${encodeURIComponent(client_id)}&client_secret=${encodeURIComponent(
            client_secret
        )}&grant_type=client_credentials`

    }).then(resp => resp.json())
    cookies.set('token', token)

    return {
        token: token
    }

}