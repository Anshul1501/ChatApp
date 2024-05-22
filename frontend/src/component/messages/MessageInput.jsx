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
    setMessage(""); // if message is sent successfully then set message string to empty again 
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
        />

        <button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3' disabled={loading}>
          {loading ? <div className='loading loading-spinner'></div> : <LuSend />}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
