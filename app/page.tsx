'use client';
import { useState, useEffect } from 'react';
import { useChat } from 'ai/react';
import { getAZBestSeller } from './util/getAZ';
import { Button } from '@/components/ui/button';
import { Loader2 } from "lucide-react"
import { marked } from 'marked';
// import BestSeller from '@/components/BestSeller/BestSeller';
interface BestSellerProps {
  name: string
  price: string
}
export default function Chat() {

  const [userIsTyping, setUserIsTyping] = useState(false)
  const [chatHistory, setChatHistory] = useState([])

  const [error, setError] = useState("")
  const [bestSellerData, setBestSellerData] = useState<BestSellerProps[]>([])

  const [isFetchingBestSeller, setIsFetchingBestSeller] = useState(false)
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
    setChatHistory([])
    localStorage.setItem('chatHistory', JSON.stringify([]))
  }

  const handleGetAZBestSellect = async () => {
    setIsFetchingBestSeller(true)

    try {
      const data = await getAZBestSeller();

      if (typeof data === 'string') {
        throw new Error(data); // Handle error message returned from API
      }

      const formattedData = data.products.map((item: any) => ({
        name: item.name,
        price: Number(item.price.replace('$', '')), // Convert price to number
      }));

      const sliceData = JSON.stringify(formattedData.slice(0, 10));
      setBestSellerData(formattedData.slice(0, 10));

      setMessages([
        ...messages,
        {
          id: 'test',
          role: "user",
          content: `Help analyze this Amazon Best seller data: ${sliceData}}`
        }
      ]);
      handleSubmit();
    } catch (error: any) {
      console.error(error.message);
      setError("An error occurred while fetching Amazon Best Seller data. Please try again later.");
    } finally {
      setIsFetchingBestSeller(false);
    }
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
    <div className="flex flex-col w-full max-w-2xl mx-auto stretch p-4 p-sm-0 pb-20">

      {/* Chat content */}
      <section className="mb-16">

        {
          messages.length === 0
            ?
            <div className="w-full text-center mt-6">
              <span className="text-center text-3xl font-bold">Chat with me</span>
            </div>
            :
            messages.map(m => (
              m.role === 'user' ? (
                <div key={m.id} className=" my-6 flex justify-end items-center">
                  <p className="bg-white text-black p-3 w-fit rounded-lg border border-black">

                    {m.content.includes(JSON.stringify(bestSellerData)) ?
                      <div>
                        Analyzing Amazon Bestseller Data
                        {
                          bestSellerData.map((item, index) =>
                          (

                            <p key={index}>{index + 1}. {item.name} : {item.price}$</p>
                          )
                          )}
                      </div>
                      :
                      m.content}
                  </p>
                  {/* {m.createdAt ? new Date(m.createdAt).toLocaleString() : "123"} */}
                </div>
              ) : (
                <div key={m.id} className=" text-black　text-end flex">

                  <p className="text-gray-900 mr-3 mt-1">
                    Bot
                  </p>
                  <div>
                    <p className="bg-white z-10 text-black p-3 rounded-lg border border-black">

                    <div dangerouslySetInnerHTML={{ __html: marked(m.content) }} />
                      {/* {marked(m.content)} */}
                    </p>
                    <p className="mt-1 text-sm">
                      {m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}
                    </p>
                  </div>
                </div>
              )
            ))
        }
        {/* 錯誤訊息 */}
        {
          error.length > 0 && messages.length === 0 &&
          <p className="text-red-500 text-center mt-2">{error}</p>
        }
        {
          userIsTyping &&
          <div aria-live="polite" aria-atomic="true">
            <div className=" my-6 flex justify-end items-center">
              <p className=" text-gray-400 p-3 w-fit rounded-lg">
                User is typing..
              </p>
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
            </div>
          </div>
        }
      </section>

      {/* Function footer */}
      <section>
        <div>

          <Button
            variant="secondary"
            className="fixed bottom-2 my-20 bg-emerald-600 text-white hover:bg-emerald-700"
            onClick={handleGetAZBestSellect}
            disabled={isLoading || isFetchingBestSeller}
          >
            {
              isLoading || isFetchingBestSeller
                ?
                <div className="flex gap-2">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <p>
                    Please Wait
                  </p>
                </div>
                :
                "Analyze Amazon Best Seller"
            }
          </Button>
        </div>
        {
          messages.length > 0 &&
          <div className="flex justify-end items-center">
            <Button
              variant="secondary"
              className="fixed bottom-2 my-20 bg-emerald-600 text-white hover:bg-emerald-700"
              // className='my-20 w-fit fixed bottom-2'
              onClick={handleClearHistory}
              aria-label="Restart New Conversation"
            >
              <p >
                Restart
              </p>
            </Button>
          </div>
        }

        <form
          id="botForm"
          onSubmit={handleSubmit}
        >
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
      </section>


    </div>
  );
}