<script>
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';




	onMount(() => {
        goto('/home');
    });


</script>


<svelte:head>
	<title>Pastify</title>
	<meta name="Pastify" content="Pastify" />
</svelte:head>
