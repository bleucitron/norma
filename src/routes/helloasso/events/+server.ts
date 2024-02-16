import { json } from '@sveltejs/kit'


interface HelloAssoNotificationBody {
    eventType: string;
    data: object;
}

export async function GET(event) {


    return new Response('Hello')
}


export async function POST(event) {
    const body: HelloAssoNotificationBody = await event.request.json()
    if (body.eventType) {
        switch (body.eventType) {
            case 'Order':
                console.log('Order')
                console.log(body.data)
                break;
            case 'Payment':
                console.log('Payment')
                break;
            case 'Form':
                console.log('Form')
                break;
            case 'Organization':
                console.log('Organization')
                break;
            default:
                break;
        }
    }
    return json({ success: true })
}