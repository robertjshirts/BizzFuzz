<script>
    import * as Card from "$lib/components/ui/card";
    import welcome from '$lib/images/Spinning.gif';
    import { goto } from '$app/navigation';
    import { onDestroy, onMount } from 'svelte';


    const frameworks = [
        {
            value: "sveltekit",
            label: "SvelteKit"
        },
        {
            value: "next",
            label: "Next.js"
        },
        {
            value: "astro",
            label: "Astro"
        },
        {
            value: "nuxt",
            label: "Nuxt.js"
        }
    ];

    async function logout() {
        sessionStorage.removeItem('userID');
        2000;
        goto('/home');
    }

    onMount(() => {
        setTimeout(() => {
            logout();
        }, 2000);
    });

</script>

<div class="flex justify-center items-center min-h-screen">
    <Card.Root class="w-[350px]">
        <Card.Header>
            <Card.Title>Successfully Logged Out</Card.Title>
            <Card.Description>Thanks for visiting! You will be redirected momentarily!</Card.Description>
        </Card.Header>

        <Card.Content>
            <img src={welcome} alt="Loading" />
        </Card.Content>
    </Card.Root>
</div>