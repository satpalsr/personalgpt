'use client'
// import { type UseChatHelpers } from 'ai/react'
import { type UseChatHelpers } from '@/components/use-chat'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { IconRefresh, IconStop } from '@/components/ui/icons'
import { FooterText } from '@/components/footer'

import React, { useEffect } from 'react';
import { setLocalStorageItem, addChatEntry } from '@/utils/localStorage'
import { toast } from 'react-hot-toast'

export interface ChatPanelProps
  extends Pick<
    UseChatHelpers,
    | 'append'
    | 'isLoading'
    | 'reload'
    | 'messages'
    | 'stop'
    | 'input'
    | 'setInput'
  > {
  id?: string
}

export function ChatPanel({
  id,
  isLoading,
  stop,
  append,
  reload,
  input,
  setInput,
  messages,
}: ChatPanelProps) {

  const router = useRouter()

  useEffect(() => {

    if (id) {
      setLocalStorageItem(`chat:${id}`, messages)
      if (messages.length > 0) {
        addChatEntry({ id, path: `/chat/${id}`, title: messages[0]['content'].substring(0, 100), createdAt: Date.now() })
        // router.push(`/chat/${id}`)
      }
    }

  }, [id, messages])

  return (
    <div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="flex h-10 items-center justify-center">
          {isLoading ? (
            <Button
              variant="outline"
              onClick={() => stop()}
              className="bg-background"
            >
              <IconStop className="mr-2" />
              Stop generating
            </Button>
          ) : (
            messages?.length > 0 && (
              <Button
                variant="outline"
                onClick={() => reload()}
                className="bg-background"
              >
                <IconRefresh className="mr-2" />
                Regenerate response
              </Button>
            )
          )}
        </div>
        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptForm
            onSubmit={async value => {
              try {
                await append({
                  id,
                  content: value,
                  role: 'user'
                });
              } catch (error: any) {
                // Handle any errors that might occur during the append operation.
                // toast.error(`Error: Check if your API key is valid. ${error.statusText}`)
                // console.log(`Error is : ${error}`)
              }
            }}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
          />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  )
}
