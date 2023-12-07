import { writable } from 'svelte/store';

function createUserStore() {
    const { subscribe, set } = writable('');

    return {
        subscribe,
        initialize: () => {
            if (typeof window !== 'undefined') {
                const storedUsername = localStorage.getItem('username');
                set(storedUsername || '');
            }
        }
    };
}

export const user = createUserStore();