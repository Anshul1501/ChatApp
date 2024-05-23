import { LuSend } from "react-icons/lu";
import useSendMessage from '../../hooks/useSendMessage';
import { useState } from 'react';

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const { loading, sendMessage } = useSendMessage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    await sendMessage(message);
    setMessage(""); // Reset message input after sending
  };

  return (
    <form className='px-4 my-3' onSubmit={handleSubmit}>
      <div className='w-full relative'>
        <input
          type="text"
          className='border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white'
          placeholder='Send a message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
          aria-label="Message input"
        />
        <button
          type='submit'
          className='absolute inset-y-0 right-0 flex items-center pr-3'
          disabled={loading}
          aria-label="Send message"
        >
          {loading ? <div className='loading loading-spinner'></div> : <LuSend />}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
