/**
 * In-memory store mapping a conversation ID to the last model response ID.
 * This enables conversational continuity when interacting with the LLM.
 * Note: This is process-local and will reset on server restart.
 */
const conversationStore = new Map<string, string>();

/**
 * Repository responsible for managing conversation state.
 * Acts as a thin abstraction over the in-memory store.
 */
export const ConversationRepository = {
   // Retrieves the last response ID for a given conversation.
   getLastResponseId(conversationId: string): string | undefined {
      return conversationStore.get(conversationId);
   },

   // Persists the last response ID for a given conversation.
   setLastResponseId(conversationId: string, responseId: string) {
      return conversationStore.set(conversationId, responseId);
   },
};
