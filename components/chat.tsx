'use client'

// import { useChat, type Message } from 'ai/react'
import { useChat, type Message } from '@/components/use-chat'

import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

import { useRouter } from 'next/navigation'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

import { models, openaiModels } from '@/components/models'

export function Chat({ id, initialMessages, className }: ChatProps) {

  const [selectmodeldialog, setSelectModelDialog] = useState(false);
  const [selectedModel, setSelectedModel] = useLocalStorage<string>('selectedModel', models[0]);
  const [openaiKey, setOpenaiKey] = useLocalStorage<string>('openaiKey', '');
  const [hfToken, setHfToken] = useLocalStorage<string>('hfToken', '');
  const [youtubeSearch, setYoutubeSearch] = useLocalStorage<boolean>('youtubeSearch', false);

  let apiKey;

  // Check if selectedModel is included in openaiModels
  if (openaiModels.includes(selectedModel)) {
    apiKey = openaiKey;
  } else {
    apiKey = hfToken;
  }

  const router = useRouter()
  
  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      initialMessages,
      id,
      body: {
        id,
        apiKey,
        selectedModel,
        youtubeSearch
      },
      onResponse(response) {
        if (response.status != 200) {

          if (response.status == 401) {
            toast.error(`Invalid API Key.\n Select Model > Enter API Key.`)
          } else {
            toast.error(`${response.statusText}`)
          }
        }
      }
    })

  if (messages.length == 1) {
    router.push(`/chat/${id}`)
  }

  return (
    <>
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} sources={id} youtubeSearch={youtubeSearch}/>
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <EmptyScreen 
          setInput={setInput}
          selectmodeldialog = {selectmodeldialog} 
          setSelectModelDialog = {setSelectModelDialog}
          selectedModel = {selectedModel}
          setSelectedModel = {setSelectedModel}
          openaiKey = {openaiKey}
          setOpenaiKey={setOpenaiKey}
          hfToken = {hfToken}
          setHfToken={setHfToken}
          models = {models}
          youtubeSearch = {youtubeSearch}
          setYoutubeSearch = {setYoutubeSearch}
          />
        )}
      </div>
      <ChatPanel
        id={id}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
      />
    </>
  )
}
