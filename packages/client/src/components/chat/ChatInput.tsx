import type { KeyboardEvent } from 'react';
import { useForm } from 'react-hook-form';
import { FaArrowUp } from 'react-icons/fa';
import { Button } from '../ui/button';

export type ChatFormData = {
   prompt: string;
};

type Props = {
   onSubmit: (data: ChatFormData) => void | Promise<void>;
};

const MAX_LEN = 1000;

const ChatInput = ({ onSubmit }: Props) => {
   const { register, handleSubmit, reset, formState } = useForm<ChatFormData>({
      defaultValues: { prompt: '' },
      mode: 'onChange',
   });

   const submit = handleSubmit(async (data) => {
      reset({ prompt: '' });
      await onSubmit(data);
   });

   const handleKeydown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         void submit();
      }
   };

   return (
      <form
         onSubmit={submit}
         className="mt-4 mr-3 mb-4 flex flex-col items-end gap-2 rounded-3xl border-2 p-4"
      >
         <textarea
            {...register('prompt', {
               required: true,
               validate: (value) => value.trim().length > 0,
            })}
            onKeyDown={handleKeydown}
            autoFocus
            className="w-full resize-none border-0 focus:outline-0"
            placeholder="Ask anything"
            maxLength={MAX_LEN}
         />

         <Button disabled={!formState.isValid} className="h-9 w-9 rounded-full">
            <FaArrowUp />
         </Button>
      </form>
   );
};

export default ChatInput;
