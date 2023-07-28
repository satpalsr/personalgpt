'use client'
import { SidebarActions } from '@/components/sidebar-actions'
import { SidebarItem } from '@/components/sidebar-item'

import { getAllChatEntries } from '@/utils/localStorage'


export async function SidebarList() {

  const chats = getAllChatEntries()

  return (
    <div className="flex-1 overflow-auto">
      {chats?.length ? (
        <div className="space-y-2 px-2">
          {chats.map(
            chat =>
              chat && (
                <SidebarItem key={chat?.id} chat={chat}>
                  <SidebarActions
                    chatid={chat?.id}
                  />
                </SidebarItem>
              )
          )}
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">No chat history</p>
        </div>
      )}
    </div>
  )
}
