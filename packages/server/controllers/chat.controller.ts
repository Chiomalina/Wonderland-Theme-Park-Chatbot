import type { Request, Response } from 'express';
import z from 'zod';
import { chatService } from '../services/chat.service';

/**
 * Validates the incoming chat request body.
 * Keeps the controller lean and prevents runtime surprises.
 */

const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required. ')
      .max(1000, 'Prompt is too long (max 1000 characters)'),

   // z.string().uuid() is deprecated in some Zod versions; prefer `z.uuid()`.
   conversationId: z.uuid(),
});

type ChatRequestBody = z.infer<typeof chatSchema>;

// Public interface
export const chatController = {
   /**
    * Validates the request body and delegates the actual chat logic to the service layer.
    * @param req POST/api/chat
    * @param res
    * @returns
    */
   async sendMessage(req: Request, res: Response) {
      // Validate request body (do not trust client input).
      const parsedResult = chatSchema.safeParse(req.body);

      if (!parsedResult.success) {
         // Return structures validation errors (useful for frontend form validation)
         res.status(400).json(z.treeifyError(parsedResult.error));
         return;
      }

      try {
         // Use validated data (not req.body directly).
         const { prompt, conversationId } =
            parsedResult.data satisfies ChatRequestBody;
         const response = await chatService.sendMessage(prompt, conversationId);

         res.status(200).json({ message: response.message });
      } catch (error) {
         // Avoid leaking internal error details in production responses.
         res.status(500).json({ error: 'Failed to generate a response' });
      }
   },
};
