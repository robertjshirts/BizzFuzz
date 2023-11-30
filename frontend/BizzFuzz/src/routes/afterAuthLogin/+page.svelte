<script>
    import {onDestroy, onMount} from 'svelte';
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


    let trackTitle = "Nothing Playing";
    let author = "Nobody";
    let isPlaying = false;
    let value = 0; // This will be set to the track's current progress
    let volume = 100;
    let intervalID; // New declaration for the interval ID
    let player; // New declaration for the YouTube player
    let youtubeVideoID; // Extracted from the link you provided
    let alertMessage = null;
    let playlists = [];
    let playlistResults = [];
    let createPlaylist = "";
    let activePlaylist = [];
    let searchSongField = '';
    let searchResults = [];
    let currentSongIndex = -1; // -1 indicates no song is currently selected
    let userId;



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

    function nextTrack() {
        clearProgress();
        if (searchResults.length > 0) {
            // Increment the current song index
            currentSongIndex = (currentSongIndex + 1) % searchResults.length;
            selectSong(searchResults[currentSongIndex]);
        }
    }

    function prevTrack() {
        clearProgress();
        if (searchResults.length > 0) {
            // Decrement the current song index
            currentSongIndex = (currentSongIndex - 1 + searchResults.length) % searchResults.length;
            selectSong(searchResults[currentSongIndex]);
        }
    }




    function setActivePlaylist(playlist) {
        activePlaylist =[];
        activePlaylist = playlist;
        getAllSongsInPlaylist(playlist.playlistid);
    }




    function togglePlay() {

        if (isPlaying) {
            player.pauseVideo();
            isPlaying = false;  // Update the isPlaying variable
        } else {
            player.playVideo();
            isPlaying = true;  // Update the isPlaying variable
        }

    }


    onMount(() => {
        userId = sessionStorage.getItem('userID');
        validUser();
        1000;
        // Load the YouTube IFrame Player API
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";

        const allScriptTags = document.getElementsByTagName('script');
        if (allScriptTags.length > 0) {
            const firstScriptTag = allScriptTags[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
            document.body.appendChild(tag); // fallback to appending at the end of the body
        }


        // This function gets called by the API when ready

        window.onYouTubeIframeAPIReady = () => {
            player = new YT.Player('youtubePlayer', {
                events: {
                    'onStateChange': onPlayerStateChange
                }
            });
        };


        getPlaylists();

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


    function validUser(){
        if (sessionStorage.getItem('userID') == null){
            goto('/login');
            userId = sessionStorage.getItem('userID');
        }
        console.log(userId);
    }

    async function clearProgress(){
        clearInterval(intervalID);
    }


    function onPlayerStateChange(event) {
        console.log("onPlayerStateChange triggered", event.data);
        if (event.data === YT.PlayerState.PLAYING) {
            isPlaying = true; // Set isPlaying to true when video is playing

            intervalID = setInterval(() => {
                if (player && player.getCurrentTime && player.getDuration) {
                    value = (player.getCurrentTime() / player.getDuration()) * 100;
                    value = value; // Trigger reactivity
                }
                console.log("Current Time:", player.getCurrentTime());
                console.log("Duration:", player.getDuration());
                console.log("Value:", value);

            }, 1000);
        } else {
            isPlaying = false; // Set isPlaying to false when video is not playing
            clearInterval(intervalID);
        }
    }



    function handleVolumeChange() {
        if (player && typeof player.setVolume === 'function') {
            player.setVolume(volume);  // 'volume' will have the updated value because of the binding
        }
    }

    //=================================================================
    // Get request for the playlist
    //=================================================================

    async function getPlaylists() {
        try {
            const response = await fetch("http://localhost:3001/playlist", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "user_id": userId
                })
            });
            playlists = await response.json();
        } catch (error) {
            console.error("Error fetching playlists:", error);
        }
    }

    async function sendCreatePlaylist() {
        if (createPlaylist === "") {
            alertMessage = "Please enter a playlist name";
        } else try {
            const response = await fetch("http://localhost:3001/playlist/create", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "name": createPlaylist,
                    "user_id": userId
                })
            });

            if (!response.ok) {
                alertMessage = "Error creating playlist";
            }

            const data = await response.json();
            alertMessage = "Playlist created successfully";

        } catch (error) {
            alertMessage = "Error creating playlist";
        }
        await getPlaylists();
    }

    async function sendSongQuery() {
        //clear the search results before searching again
        searchResults = [];
        try {
            const response = await fetch('http://localhost:3001/ytapi/getSongByName', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    songname: searchSongField
                })
            });

            if (response.ok) {
                searchResults = await response.json();
            } else {
                console.error("Error fetching song results:", await response.text());
            }
        } catch (error) {
            console.error("Error sending song query:", error);
        }

    }



    function selectSong(song) {
        trackTitle = song.songName;
        author = song.artistName;

        if (player && typeof player.loadVideoById === 'function') {
            player.loadVideoById(song.url);
        } else {
            youtubeVideoID = song.url;  // fallback in case the player isn't initialized yet
        }

        currentSongIndex = searchResults.findIndex(s => s.songName === song.songName && s.artistName === song.artistName);
    }

    function selectSongv2(song) {
        trackTitle = song.Title;
        author = song.Artist;

        if (player && typeof player.loadVideoById === 'function') {
            player.loadVideoById(song.URL);
        } else {
            youtubeVideoID = song.URL;  // fallback in case the player isn't initialized yet
        }

        currentSongIndex = searchResults.findIndex(s => s.Title === song.Title && s.Artist === song.Artist);
    }


    async function addSongToPlaylist(songID) {  // Default userID is set to 1
        try {
            const response = await fetch(`http://localhost:3001/playlist/addSong/${activePlaylist.playlistid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    song: songID.toString()
                })
            });

            if (response.status !== 200) {
                console.error('Error adding song to playlist:', await response.text());
            }
        } catch (error) {
            console.error('Error while making the API call:', error);
        }
    }


    async function removeSongFromPlaylist(songID) {
        try {
            const response = await fetch(`http://localhost:3001/playlist/removeSong/${activePlaylist.playlistid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    song: songID.toString()
                })
            });

            if (!response.ok) {
                console.error('Error removing song from playlist:', await response.text());
            } else {
                // Ideally, update the playlistResults here or refetch the playlist songs
                getAllSongsInPlaylist(activePlaylist.playlistid);
            }
        } catch (error) {
            console.error('Error while making the API call:', error);
        }
    }

    async function addSongToSongsDatabase(song) {
        try {
            const response = await fetch('http://localhost:3001/song', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: song.songName,
                    artist: song.artistName,
                    url: song.url
                })
            });

            if (response.status !== 200) {
                console.error('Error adding song to database:', await response.text());
            }
        } catch (error) {
            console.error('Error while making the API call:', error);
        }

        addSongToPlaylist(await checkForSongInDatabaseByURL(song.url));

    }


    async function checkForSongInDatabaseByURL(songurl) {
        try {
            const response = await fetch('http://localhost:3001/song/getSongByUrl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: songurl
                })
            });

            if (response.status === 200) {
                const data = await response.json();
                return data.SongID;
            } else if (response.status === 404) {
                return 0;
            } else {
                console.error('Unexpected response status:', response.status);
                return null;
            }
        } catch (error) {
            console.error('Error fetching song:', error);
            return null;
        }
    }


    async function getAllSongsInPlaylist(playlistID) {
        try {
            const response = await fetch(`http://localhost:3001/playlist/getSongs/${playlistID}`, {
                method: 'PUT'
            });

            if (response.status === 200) {
                playlistResults = await response.json();
            } else {
                console.error('Error retrieving songs from playlist:', await response.text());
            }
        } catch (error) {
            console.error('Error while making the API call:', error);
        }
    }

    async function addSong(playlistID, song) {
        const songID = await checkForSongInDatabaseByURL(song.url);
        if (songID === 0) {
            await addSongToSongsDatabase(song);
        } else if (songID !== null) {
            await addSongToPlaylist(songID);
        }
    }


