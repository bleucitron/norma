<script>
    import emailjs from '@emailjs/browser';
    import { PUBLIC_SERVICE_ID, PUBLIC_TEMPLATE_ID, PUBLIC_EMAILJS_KEY } from '$env/static/public';
	import { toast } from '@zerodevx/svelte-toast'
    
    function sendEmail(e) {
      emailjs.sendForm(PUBLIC_SERVICE_ID, PUBLIC_TEMPLATE_ID, e.target, PUBLIC_EMAILJS_KEY)
        .then((result) => {
            console.log('SUCCESS!', result.text);
            toast.push('Message envoyé avec succès!')

        }, (error) => {
            console.log('FAILED...', error.text);
            toast.push('Erreur lors de l\'envoi du message!')
        });
    }
  </script>
  
  <form id="contact__form" on:submit|preventDefault={sendEmail}>
    <label 
        for="username"
        aria-label="Votre nom"
    ></label>
    <input 
        name="username"
        type="text" 
        required
        minlength="3"
        title="Merci d'entrer un nom valide"
        placeholder="Votre nom"
    >
    <label 
    for="email"
    aria-label="Votre email"
    ></label>
    <input 
        name="email"
        placeholder="Votre email"
        type="email" 
        required
        title="Merci d'entrer un email valide"
    >
    <label 
        for="message"
        aria-label="Votre message"
    ></label>
    <textarea 
        name="message"
        placeholder="Votre message"
        required
        minlength="10"
        title="Merci d'entrer un message valide"
    ></textarea>
    <input type="submit" value="Send">
  </form>