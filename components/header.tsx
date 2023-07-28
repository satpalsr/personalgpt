'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import { Sidebar } from '@/components/sidebar'
import { SidebarList } from '@/components/sidebar-list'
import {
  IconGitHub,
  IconNextChat,
  IconSeparator,
  IconVercel
} from '@/components/ui/icons'
import { SidebarFooter } from '@/components/sidebar-footer'
import { ThemeToggle } from '@/components/theme-toggle'
import { ClearHistory } from '@/components/clear-history'
import { UserMenu } from '@/components/user-menu'
import { LoginButton } from '@/components/login-button'

export async function Header() {

  const router = useRouter()

  const handleButtonClicked = () => {
    router.refresh();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">

          <Sidebar>
            <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
              {/* @ts-ignore */}
              <SidebarList  />
            </React.Suspense>
            <SidebarFooter>
              <ThemeToggle />
              <ClearHistory />
            </SidebarFooter>
          </Sidebar>
        

      </div>

      <div className="flex items-center justify-center flex-1">
        <button onClick={handleButtonClicked} className="text-xl font-bold">PersonalGPT</button>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <a
          target="_blank"
          href="https://github.com/satpalsr/personalgpt"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: 'outline' }))}
        >
          <IconGitHub />
          <span className="hidden ml-2 md:flex">GitHub</span>
        </a>
        <a
          href="https://discord.gg/ju4c7eEtF5"
          target="_blank"
          className={cn(buttonVariants())}
        >
          {/* <IconVercel className="mr-2" /> */}
          <span className="hidden sm:block">Discord</span>
          <span className="sm:hidden">Discord</span>
        </a>
      </div>
    </header>
  )
}