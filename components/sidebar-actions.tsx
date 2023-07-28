'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'


import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

import {
  IconShare,
  IconSpinner,
  IconTrash,
  IconUsers
} from '@/components/ui/icons'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'

import { deleteChat } from '@/utils/localStorage'

interface SidebarActionsProps {
  chatid: string
}

export function SidebarActions({ chatid }: SidebarActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [isRemovePending, startRemoveTransition] = React.useTransition()

  const router = useRouter()

  return (
    <>
      <div className="space-x-1">

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-background"
              disabled={isRemovePending}
              onClick={() => setDeleteDialogOpen(true)}
            >
              <IconTrash />
              <span className="sr-only">Delete</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete chat</TooltipContent>
        </Tooltip>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your chat message and remove your
              data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemovePending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isRemovePending}
              onClick={event => {
                event.preventDefault()
                startRemoveTransition(async () => {

                  try {
                    const result = deleteChat(chatid)
            
                    if ('error' in result) {
                        toast.error(JSON.stringify(result.error));
                        return;
                    }
            
                    // toast.success('Chat data cleared successfully.');
                  } catch (error) {
                      // console.error('An unexpected error occurred:', error);
                      toast.error('An unexpected error occurred. Please try again later.');
                  }
  

                  setDeleteDialogOpen(false)
                  router.refresh()
                  router.push('/')
                  toast.success('Chat deleted')
                })
              }}
            >
              {isRemovePending && <IconSpinner className="mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
