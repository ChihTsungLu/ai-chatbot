'use client';
import { useState, useEffect } from 'react';
import { useChat } from 'ai/react';

export default function Chat() {

  const [userIsTyping, setUserIsTyping] = useState(false)
  const [chatHistory, setChatHistory] = useState()

  const { messages, setMessages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "api/chat",
    onError: (e) => {
      console.error(e)
    },
    initialMessages: chatHistory
  });

  const handleInputBlur = () => {
    if (userIsTyping) {
      setUserIsTyping(false)
    }
  };
  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter' && !userIsTyping) {
      setUserIsTyping(false)
    }
  };

  const handleUserIsTyping = () => {
    if (!userIsTyping) {
      setUserIsTyping(true)
    }
  }

  const handleClearHistory = () => {
    setMessages([])
    localStorage.setItem('chatHistory', JSON.stringify([]))
  }

  useEffect(() => {
    if (input.length === 0) {
      setUserIsTyping(false)
    }

    if (!isLoading && messages.length !== 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages))
    }
  }, [input, isLoading])

  useEffect(() => {
    const storedChatHistory = localStorage.getItem('chatHistory');

    if (storedChatHistory) {
      setChatHistory(JSON.parse(storedChatHistory));
    }
  }, [])


  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto stretch p-4 p-sm-0">
      {
        messages.length === 0
          ?
          <div className="w-full text-center mt-6">
            <span className="green_gradient text-center text-3xl font-bold">Chat with me</span>
          </div>
          :
          messages.map(m => (
            m.role === 'user' ? (
              <div key={m.id} className=" my-6 flex justify-end items-center">
                <p className="bg-white text-black p-3 w-fit rounded-lg border border-black">

                  {m.content}
                </p>
                {/* {m.createdAt ? new Date(m.createdAt).toLocaleString() : "123"} */}
              </div>
            ) : (
              <div key={m.id} className=" text-black　text-end flex">

                <p className="text-gray-900 mr-3 mt-1">
                  Bot
                </p>
                <div>
                  <p className="bg-white text-black p-3 rounded-lg border border-black">

                    {m.content}
                  </p>
                  <p className="mt-1 text-sm">
                    {m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}
                  </p>
                </div>
              </div>
            )
          ))
      }
      {
        userIsTyping &&
        <div aria-live="polite" aria-atomic="true">
          <div className=" my-6 flex justify-end items-center">
            <p className=" text-gray-400 p-3 w-fit rounded-lg">
              User is typing..
            </p>
            {/* {m.createdAt ? new Date(m.createdAt).toLocaleString() : "123"} */}
          </div>
        </div>
      }
      {
        isLoading &&
        <div aria-live="polite" aria-atomic="true">
          <div className=" my-6 flex justify-start items-center">
            <p className=" text-gray-400 p-3 w-fit rounded-lg">
              Bot is typing..
            </p>
            {/* {m.createdAt ? new Date(m.createdAt).toLocaleString() : "123"} */}
          </div>
        </div>
      }


      {
        messages.length > 0 &&
        <button
          className='my-20 w-fit fixed bottom-2'
          onClick={handleClearHistory}
          aria-label="Restart New Conversation"
        >
          <p className='border rounded-lg w-fit p-2 text-sm bg-emerald-600	 border-slate-300 text-white'>
            Restart New Conversation
          </p>
        </button>
      }

      <form onSubmit={handleSubmit}>
        <label htmlFor="chat-input" className="sr-only">Say something...</label>
        <input
          className="fixed bottom-0 text-black w-11/12 max-w-2xl p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
          onInput={handleUserIsTyping}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          aria-label="Chat input"
          id="chat-input"
        />
      </form>


    </div>
  );
}