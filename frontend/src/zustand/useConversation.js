import { create } from 'zustand';

// useConversation holds the create function, it gets the set as an argument
// this will return an object and that's going to be our global state
const useConversation = create((set) => ({
    selectedConversation: null, // by default null
    setSelectedConversation: (selectedConversation) => set({ selectedConversation }), // update the selected conversation

    messages: [], // by default empty array
    setMessages: (messages) => set({ messages }), // update the messages array
}));

export default useConversation;