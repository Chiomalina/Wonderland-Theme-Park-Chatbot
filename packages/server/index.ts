import express from 'express';
import type { Response, Request } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import z from 'zod';

dotenv.config();

const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

const app = express();

// Establish express middleware
app.use(express.json());

const port = process.env.PORT || 3000;

// Anotate types in home route

app.get('/', (req: Request, res: Response) => {
   res.send('Hello World!');
});

// store previous response to enable chatgpt remember conversations
let lastResponseId: string | null = null;
// conversationId -> lastResponseId
// conv1 -> 100
// conv2 -> 200
const conversations = new Map<string, string>();

//Input validation with zod
const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required. ')
      .max(1000, 'Prompt is too long (max 1000 characters)'),

   // z.string().uuid() is deprecated so we use only z.uuid()
   conversationId: z.uuid(),
});

app.post('/api/chat', async (req: Request, res: Response) => {
   // Validate incoming request data with handler (zod)
   const parsedResult = chatSchema.safeParse(req.body);

   // Catch and handle thrown error
   if (!parsedResult.success) {
      // 'parsedResult.error.format' is deprecated.ts(6387) so we Use the z.treeifyError(err) function instead.
      res.status(400).json(z.treeifyError(parsedResult.error));
      return;
   }

   const { prompt, conversationId } = req.body;

   const response = await client.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
      temperature: 0.2,
      max_output_tokens: 100,
      previous_response_id: conversations.get(conversationId),
   });

   conversations.set(conversationId, response.id);
   lastResponseId = response.id;

   res.json({ message: response.output_text });
});

// Anotate types in home route
app.get('/api/hello', (req: Request, res: Response) => {
   res.send('Hello Welcome to Summerizer!');
});

app.listen(port, () => {
   console.log(`Server is running at http://localhost:${port}`);
});
