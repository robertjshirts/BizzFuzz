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

    //let username = sessionStorage.getItem('username');
    let alertMessage;
    let validSession = false;
    let currentError = null;
    let password = '';
    let confirmPassword = '';
    let guest = false;

    $: username = $user;


    onMount(() => {
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

        /*if (!validSession) {
            checkForSession();
        } else if (validSession) {
            alertMessage = "You are logged in";
        } else {
            alertMessage = "Not supposed to get here, contact support"
        }*/


    });

    function deleteAccount() {
        fetch(`http://localhost:3000/users/${username}`, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password })
        })
        .then((res) => {
            if (res.status === 204) {
                goto('/register'); // Redirect on successful deletion
            } else if (res.status === 400) {
                alertMessage = "Bad request - Missing requestBody";
            } else if (res.status === 403) {
                alertMessage = "Forbidden - Wrong credentials";
            } else {
                alertMessage = "There was an internal error";
            }
        })
        .catch((error) => {
            alertMessage = "Error: " + error.message;
        });
    }

    function gotohome() {
        goto('/home');
    }


</script>


<Card.Root class="card-container-delete">
    <Card.Header>
        <Card.Title>Delete Your Account</Card.Title>
    </Card.Header>
    <Card.Content>
        <form>
            <form>
                <div class="grid w-full items-center gap-4">
                    <div class="flex flex-col space-y-1.5">
                        <Label for="password">Password</Label>
                        <Input bind:value={password} id="username" placeholder="Password" type="password" />
                    </div>
                    <div class="flex flex-col space-y-1.5">
                        <Label for="password">Confirm Password</Label>
                        <Input bind:value={confirmPassword} id="password" placeholder="Password" type="password"/>
                    </div>
                    <div class="DELETE WARNING">
                        WARNING:
                        <ul>
                            <li>If you proceed there is no way to recover an account</li>
                            <li>Account Deletion is permanent</li>
                            <li>After deletion you will be redirected to the login page</li>
                        </ul>
                    </div>
                </div>
            </form>
        </form>
    </Card.Content>
    <Card.Footer class="flex justify-between">
        <Button variant="outline" on:click={gotohome} >Cancel</Button>
        <Button on:click={deleteAccount} >DELETE</Button>
    </Card.Footer>
</Card.Root>



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

