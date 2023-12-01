export async function load({ fetch, cookies }) {
    const events = await fetch("https://api.helloasso.com/v5/organizations/normatest/forms?pageIndex=1&pageSize=20", {
        method: "GET",
        headers: {

        }
    }).then(resp => resp.json())
    return events
}