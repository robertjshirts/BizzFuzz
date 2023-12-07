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
    import welcome from "$lib/images/Spinning.gif";
    import * as Select from "$lib/components/ui/select";


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

    onMount(async () => {
        await fetchUserId();
        // Other initialization code...
    });


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

    let userId = "u8b8cba76-ccac-4746-b39f-f92ee1d7167a";
    let resultName = '';
    let resultDescription = '';


    async function fetchUserId() {
        try {
            const response = await fetch(`http://localhost:3000/users/${username}`, {
                method: 'GET',
                credentials: 'include' // Include credentials for cookies
            });

            if (response.ok) {
                const data = await response.json();
                userId = data._id;

            } else {
                console.log(response);
                throw new Error('Failed to fetch user data');
            }
        } catch (error) {
            alertMessage = error.message;
        }

    }



    function gotohome() {
        goto('/home');
    }

    let quizName = "";
    let quizDescription = "";
    let creatorUserId = "u956fbe0e-21f0-48d0-aaa8-43d213446b43"; // Example userId, replace as needed
    let results = [];
    const weights = [
        { value: 1, label: "1" },
        { value: 2, label: "2" },
        { value: 3, label: "3" },
        { value: 4, label: "4" },
    ];


    function addQuestion() {
        questions = [...questions, { prompt: "", answers: [{ content: "", resultLink: "" }] }];
    }

    let questions = [{ prompt: "", answers: [{ option: "", result: "", weight: "1" }] }];

function handleAnswerChange(questionIndex, answerIndex, field, value) {
    let newQuestions = [...questions];
    newQuestions[questionIndex].answers[answerIndex][field] = value;
    questions = newQuestions;
}

function addAnswer(questionIndex) {
    let newQuestions = [...questions];
    newQuestions[questionIndex].answers.push({ option: "", result: "", weight: "1" });
    questions = newQuestions;
}

// Make sure handleResultLinkChange and handleWeightChange update the `result` and `weight` fields correctly


    function handleResultLinkChange(questionIndex, answerIndex, resultIndex) {
    let newQuestions = [...questions];
    newQuestions[questionIndex].answers[answerIndex].result = resultIndex.toString(); // 0-based index
    questions = newQuestions;
    console.log('Updated questions after result link change:', questions);
}



    function handleWeightChange(questionIndex, answerIndex, weightValue) {
        console.log('Weight changed:', questionIndex, answerIndex, weightValue);
        let newQuestions = [...questions];
        newQuestions[questionIndex].answers[answerIndex].weight = weightValue;
        questions = newQuestions;
        console.log('Updated questions after weight change:', questions);

    }




    function addResult() {
    results.push({ name: resultName, description: resultDescription });
    // Clear the input fields
    resultName = "";
    resultDescription = "";
    alertMessage = "Result added";
}





    async function createQuiz() {
        // Basic client-side validation
        if (!quizName.trim() || !quizDescription.trim()) {
            alertMessage = "Quiz name and description are required.";
            return;
        }

        // Prepare request data
        const quizPayload = {
            name: quizName,
            description: quizDescription,
            creator: userId,
            questions,
            results
        };



        // Debug: Log payload to console for review
        console.log("Sending payload:", quizPayload);

        try {
            const response = await fetch('http://localhost:3000/quizzes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(quizPayload)
            });

            if (!response.ok) {
                throw new Error('Failed to create quiz. Status: ' + response.status);
            }

            alertMessage = "Quiz successfully created";
        } catch (error) {
            console.error("Error creating quiz:", error);
            alertMessage = error.message;
        }
    }



</script>

<div class="flex justify-center items-center min-h-screen">
    <Card.Root class="wide-card">
        <Card.Header>
            <Card.Title>Create a New Quiz</Card.Title>
        </Card.Header>
        <Card.Content>
            <form>
                <div class="grid w-full items-center gap-4">
                    <!-- Quiz Name Input -->
                    <div class="flex flex-col space-y-1.5">
                        <Label for="quizName">Quiz Name</Label>
                        <Input bind:value={quizName} id="quizName" placeholder="Enter quiz name" />
                    </div>

                    <!-- Quiz Description Input -->
                    <div class="flex flex-col space-y-1.5">
                        <Label for="quizDescription">Quiz Description</Label>
                        <Input bind:value={quizDescription} id="quizDescription" placeholder="Enter quiz description" />
                    </div>

                    <!-- Questions Inputs -->
                    {#each questions as question, qIndex}
                        <div class="flex flex-col space-y-1.5">
                            <Label for={`question-${qIndex}`}>Question {qIndex + 1}</Label>
                            <Input bind:value={question.prompt} id={`question-${qIndex}`} placeholder={`Question ${qIndex + 1}`} />
                            {#each question.answers as answer, aIndex}
                                <div class="flex gap-2 items-center">
                                    <Input bind:value={answer.option} placeholder={`Answer ${aIndex + 1}`} />

                                    <Select.Root portal={null} on:change={(e) => handleResultLinkChange(qIndex, aIndex, e.detail.index)}>
                                        <Select.Trigger class="w-[180px]">
                                            <Select.Value placeholder="Link to result" />
                                        </Select.Trigger>
                                        <Select.Content>
                                            <Select.Group>
                                                <Select.Label>Results</Select.Label>
                                                {#each results as result, rIndex}
                                                   <Select.Item value={result.name} index={rIndex}>{result.name}</Select.Item>
                                                {/each}
                                            </Select.Group>
                                        </Select.Content>
                                    </Select.Root>

                                    <Select.Root portal={null} on:change={(e) => handleWeightChange(qIndex, aIndex, e.detail.value)}>
                                        <Select.Trigger class="w-[100px]">
                                            <Select.Value placeholder="Weight" />
                                        </Select.Trigger>
                                        <Select.Content>
                                            <Select.Group>
                                                <Select.Label>Weights</Select.Label>
                                                {#each weights as weight}
                                                    <Select.Item value={weight.value}>{weight.label}</Select.Item>
                                                {/each}
                                            </Select.Group>
                                        </Select.Content>
                                    </Select.Root>
                                </div>
                            {/each}
                            <Button type='button' on:click={() => addAnswer(qIndex)}>Add Answer</Button>
                        </div>
                    {/each}
                    <Button type='button' on:click={addQuestion}>Add Question</Button>

                    <!-- Results Inputs -->
                    <div class="flex flex-col space-y-1.5">
                        <Label for="resultName">Result Name</Label>
                        <Input bind:value={resultName} id="resultName" placeholder="Enter result name" />
                        <Input bind:value={resultDescription} placeholder="Enter result description" />
                    </div>
                    <Button type='button' on:click={addResult}>Add Result</Button>
                </div>
            </form>
        </Card.Content>
        <Card.Footer class="flex justify-between">
            <Button variant="outline" on:click={() => goto('/')}>Cancel</Button>
            <Button on:click={createQuiz}>Create Quiz</Button>
        </Card.Footer>
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
