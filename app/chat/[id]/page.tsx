'use client'
// import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

// import { getChat } from '@/app/actions'
import { Chat } from '@/components/chat'
import { cn } from '@/lib/utils'

import { getLocalStorageItem } from '@/utils/localStorage'
import { useState, useEffect } from 'react'

export const runtime = 'edge'
export const preferredRegion = 'home'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export default function ChatPage({ params }: ChatPageProps) {
  const [chat, setChat] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChatData() {
      try {
        // Simulate an API call or any async operation to get chat data
        // const chatData = await getChat(params.id);

        // Simulating getting chat data from local storage
        const chatData = getLocalStorageItem(`chat:${params?.id}`);

        setChat(chatData);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch chat data.');
        setLoading(false);
      }
    }

    fetchChatData();
  }, [params?.id]);

  if (loading) {
    return (
      <div className='pb-[200px] pt-4 md:pt-10 items-center flex flex-col'>
        <div className='w-10 h-10 border-4 border-t-4 border-gray-400 rounded-full animate-spin'></div>
      </div>
    )
  }

  if (error) {
    return <div>{error}</div>; // You can display a specific error message here
  }

  if (!chat) {
    return <div>No chat data available.</div>; // You can display a message when chat data is not found
  }

  return <Chat id={params?.id} initialMessages={chat} />;
}

