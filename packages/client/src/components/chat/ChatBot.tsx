import type { Message } from './ChatMessages';
import type { ChatFormData } from './ChatInput';
import { useRef, useState } from 'react';
import axios from 'axios';
import TypingIndicator from './typingIndicator';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import notificationSound from '@/assets/sounds/notification.mp3';
import popSound from '@/assets/sounds/pop.mp3';

const popAudio = new Audio(popSound);
popAudio.volume = 0.2;

const notificationAudio = new Audio(notificationSound);
notificationAudio.volume = 0.2;

type ChatResponse = {
   message: string;
};

function ChatBot() {
   const [messages, setMessages] = useState<Message[]>([]);
   const [isBotTyping, setIsBotTyping] = useState(false);
   const [error, setError] = useState('');

   const conversationId = useRef(crypto.randomUUID());

   const onSubmit = async ({ prompt }: ChatFormData) => {
      try {
         setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
         setIsBotTyping(true);
         setError('');
         popAudio.play();

         const { data } = await axios.post<ChatResponse>('/api/chat', {
            prompt: prompt,
            conversationId: conversationId.current,
         });
         setMessages((prev) => [
            ...prev,
            { content: data.message, role: 'bot' },
         ]);
         notificationAudio.play();
      } catch (error) {
         console.error(error);
         setError('Something went wrong!');
      } finally {
         setIsBotTyping(false);
      }
   };

   return (
      <div className="flex flex-col h-screen ">
         <div className="flex flex-col flex-1 gap-4 mb-6 overflow-y-auto ">
            <ChatMessages messages={messages} />

            {isBotTyping && <TypingIndicator />}
            {error && <p className="text-red-500">{error}</p>}
         </div>
         <ChatInput onSubmit={onSubmit} />
      </div>
   );
}

export default ChatBot;
