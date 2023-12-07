<script>
    import * as Card from "$lib/components/ui/card";
    import welcome from '$lib/images/Spinning.gif';
    import { goto } from '$app/navigation';
    import { onDestroy, onMount } from 'svelte';
    import {Terminal} from "lucide-svelte";
    import * as Alert from "$lib/components/ui/alert";
    import { fly } from 'svelte/transition';


    let alertMessage;
    let currentError;


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

    function logout() {
    let username = sessionStorage.getItem('username'); // Retrieve the username from session storage

    if (username) {
        fetch(`http://localhost:3000/sessions/${username}`, {
            method: "DELETE", // Change the method to DELETE
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include' // Include credentials to ensure cookies are sent and received
        })
        .then((res) => {
            if (res.status === 204) {
                alertMessage = "You have been logged out successfully.";
                sessionStorage.removeItem('username'); // Remove the username from session storage
                2000
                goto('/register');
            } else {
                alertMessage = "An error occurred while trying to log out.";
            }
        })
        .catch((error) => {
            currentError = error.message; // Store the error message
            console.log("Error logging out", error);
        });
    } else {
        console.log("No active session to log out from.");
    }
    goto('/register');
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


{#if alertMessage}
    <div class="passwordPopup" role="button" tabindex="0"
         on:click={() => alertMessage = null}
         on:keydown={(e) => e.key === 'Enter' && (alertMessage = null)}
         in:fly="{{ y: 0, duration: 500 }}" out:fly="{{ y: 0, duration: 500, delay: 500 }}" >
        <Alert.Root>
            <Terminal class="h-4 w-4" />
            <Alert.Title>Heads up!</Alert.Title>
            <Alert.Description>{alertMessage}</Alert.Description>
        </Alert.Root>
    </div>
{/if}