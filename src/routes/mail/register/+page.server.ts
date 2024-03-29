import emailjs from 'emailjs-com';

export const POST: import('@sveltejs/kit').RequestHandler = async ({ request }) => {
	const formData = await request.formData();
	const userEmail = formData.get('email');

	const templateParams = {
		from_name: 'Votre nom',
		email: userEmail,
		message: "Inscription à la liste d'attente",
		reply: 'your-email@example.com'
	};

	try {
		const response = await emailjs.send('service_wkav6z9', 'template_8lxwydg', templateParams);
		if (response.text === 'OK') {
			return new Response('Email envoyé avec succès!', { status: 200 });
		} else {
			return new Response("Erreur lors de l'envoi de l'email.", { status: 500 });
		}
	} catch (error) {
		return new Response("Erreur lors de l'envoi de l'email.", { status: 500 });
	}
};
