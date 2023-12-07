<script>
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';




	onMount(() => {
        goto('/register');
    });


</script>


<svelte:head>
	<title>Bizz Fuzz</title>
	<meta name="BizzFuzz" content="BizzFuzz" />
</svelte:head>
