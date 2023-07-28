// utils/localStorage.ts
'use client'
export function setLocalStorageItem(key: string, value: any) {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
}
  
export function getLocalStorageItem<T>(key: string): T | null {
    if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    }
    return null;
}

export function removeLocalStorageItem(key: string) {
    if (typeof window !== 'undefined') {
        
        try {
            window.localStorage.removeItem(key);
            // Return success status
            return { success: true };
        } catch (error) {
            // Return error information if an error occurs
            return { error: 'An error occurred while clearing data.' };
        }

    }

    return { error: 'Clearing data is not supported in this environment.' };
}

export type ChatEntry = {
    id: string;
    path: string;
    title: string;
    createdAt: number; // Assuming createdAt is a string, you can adjust the type accordingly
};

export function getChatEntryById(id: string): ChatEntry | null {
    if (typeof window !== 'undefined') {
        // Step 1: Retrieve the existing set of chat entries from localStorage
        const existingEntries: ChatEntry[] = getLocalStorageItem<ChatEntry[]>('chatentries') || [];

        // Step 2: Find the chat entry with the given ID
        const chatEntry = existingEntries.find((entry) => entry.id === id);

        return chatEntry || null;
    }

    return null;
}

export function addChatEntry(chatEntry: ChatEntry) {
    if (typeof window !== 'undefined') {
        // Step 1: Retrieve the existing set of chat entries from localStorage
        const existingEntries: ChatEntry[] = getLocalStorageItem<ChatEntry[]>('chatentries') || [];

        // Step 2: Check if the ID already exists in the set
        const existingEntryIndex = existingEntries.findIndex((entry) => entry.id === chatEntry.id);

        if (existingEntryIndex === -1) {
            // Step 3: Add the new chat entry to the set
            existingEntries.push(chatEntry);

            // Step 4: Save the updated set back to localStorage
            setLocalStorageItem('chatentries', existingEntries);
        } else {
            // If the ID already exists, update the entry with the new information
            existingEntries[existingEntryIndex] = { ...existingEntries[existingEntryIndex], ...chatEntry };

            // Step 4: Save the updated set back to localStorage
            setLocalStorageItem('chatentries', existingEntries);
        }
    }
}

export function getAllChatEntries(): ChatEntry[] {
    // Returns the current set of chat entries from localStorage
    const entries: ChatEntry[] = getLocalStorageItem<ChatEntry[]>('chatentries') || [];

    // Reverse the array to get the entries in reverse order (So that newest chat appears at top in sidebar.)
    return entries.reverse();
}


// export function clearChats() {
//     if (typeof window !== 'undefined') {
//         // Step 1: Retrieve the existing set of chat entries from localStorage
//         const chatEntries: ChatEntry[] = getLocalStorageItem<ChatEntry[]>('chatentries') || [];

//         // Step 2: Iterate through the chat entries and remove each entry and its corresponding ID
//         for (const entry of chatEntries) {
//             // Remove the individual entry for the specific ID (chat${id})
//             removeLocalStorageItem(`chat${entry.id}`);
//         }

//         // Step 3: Remove the entire 'chatentries' array from localStorage
//         removeLocalStorageItem('chatentries');
//     }
// }

export function clearChats() {
    if (typeof window !== 'undefined') {
        try {
            // Step 1: Retrieve the existing set of chat entries from localStorage
            const chatEntries: ChatEntry[] = getLocalStorageItem<ChatEntry[]>('chatentries') || [];

            // Step 2: Iterate through the chat entries and remove each entry and its corresponding ID
            for (const entry of chatEntries) {
                // Remove the individual entry for the specific ID (chat${id})
                removeLocalStorageItem(`chat${entry.id}`);
            }

            // Step 3: Remove the entire 'chatentries' array from localStorage
            removeLocalStorageItem('chatentries');

            // Return success status
            return { success: true };
        } catch (error) {
            // Return error information if an error occurs
            return { error: 'An error occurred while clearing chat data.' };
        }
    }

    // Return error information if 'window' is undefined
    return { error: 'Clearing chat data is not supported in this environment.' };
}

export function deleteChat(id: string) {
    if (typeof window !== 'undefined') {

        try {

            // Step 1: Retrieve the existing set of chat entries from localStorage
            const existingEntries: ChatEntry[] = getLocalStorageItem<ChatEntry[]>('chatentries') || [];
        
            // Step 2: Find the index of the entry with the specified ID
            const existingEntryIndex = existingEntries.findIndex((entry) => entry.id === id);
        
            if (existingEntryIndex !== -1) {
                // Step 3: Remove the entry from the array
                existingEntries.splice(existingEntryIndex, 1);
        
                // Step 4: Save the updated set back to localStorage
                setLocalStorageItem('chatentries', existingEntries);
            }
        
            // Step 5: Remove the specific chat entry from localStorage
            const chatEntryKey = `chat:${id}`;
            removeLocalStorageItem(chatEntryKey);

            return { success: true };
        } catch (error) {
            // Return error information if an error occurs
            return { error: 'An error occurred while clearing chat data.' };
        }
    }

    return { error: 'Clearing chat data is not supported in this environment.' };

  }

// export function saveSelectedModel(selectedModel: string) {
//     if (typeof window !== 'undefined') {
//         // Save the selected model to localStorage
//         localStorage.setItem('selectedModel', selectedModel);
//     }
// }

// export function getSelectedModel(): string | null {
//     if (typeof window !== 'undefined') {
//         // Retrieve the selected model from localStorage
//         return localStorage.getItem('selectedModel');
//     }

//     return null;
// }

// export function getApiKey(){
//     if (typeof window !== 'undefined') {
//         const selectedModel = getSelectedModel();
//         // Retrieve the API key from localStorage
//         return localStorage.getItem(`ai-token-${selectedModel}`);
//     }

//     return null;
// }

// export function saveApiKey(selectedModel: string, apiKey: string) {
//     if (typeof window !== 'undefined') {
//         // Save the selected Model
//         saveSelectedModel(selectedModel);
//         // Save the API key
//         localStorage.setItem(`ai-token-${selectedModel}`, apiKey);
//     }
//     return null;
// }

