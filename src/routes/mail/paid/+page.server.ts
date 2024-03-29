export const POST: import('@sveltejs/kit').RequestHandler = async ({ request }) => {
	const formData = await request.formData();
	const userEmail = formData.get('email');

	if (!userEmail) {
		return new Response('Aucune adresse e-mail fournie.', { status: 400 });
	}

	const body = new URLSearchParams({
		service_id: 'your_service_id',
		template_id: 'your_template_id',
		user_id: 'your_user_id',
		template_params: JSON.stringify({
			from_name: 'Votre nom',
			email: userEmail,
			message: 'Paiement réussi : vous êtes bien inscrit',
			reply_to: 'your-email@example.com'
		})
	});

	try {
		const emailjsResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: body
		});

		if (emailjsResponse.ok) {
			return new Response('Email envoyé avec succès!', { status: 200 });
		} else {
			const errorResponse = await emailjsResponse.text();
			return new Response(`Erreur lors de l'envoi de l'email: ${errorResponse}`, { status: 500 });
		}
	} catch (error) {
		return new Response(`Erreur lors de l'envoi de l'email: ${error}`, { status: 500 });
	}
};
