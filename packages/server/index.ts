import express from 'express';
import type { Response, Request } from 'express';
import dotenv from 'dotenv';
import { chatController } from './controllers/chat.controller';

dotenv.config();

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

app.post('/api/chat', chatController.sendMessage);

// Anotate types in home route
app.get('/api/hello', (req: Request, res: Response) => {
   res.send('Hello Welcome to Summerizer!');
});

app.listen(port, () => {
   console.log(`Server is running at http://localhost:${port}`);
});