</script>

<div class="Audio_Player">
    <Card.Root class="w-[350px]">
        <Card.Header>
            <Card.Title>{trackTitle}</Card.Title>
            <Card.Description>By: {author}</Card.Description>

        </Card.Header>

        <Separator class="my-4" />

        <!-- Media Controls -->
        <Card.Content class="flex flex-col items-center space-y-4">
            <!-- Play/Pause Button -->
            <button class="audio-button" on:click={togglePlay}>
                {#if isPlaying}
                    <IconifyIcon icon="mdi:pause-circle-outline" class="text-xl" />
                {:else}
                    <IconifyIcon icon="mdi:play-circle-outline" class="text-xl" />
                {/if}
            </button>

            <!-- Track Progress -->
            <progress class="audio-progress" value={value} max="100"></progress>

        </Card.Content>

        <Separator class="my-4" />

        <!-- Volume Control -->
        <div class="p-4">
            <input type="range" min="0" max="100" bind:value={volume} on:change={handleVolumeChange} class="volume_Slider" />
        </div>

        <Card.Footer class="flex justify-between">
            <!-- Previous and Next Buttons -->
            <Button variant="outline" on:click={prevTrack}>
                <IconifyIcon icon="mdi:skip-previous-circle-outline" />
            </Button>
            <Button on:click={nextTrack}>
                <IconifyIcon icon="mdi:skip-next-circle-outline" />
            </Button>
        </Card.Footer>
    </Card.Root>
    <iframe
            title='YouTube Player'
            id="youtubePlayer"
            width="0"
            height="0"
            src={`https://www.youtube.com/embed/${youtubeVideoID}?enablejsapi=1`}
            frameborder="0"
            allow="autoplay; encrypted-media"
            allowfullscreen>
    </iframe>
</div>



{#if alertMessage}
    <div class="passwordPopup" role="button" tabindex="0"
         on:click={() => alertMessage = null}
         on:keydown={(e) => e.key === 'Enter' && (alertMessage = null)}
         in:fly="{{ y: 0, duration: 500 }}" out:fly="{{ y: 0, duration: 500, delay: 500 }}" >
        <Alert.Root>
            <Terminal class="h-4 w-4" />
            <Alert.Title>Notice</Alert.Title>
            <Alert.Description>{alertMessage}</Alert.Description>
        </Alert.Root>
    </div>
{/if}






<div class="h-screen flex items-center justify-center backdrop-blur-3xl">
    <Tabs.Root value="playlist" class="playlist_Window relative w-8/12  / ">
        <Tabs.List class="grid w-1/4 grid-cols-2">
            <Tabs.Trigger value="playlist">Playlist</Tabs.Trigger>
            <Tabs.Trigger value="search">Search</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="playlist" class='border-l-blue-400'>
            <Card.Root>
                <Card.Header>
                    <Card.Title>{activePlaylist.name}</Card.Title>
                    <Card.Description>
                        Currently Selected Playlist
                    </Card.Description>
                </Card.Header>
                <Card.Content class="space-y-2">
                    {#if playlistResults.length}
                        <Table.Root class="w-full">
                            <Table.Header>
                                <Table.Row>
                                    <Table.Head class='text-left'>Song Name</Table.Head>
                                    <Table.Head class='text-center'>Artist</Table.Head>
                                    <Table.Head class='text-right'>Play</Table.Head>
                                    <Table.Head class='text-right'>Remove from Playlist</Table.Head>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {#each playlistResults as song}
                                    <Table.Row class="cursor-pointer hover:bg-gray-200">
                                        <Table.Cell class='text-left'>{song.Title}</Table.Cell>
                                        <Table.Cell class='text-center'>{song.Artist}</Table.Cell>
                                        <Table.Cell class='text-right'>
                                            <button on:click={() => selectSongv2(song)}><IconifyIcon icon="mdi:play-box" /></button>
                                        </Table.Cell>
                                        <Table.Cell class='text-right'>
                                            <Button on:click={() => removeSongFromPlaylist(song.SongID)}>
                                                Remove from Playlist
                                            </Button>
                                        </Table.Cell>
                                    </Table.Row>
                                {/each}
                            </Table.Body>
                        </Table.Root>
                    {/if}
                </Card.Content>
            </Card.Root>
        </Tabs.Content>

        <Tabs.Content value="search">
            <Card.Root>
                <Card.Header>
                    <Card.Title>Search Songs</Card.Title>
                    <Card.Description>
                        Search for any song on the internet!
                    </Card.Description>
                </Card.Header>
                <Card.Content class="space-y-2">
                    <div class="flex space-x-2">
                        <Input bind:value={searchSongField} placeholder="Search songs..." />
                        <Button on:click={sendSongQuery}>Search</Button>
                    </div>
                    {#if searchResults.length}
                        <Table.Root class="w-full">
                            <Table.Header>
                                <Table.Row>
                                    <Table.Head class='text-left'>Song Name</Table.Head>
                                    <Table.Head class='text-center'>Artist</Table.Head>
                                    <Table.Head class='text-right'>Play</Table.Head>
                                    <Table.Head class='text-right'>Add to Active Playlist</Table.Head>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {#each searchResults as song}
                                    <Table.Row class="cursor-pointer hover:bg-gray-200">
                                        <Table.Cell class='text-left'>{song.songName}</Table.Cell>
                                        <Table.Cell class='text-center'>{song.artistName}</Table.Cell>
                                        <Table.Cell class='text-right'>
                                            <button on:click={() => selectSong(song)}><IconifyIcon icon="mdi:play-box" /></button>
                                        </Table.Cell>
                                        <Table.Cell class='text-right'>
                                            <Button on:click={() => {
                        if (activePlaylist && activePlaylist.playlistid) {
                            addSong(activePlaylist.playlistid, song);
                        } else {
                            alertMessage = 'Please select a playlist first!';
                        }
                    }}>Add to Playlist</Button>
                                        </Table.Cell>
                                    </Table.Row>
                                {/each}
                            </Table.Body>
                        </Table.Root>
                    {/if}
                </Card.Content>
            </Card.Root>
        </Tabs.Content>
    </Tabs.Root>
</div>




<div class="myPlaylistWindow">
    <Card.Root class="w-[350px]">
        <Card.Header>
            <Card.Title>My Playlist</Card.Title>
            <Card.Description>Note: Playlist ID is used only for developement and will be replaced in later versions</Card.Description>
        </Card.Header>

        <Separator class="my-4" />

        <Table.Root>
            <Table.Caption>A list of your playlists.</Table.Caption>
            <Table.Header>
                <Table.Row>
                    <Table.Head class="text-left">Playlist ID</Table.Head>
                    <Table.Head class="text-center">Name</Table.Head>
                    <Table.Head class="text-right">Select Playlist</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {#each playlists as playlist}
                    <Table.Row>
                        <Table.Cell class="font-medium">{playlist.playlistid}</Table.Cell>
                        <Table.Cell class="text-center">{playlist.name}</Table.Cell>
                        <Table.Cell class='text-right'>
                            <Button on:click={() => setActivePlaylist(playlist)}>
                                Select
                            </Button>
                        </Table.Cell>
                    </Table.Row>
                {/each}
            </Table.Body>
        </Table.Root>

        <Separator class="my-4" />

        <Card.Footer class="flex right-1">
            <Popover>
                <PopoverTrigger asChild let:builder>
                    <Button builders={[builder]} variant="outline">
                        <IconifyIcon icon="mdi:plus" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent class="newPlaylist">
                    <div class="grid gap-4">
                        <div class="space-y-2">
                            <h4 class="font-medium leading-none">New Playlist</h4>
                            <p class="text-sm text-muted-foreground">
                                Set the name for the playlist.
                            </p>
                        </div>
                        <div class="grid gap-2">
                            <div class="grid grid-cols-3 items-center gap-4">
                                <Label for="playlistNameNew">New Playlist Name:</Label>
                                <Input id="playlistNameNew" bind:value={createPlaylist} class="col-span-2 h-8 outline-blue-500" />
                            </div>
                            <div class="grid grid-cols-3 items-center gap-4">
                                <Button on:click={sendCreatePlaylist}>Save Playlist</Button>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </Card.Footer>
    </Card.Root>
</div>

