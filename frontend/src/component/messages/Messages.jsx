import React, { useEffect, useRef } from 'react';
import Message from './Message';
import useGetMessages from '../../hooks/useGetMessages';
import MessageSkeleton from '../skeletons/MessageSkeleton';
import useConversation from '../../zustand/useConversation';
import useListenMessages from '../../hooks/useListenMessages';

const Messages = () => {
  const { loading } = useGetMessages();
  const { messages: localMessages } = useConversation();
  useListenMessages();
  const lastMessageRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [localMessages]);

  return (
    <div className='px-4 flex-1 overflow-auto'>
      {!loading && Array.isArray(localMessages) && localMessages.length > 0 && localMessages.map((message, idx) => (
        <div key={message._id || idx} ref={idx === localMessages.length - 1 ? lastMessageRef : null}>
          <Message message={message} />
        </div>
      ))}

      {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
      {!loading && Array.isArray(localMessages) && localMessages.length === 0 && (
        <p className='text-center'>Send a message to start the conversation</p>
      )}
    </div>
  );
};

export default Messages;
