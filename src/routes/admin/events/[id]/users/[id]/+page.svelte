<script>
	import { users } from '../../../../../../data/usersEvent.json';
	import Button, { Label } from '@smui/button';
	export let data;
</script>

<h1>{data.user.firstname} {data.user.lastname}</h1>
<Button variant="raised">Désincrire</Button>
<Button variant="raised">Envoi du mail de finalisation d'inscription</Button>
