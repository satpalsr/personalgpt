import { type Message } from 'ai'

import { Separator } from '@/components/ui/separator'
import { ChatMessage } from '@/components/chat-message'
import { SourceBlock } from '@/components/source-block'

export interface ChatList {
  messages: Message[]
  // sources: JSON[]
  sources: any
  youtubeSearch: boolean
}

export function ChatList({ messages, sources, youtubeSearch }: ChatList) {
  if (!messages.length) {
    return null
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
        <div key={index}>
          <ChatMessage message={message} />
          {index < messages.length - 1 && (
            <Separator className="my-4 md:my-8" />
          )}
          {/* for index = 0, add <sourceBlock/> */}
          {index == 0 && youtubeSearch && (
            <SourceBlock sources={sources}/>
          )}
        </div>
      ))}
    </div>
  )
}
