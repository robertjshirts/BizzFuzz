<script>
    import { page } from '$app/stores';
    import logo from '$lib/images/svelte-logo.svg';
    import github from '$lib/images/github.svg';
    import * as Sheet from "$lib/components/ui/sheet";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Separator } from "$lib/components/ui/separator";
    import { writable } from 'svelte/store';
    import { onMount } from 'svelte';
    import { user } from '$lib/stores/userStore.js';
    import { slide } from "svelte/transition";
    import { popup } from '@skeletonlabs/skeleton';
    import { Progress } from "$lib/components/ui/progress";
    import * as Card from "$lib/components/ui/card";
    import {goto} from "$app/navigation";
    // import type { PopupSettings } from '@skeletonlabs/skeleton';
    import { Terminal } from "lucide-svelte";
    import { fly } from 'svelte/transition';
    import * as Alert from "$lib/components/ui/alert";
    import Icon from '@iconify/svelte';
    import IconifyIcon from "@iconify/svelte";
    import { searchQuery } from '$lib/stores/searchStore.js'; // adjust the path as necessary





    onMount(() => {
        user.initialize();
    });

    $: username = $user;
    let password = "";
    let confirmPassword = "";
    let passwordStrength = 0;
    let alertMessage = null;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;

    function calculatePasswordStrength(confirmPassword) {
        let strength = 0;
        const requirements = [
            /[a-z]/, // lowercase
            /[A-Z]/, // uppercase
            /[0-9]/, // digit
            /[!@#$%^&*]/ // special character
        ];

        requirements.forEach((regex) => {
            if (regex.test(confirmPassword)) {
                strength += 25;
            }
        });

        return strength;
    }

    $: {
        if (password) {
            passwordStrength = calculatePasswordStrength(confirmPassword);
        } else {
            passwordStrength = 0;
        }
    }

    function changePass(){
        if (!passwordRegex.test(confirmPassword)) {
            alertMessage = "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.";
            return false;
        }
    }
    function search() {
        goto('/search', { params: { query: $searchQuery } });
    }



</script>

<!-- Wrapper for Navbar and Bottom Border -->
<div class="navbar-container">
    <header>
        <!-- Navigation with Home and Logout buttons -->
        <nav>
            <a href='/home' class="nav-link">Home</a>
            <Separator class="w-9/16" />
            <a href='/logout' class="nav-link">Logout</a>
        </nav>


        <!-- Center Section: Search Bar -->
        <div class="search-bar-nav">
    <Input placeholder="Search..." bind:value={$searchQuery}/>
    <Button variant="outline" on:click={search}>
        <IconifyIcon icon="mingcute:search-fill" />
        Search
    </Button>
</div>

        <!-- Right Section: User Info Sheet Trigger -->
        <div class="right-section" >
            <Sheet.Root>
                <Sheet.Trigger asChild let:builder>
                    <Button builders={[builder]} variant="outline" class="sheet-trigger">User Info</Button>
                </Sheet.Trigger>

                <Sheet.Content side="right" z-index="300" class="sheet-class-name" >
                    <Sheet.Header>
                        <Sheet.Title>User Profile</Sheet.Title>
                        <Sheet.Description>
                            Manage your account settings here.
                        </Sheet.Description>
                    </Sheet.Header>
                    <div class="user-info">
                        <h2 class="username">{username}</h2>
                        <Card.Root>
                            <Card.Header>
                                <Card.Title>Change Your Password</Card.Title>
                            </Card.Header>
                            <Card.Content>
                                <form>
                                    <div class="grid w-full items-center gap-4">
                                        <div class="flex flex-col space-y-1.5">
                                            <Label for="password">Current Password</Label>
                                            <Input bind:value={password} id="password" placeholder="Password" type="password" />
                                        </div>
                                        <div class="flex flex-col space-y-1.5">
                                            <Label for="password2">New Password</Label>
                                            <Input bind:value={confirmPassword} id="password2" placeholder="Confirm Password" type="password" />
                                        </div>
                                        <Progress value={passwordStrength} max={100}/>
                                        <div class="password-requirements">
                                            Password Requirements:
                                            <ul>
                                                <li>At least one uppercase letter</li>
                                                <li>At least one lowercase letter</li>
                                                <li>At least one number</li>
                                                <li>At least one special character (e.g., !@#$%^&*)</li>
                                            </ul>
                                        </div>
                                    </div>
                                </form>
                            </Card.Content>
                            <Card.Footer class="flex justify-between">
                                <Button on:click={changePass}>Confirm</Button>
                            </Card.Footer>
                        </Card.Root>
                        <Separator class="my-4" />
                        <Button href='../../accountDelete' variant="outline">Delete Account</Button>
                    </div>
                </Sheet.Content>
            </Sheet.Root>
        </div>
    </header>

    <!-- Separator for the Bottom Border -->
    <Separator />
</div>

{#if alertMessage}
    <div class="passwordPopup bg-blend-color" role="button" tabindex="0"
         on:click={() => alertMessage = null}
         on:keydown={(e) => e.key === 'Enter' && (alertMessage = null)}
         in:fly="{{ y: 0, duration: 500 }}" out:fly="{{ y: 0, duration: 500, delay: 500 }}">
        <Alert.Root>
            <Terminal class="h-4 w-4" />
            <Alert.Title>Heads up!</Alert.Title>
            <Alert.Description>{alertMessage}</Alert.Description>
        </Alert.Root>
    </div>
{/if}

<style>

    /* Add styles for the Sheet to overlay content */
    :global(.sheet-class-name) {
        z-index: 300; /* Higher z-index than the navbar */
    }

</style>