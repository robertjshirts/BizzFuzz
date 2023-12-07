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
    import { selectedQuiz } from '$lib/stores/quizStore.js';

    //$: quizId = $selectedQuiz; // Access the selected quizId from the store



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
        quizId = 'qe65e6a1d-4b9a-4577-93df-6b33301b77ac'; // Replace with dynamic quizId as needed
        callQuizData();
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


    function gotohome() {
        goto('/home');
    }

    let quizName = "";
    let quizDescription = "";
    //let creatorUserId = "u956fbe0e-21f0-48d0-aaa8-43d213446b43"; // Example userId, replace as needed
    let questions = [{ prompt: "", answers: [{ content: "", resultLink: "" }] }];
    let results = [{ name: "", description: "" }];
    let quizId = 'q185e3d03-c490-41a4-9e49-3b1381293a41'; // Replace with dynamic quizId as needed
    let quizData = null;
    let currentQuestionIndex = 0;
    let selectedAnswers = [];


    function callQuizData(){
        fetch(`http://localhost:3000/quizzes/${quizId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch quiz');
                }
            })
            .then(data => {
                quizData = data;
            })
            .catch(error => {
                currentError = error.message;
                alertMessage = "Error fetching quiz: " + error.message;
            });
    }


    function addResult() {
        results.push({ name: "", description: "" });
    }

    async function createQuiz() {

        const response = await fetch('/api/quizzes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                name: quizName,
                description: quizDescription,
                creator: creatorUserId,
                questions,
                results
            })
        });

        if (response.ok) {
            alertMessage = "Quiz successfully created";
            // Handle successful creation
        } else {
            alertMessage = "Error creating quiz";
            // Handle errors
        }
    }


    function selectAnswer(answerIndex) {
        const selectedAnswer = quizData.questions[currentQuestionIndex].answers[answerIndex];
        selectedAnswers[currentQuestionIndex] = {
            answer: selectedAnswer,
            weight: selectedAnswer.weight
        };

    }


    function nextQuestion() {
        if (currentQuestionIndex < quizData.questions.length - 1) {
            currentQuestionIndex += 1;
        } else {
            // TODO: Handle quiz completion
        }
    }

    function previousQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex -= 1;
        }
    }

    function submitQuiz() {
        const resultData = {
            quizId: quizId,
            answers: selectedAnswers.map(answer => answer.answer)
        };

        // Make an API call to submit the results
        try {
            const response = fetch('http://localhost:3000/results', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(resultData)
            });

            if (!response.ok) {
                throw new Error('Failed to submit quiz results');
            }

            // Display the final result
            alertMessage = `Your result: ${finalResult}`;
        } catch (error) {
            alertMessage = `Error submitting quiz: ${error.message}`;
        }
    }




</script>

<div class="flex justify-center items-center min-h-screen">
    <Card.Root class="wide-card">
        <Card.Header>
            <Card.Title>{quizData ? quizData.name : 'Loading...'}</Card.Title>
        </Card.Header>
        <Card.Content>
            {#if quizData}
                <div class="grid w-full items-center gap-4">
                    <Label>{quizData.questions[currentQuestionIndex].prompt}</Label>
                    {#each quizData.questions[currentQuestionIndex].answers as answer}
                        <Button on:click={() => selectAnswer(answer.result)}>
                            {answer.option}
                        </Button>
                    {/each}
                </div>
            {/if}
        </Card.Content>

        <Card.Footer class="flex justify-between">
            <Button on:click={previousQuestion}>Previous</Button>
            <Button on:click={nextQuestion}>Next</Button>
            <Button on:click={submitQuiz}>Submit</Button>
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