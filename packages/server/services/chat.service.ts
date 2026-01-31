import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { ConversationRepository } from '../repositories/conversation.repository';
import template from '../prompts/chatbot.txt';

/**
 * openAI client configuration.
 * This is the single place where the LLM provider and model are defined.
 */
const openAIclient = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Load static prompt context at startup.
 * This avoids repeated disk I/O on every request.
 */
const parkInfo = fs.readFileSync(
   path.join(__dirname, '..', 'prompts', 'WonderWorld.md'),
   'utf-8'
);

// File system instructions injected into the base prompt template.
const instructions = template.replace('{{parkInfo}}', parkInfo);

type ChatResponse = {
   id: string;
   message: string;
};

/**
 * Service responsible for interacting with the LLM.
 * Handles prompt execution, conversation continuity, and response shaping.
 */
export const chatService = {
   async sendMessage(
      prompt: string,
      conversationId: string
   ): Promise<ChatResponse> {
      const response = await openAIclient.responses.create({
         model: 'gpt-4o-mini',
         instructions,
         input: prompt,
         temperature: 0.2,
         max_output_tokens: 100,
         previous_response_id:
            ConversationRepository.getLastResponseId(conversationId),
      });

      // Persist las response ID to maintain conversational context
      ConversationRepository.setLastResponseId(conversationId, response.id);

      return {
         id: response.id,
         message: response.output_text,
      };
   },
};
