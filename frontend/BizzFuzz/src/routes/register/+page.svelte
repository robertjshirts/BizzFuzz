<script>
    import { onDestroy, onMount } from 'svelte';
    import "..//..//styles.css";


    let username = "";
    let email = "";
    let password = "";
    let confirmPassword = "";
    let passwordStrength = 0;
    let currentError = "";
    let alertMessage = null;
    let guest = false;
    let validLogin = false;


    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;

    import * as Tabs from "$lib/components/ui/tabs";
    import { Button } from "$lib/components/ui/button";
    import { Checkbox } from "$lib/components/ui/checkbox";
    import { Progress } from "$lib/components/ui/progress";
    import * as Card from "$lib/components/ui/card";
    import * as Select from "$lib/components/ui/select";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import * as Alert from "$lib/components/ui/alert";
    import { Terminal } from "lucide-svelte";
    import { fly } from 'svelte/transition';


    import { goto } from '$app/navigation';

    onMount(() => {
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

    const cancel = () => {
        goto('/');
    };

    $: {
        if (password) {
            passwordStrength = calculatePasswordStrength(password);
        } else {
            passwordStrength = 0;
        }
    }

    function calculatePasswordStrength(password) {
        let strength = 0;
        const requirements = [
            /[a-z]/, // lowercase
            /[A-Z]/, // uppercase
            /[0-9]/, // digit
            /[!@#$%^&*]/ // special character
        ];

        requirements.forEach((regex) => {
            if (regex.test(password)) {
                strength += 25;
            }
        });

        return strength;
    }


    function validateRegister() {

        if (username.trim() === "") {
            alertMessage = "Username cannot be an empty";
            return false;
        } else if (!emailRegex.test(email)) {
            alertMessage = "Invalid email";
            return false;
        } else if (!passwordRegex.test(password)) {
            alertMessage = "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.";
            return false;
        } else if (password !== confirmPassword) {
            alertMessage = "Passwords do not match";
            return false;
        }
        alertMessage = null
        return true;
    }


    function register() {
        if (validateRegister()) {
            //alert("Registration successful!");
            registerAPI()
        }
    }

    const registerAPI = () => {
        fetch(`http://localhost:3000/users/${username}`, { // Include the username in the path
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                password: password,
            })
        })
            .then((res) => {
                if (res.status === 201) {
                    alertMessage = "Registration successful!";
                    console.log('Set-Cookie Header:', res.headers.get('set-cookie'));
                    if (typeof window !== 'undefined') {
                            localStorage.setItem('username', username);
                        }

                } else if (res.status === 400) {
                    alertMessage = "Bad request - Missing parts or all of requestBody, please contact support";
                } else if (res.status === 409) {
                    alertMessage = "Username already taken";
                } else {
                    alertMessage = "Unexpected error, please contact support";
                }
            })
            .then((data) => {
                console.log(data);
                alertMessage = "Registration successful!";
            })
            .catch((error) => {
                currentError = error.message; // Store the error message
                console.log("Error registering", error);
            });
    }


    function validateLogin() {
        if (guest){
            continueAsGuest();
        }
        else {
            fetch(`http://localhost:3000/sessions/${username}`, { // Endpoint changed as per OpenAPI spec
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: password, // Keep the password structure as is
                }),
                credentials: 'include' // Include credentials to ensure cookies are sent and received
            })
                .then((res) => {
                    if (res.status === 201) {
                        // Log the Set-Cookie header (if any) for debugging
                        console.log('Set-Cookie Header:', res.headers.get('set-cookie'));
                        alertMessage = "Session created successfully, Redirecting!";
                        if (typeof window !== 'undefined') {
                            localStorage.setItem('username', username);
                            goto('/home')
                        }
                    } else if (res.status === 400) {
                        alertMessage = "Error, Try again or contact support";
                    } else if (res.status === 403) {
                        alertMessage = "Invalid username or password, please try again or contact support";
                    } else {
                        alertMessage = "Unexpected error, please contact support";
                    }
                })
                .then((data) => {
                    console.log(data);
                    alertMessage = "Session created successfully!";
                    // Additional code for handling successful login, such as redirect or UI update
                })
                .catch((error) => {
                    currentError = error.message; // Store the error message
                    console.log("Error creating session", error);
                });
        }
    }


    function continueAsGuest() {
        alert("Continuing as guest");
        username = "guest";
        password = "Guest0!";
        return true;
    }




</script>

<div class="flex justify-center items-center min-h-screen">
    <Tabs.Root value="login" class="w-[400px]">

        <Tabs.List class="grid w-full grid-cols-2">
            <Tabs.Trigger value="login">Login</Tabs.Trigger>
            <Tabs.Trigger value="register">Register</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="login">
            <Card.Root>
                <Card.Header>
                    <Card.Title>Login to Bizz Fuzz</Card.Title>
                </Card.Header>
                <Card.Content>
                    <form>
                        <form>
                            <div class="grid w-full items-center gap-4">
                                <div class="flex flex-col space-y-1.5">
                                    <Label for="username">Username</Label>
                                    <Input bind:value={username} id="username" placeholder="Username" />
                                </div>
                                <div class="flex flex-col space-y-1.5">
                                    <Label for="password">Password</Label>
                                    <Input bind:value={password} id="password" placeholder="Password" type="password"/>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <Checkbox id="guest" bind:checked={guest} />
                                    <Label
                                            id="guest-label"
                                            for="guest"
                                            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Continue as Guest
                                    </Label>
                                </div>
                            </div>
                        </form>
                    </form>
                </Card.Content>
                <Card.Footer class="flex justify-between">
                    <Button variant="outline" on:click={cancel}>Cancel</Button>
                    <Button on:click={validateLogin} >Login</Button>
                </Card.Footer>
            </Card.Root>
        </Tabs.Content>

        <Tabs.Content value="register">
            <Card.Root>
                <Card.Header>
                    <Card.Title>Register for Bizz Fuzz!</Card.Title>
                </Card.Header>
                <Card.Content>
                    <form>
                        <div class="grid w-full items-center gap-4">
                            <div class="flex flex-col space-y-1.5">
                                <Label for="username">Username</Label>
                                <Input bind:value={username} id="username" placeholder="Username" />
                            </div>
                            <div class="flex flex-col space-y-1.5">
                                <Label for="email">Email</Label>
                                <Input bind:value={email} id="email" placeholder="Email Address" />
                            </div>
                            <div class="flex flex-col space-y-1.5">
                                <Label for="password">Password</Label>
                                <Input bind:value={password} id="password" placeholder="Password" type="password" />
                            </div>
                            <Progress value={passwordStrength} max={100}/>
                            <div class="flex flex-col space-y-1.5">
                                <Label for="password2">Confirm Password</Label>
                                <Input bind:value={confirmPassword} id="password2" placeholder="Confirm Password" type="password" />
                            </div>
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
                    <Button variant="outline" on:click={cancel}>Cancel</Button>
                    <Button on:click={register}>Register</Button>
                </Card.Footer>
            </Card.Root>
        </Tabs.Content>
    </Tabs.Root>
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