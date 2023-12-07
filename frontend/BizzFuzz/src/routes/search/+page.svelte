<script>
    import {onDestroy, onMount} from 'svelte';
    import { user } from '$lib/stores/userStore.js';
    import {goto} from '$app/navigation';
    import IconifyIcon from '@iconify/svelte'; // make sure to install and setup @iconify/svelte
    import {Separator} from '$lib/components/ui/separator';
    import {Terminal} from 'lucide-svelte';
    import {fly} from 'svelte/transition';
    import {Button} from '$lib/components/ui/button';
    import {Input} from '$lib/components/ui/input';
    import {Label} from '$lib/components/ui/label';
    import {Popover, PopoverContent, PopoverTrigger} from "$lib/components/ui/popover";
    import * as Card from '$lib/components/ui/card';
    import * as Alert from '$lib/components/ui/alert';
    import * as Tabs from '$lib/components/ui/tabs';
    import * as Table from '$lib/components/ui/table';
    import alert from "$lib/components/ui/alert/alert.svelte";
    import {func} from "joi";
    import { selectedQuiz } from '$lib/stores/quizStore.js';




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

    let username = sessionStorage.getItem('username');
    let alertMessage;
    let validSession = false;
    let currentError = null;
    let quiz

    $: username = $user;
    $: $searchQuery;



    onMount(() => {

        fetchQuizlets();

       user.initialize();
        const handleClickOutside = (event) => {
            if (!document.querySelector('div.w-[350px]').contains(event.target)) {
                console.log('Clicked outside');
            }
        };

        document.addEventListener('click', handleClickOutside);

        onDestroy(() => {
            document.removeEventListener('click', handleClickOutside);
        });

    });




    let quizlets = [];
    let error = null;


    function fetchQuizlets() {
    fetch('http://localhost:3000/quizlets', { // Adjust this URL to your API's endpoint
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            page: 1,          // Assuming you're fetching the first page
            query: $searchQuery, // Use the search query from the store
            sort: "MOST POPULAR"
        }),
        credentials: 'include'
    })
    .then(res => {
        if (res.ok) {
            return res.json();
        } else {
            throw new Error(`Server responded with status ${res.status}`);
        }
    })
    .then(data => {
        quizlets = data;
    })
    .catch(err => {
        error = err.message;
        console.error("Error fetching quizlets:", error);
    });
}


     function selectQuiz(quizId) {
        selectedQuiz.set(quizId);
        goto('/quizTaking'); // Navigate to the route
    }

</script>

<div class="big-card-home">
    <div class="grid-container">
        {#each quizlets as quizlet}
            <div class="quizlet-card" on:click={() => selectQuiz(quizlet.quizId)}>
                <h3>{quizlet.name}</h3>
                <p>Description: {quizlet.description}</p>
                <Separator />
            </div>
        {/each}
    </div>
</div>

<style>

    .big-card-home {
        background-color: white;
        padding: 1rem;
        border-radius: 8px;
        margin: 200px 90px 200px 90px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        display: flex;
    justify-content: center;
    align-items: center;


    }
    .grid-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
    }
    .quizlet-card {
        padding: 1rem;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .quizlet-card:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

</style>




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