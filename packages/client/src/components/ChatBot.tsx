import type { KeyboardEvent } from 'react';
import { useRef } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { FaArrowUp } from 'react-icons/fa';

type FormData = {
   prompt: string;
};

function ChatBot() {
   const conversationId = useRef(crypto.randomUUID());
   // Destructure toolboxes to be used in useForm before accessing them.
   const { register, handleSubmit, reset, formState } = useForm<FormData>();

   const onSubmit = async ({ prompt }: FormData) => {
      console.log(prompt);
      // reseting the text area to empty
      reset();

      const { data } = await axios.post('/api/chat', {
         prompt: prompt,
         conversationId: conversationId.current,
      });
      console.log(data);
   };

   const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };

   return (
      <form
         onSubmit={handleSubmit(onSubmit)}
         onKeyDown={onKeyDown}
         className="mt-4 mr-3 flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
      >
         <textarea
            // ... allows spreading all methods from register
            {...register('prompt', {
               // disable submission on empty form
               required: true,

               // Ensure form submission arrow is disabled on white spaces and 0 length
               validate: (data) => data.trim().length > 0,
            })}
            className="w-full border-0 focus:outline-0 resize-none"
            placeholder="Ask anything"
            maxLength={1000}
         />
         <Button disabled={!formState.isValid} className="rounded-full w-9 h-9">
            <FaArrowUp />
         </Button>
      </form>
   );
}

export default ChatBot;
