'use client'
import { useEffect, useState } from 'react';
import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

import { useRouter } from 'next/navigation'

const exampleMessages = [
  {
    heading: 'Explain technical concepts',
    message: `What is a "serverless function"?`
  },
  {
    heading: 'Summarize an article',
    message: 'Summarize the following article for a 2nd grader: \n'
  },
  {
    heading: 'Draft an email',
    message: `Draft an email to my boss about the following: \n`
  }
]

import { FaEye, FaEyeSlash } from 'react-icons/fa';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
  } from '@/components/ui/dialog'

import { Input } from '@/components/ui/input'

interface EmptyScreenProps {
  setInput: UseChatHelpers['setInput'];
  selectmodeldialog: boolean;
  setSelectModelDialog: (value: boolean) => void;
  selectedModel: string;
  setSelectedModel: (value: string) => void;
  openaiKey: string;
  setOpenaiKey: (value: string) => void;
  hfToken: string;
  setHfToken: (value: string) => void;
  models: string[];
}


export function EmptyScreen({ setInput, selectmodeldialog, setSelectModelDialog, selectedModel, setSelectedModel, openaiKey, setOpenaiKey, hfToken, setHfToken, models }: EmptyScreenProps) {

  const router = useRouter()

  const handleSaveToken = () => {
    setSelectModelDialog(false);
    router.refresh()
    router.push('/')
  };

  const [showopenaiApiKey, setShowOpenaiApiKey] = useState(false);

  const toggleShowOpenaiApiKey = () => {
    setShowOpenaiApiKey((prevShowOpenaiApiKey) => !prevShowOpenaiApiKey);
  };

  const [showhfapiKey, setShowHfApiKey] = useState(false);

  const toggleShowHfApiKey = () => {
    setShowHfApiKey((prevShowHfApiKey) => !prevShowHfApiKey);
  };

  const handleModelChange = (e: any) => {
    const selectedValue = e.target.value;
    setSelectedModel(selectedValue);
  };

  return (
    <>

      <div className="mx-auto max-w-2xl px-4">
          <div className="rounded-lg border bg-background p-8">
            <h1 className="mb-2 text-lg font-semibold">Welcome to PersonalGPT!</h1>
            <p className="mb-2 leading-normal text-muted-foreground">
              This is an <a className='underline' href="https://github.com/satpalsr/personalgpt">open source</a> AI chatbot app that runs locally in your browser.
            </p>
            <p className="leading-normal text-muted-foreground">
              You can start a conversation here or try the following examples:
            </p>
            <div className="mt-4 flex flex-col items-start space-y-2">
              {exampleMessages.map((message, index) => (
                <Button
                  key={index}
                  variant="link"
                  className="h-auto p-0 text-base"
                  onClick={() => setInput(message.message)}
                >
                  <IconArrowRight className="mr-2 text-muted-foreground" />
                  {message.heading}
                </Button>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              {/* "Select Your Model" button */}
              <Button onClick={() => setSelectModelDialog(true)}>
                Selected Model: {selectedModel}
              </Button>
            </div>
          </div>
        </div>

      <Dialog open={selectmodeldialog} onOpenChange={setSelectModelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select your model</DialogTitle>
          </DialogHeader>
          <DialogDescription>
          {/* Dropdown to select model */}
          <select
            className="mt-1 h-10 w-full px-2 rounded-md focus:ring focus:ring-opacity-50"
            value={selectedModel}
            onChange={(e) => handleModelChange(e)}
          >
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
          </DialogDescription>
          <DialogHeader>
            <DialogTitle>OpenAI Key</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <>
                To obtain openai key{' '}
                <a
                  href="https://platform.openai.com/account/api-keys"
                  className="underline"
                  target='_blank'
                >
                  visit the OpenAI website.
                </a>
                <br/>
                The API key will be saved to your browser&apos;s local storage only.
            <div className="relative">
              <Input
                className="mt-1 pr-10"
                type={showopenaiApiKey ? 'text' : 'password'}
                value={openaiKey}
                placeholder={`OpenAI Key`}
                onChange={(e) => setOpenaiKey(e.target.value)}
              />
              <button
                type="button"
                onClick={toggleShowOpenaiApiKey}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                {showopenaiApiKey ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            </>
          </DialogDescription>
          <DialogHeader>
            <DialogTitle>HF Token (Free)</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <>
            To obtain HF token{' '}
            <a
              href="https://huggingface.co/settings/tokens"
              className="underline"
              target='_blank'
            >
              visit the Huggingface website.
            </a>
            <br/>
            The API key will be saved to your browser&apos;s local storage only.
            <div className="relative">
              <Input
                className="mt-1 pr-10"
                type={showhfapiKey ? 'text' : 'password'}
                value={hfToken}
                placeholder={`HF Token`}
                onChange={(e) => setHfToken(e.target.value)}
              />
              <button
                type="button"
                onClick={toggleShowHfApiKey}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                {showhfapiKey ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            </>
          </DialogDescription>
          <DialogFooter className="items-center">
            <Button onClick={handleSaveToken}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      </>
  )
}
