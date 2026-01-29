import ReactMarkdown from 'react-markdown';
import type { KeyboardEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { FaArrowUp } from 'react-icons/fa';
import TypingIndicator from './typingIndicator';

type FormData = {
   prompt: string;
};

type ChatResponse = {
   message: string;
};

type Message = {
   content: string;
   role: 'user' | 'bot';
};

function ChatBot() {
   const [messages, setMessages] = useState<Message[]>([]);
   const [isBotTyping, setIsBotTyping] = useState(false);
   const [error, setError] = useState('');
   const lastMessageref = useRef<HTMLDivElement | null>(null);

   const conversationId = useRef(crypto.randomUUID());

   // Destructure toolboxes to be used in useForm before accessing them.
   const { register, handleSubmit, reset, formState } = useForm<FormData>();

   // Ensuring scroll event
   useEffect(() => {
      lastMessageref.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   const onSubmit = async ({ prompt }: FormData) => {
      try {
         setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
         setIsBotTyping(true);
         setError('');

         // reseting the text area to empty
         reset({ prompt: '' });

         const { data } = await axios.post<ChatResponse>('/api/chat', {
            prompt: prompt,
            conversationId: conversationId.current,
         });
         setMessages((prev) => [
            ...prev,
            { content: data.message, role: 'bot' },
         ]);
      } catch (error) {
         console.error(error);
         setError('Something went wrong!');
      } finally {
         setIsBotTyping(false);
      }
   };

   const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };

   // prevent copying default HTMLEvent
   const onCopyMessage = (e: React.ClipboardEvent) => {
      const selection = window.getSelection()?.toString().trim();
      if (selection) {
         e.preventDefault();
         e.clipboardData.setData('text/plain', selection);
      }
   };

   return (
      <div className="flex flex-col h-screen ">
         <div className="flex flex-col flex-1 gap-4 mb-6 overflow-y-auto ">
            {messages.map((message, index) => (
               <div
                  key={index}
                  onCopy={onCopyMessage}
                  ref={index === messages.length - 1 ? lastMessageref : null}
                  className={`px-3 py-1 rounded-xl 
                     ${
                        message.role === 'user'
                           ? 'bg-blue-600 text-white self-end'
                           : 'bg-gray-100 text-black self-start'
                     }`}
               >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
               </div>
            ))}
            {isBotTyping && (<TypingIndicator />)}
            {error && <p className="text-red-500">{error}</p>}
         </div>
         <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={onKeyDown}
            // Scrolling effect
            className="mt-4 mr-3 mb-4 flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
         >
            <textarea
               // ... allows spreading all methods from register
               {...register('prompt', {
                  // disable submission on empty form
                  required: true,
                  // Ensure form submission arrow is disabled on white spaces and 0 length
                  validate: (data) => data.trim().length > 0,
               })}
               autoFocus
               className="w-full border-0 focus:outline-0 resize-none"
               placeholder="Ask anything"
               maxLength={1000}
            />
            <Button
               disabled={!formState.isValid}
               className="rounded-full w-9 h-9"
            >
               <FaArrowUp />
            </Button>
         </form>
      </div>
   );
}

export default ChatBot;
