// import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse, HuggingFaceStream } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'
import { HfInference, HfInferenceEndpoint } from '@huggingface/inference'
import { experimental_buildOpenAssistantPrompt, experimental_buildLlama2Prompt } from 'ai/prompts'
import { whoAmI } from "@huggingface/hub";

import { nanoid } from '@/lib/utils'
import { cp } from 'fs'
import { hfModels } from '@/components/models'

export const runtime = 'edge'

export async function POST(req: Request) {
  const json = await req.json()
  let { messages, apiKey, selectedModel } = json


  if (hfModels.includes(selectedModel)) {

    // selectedModel = selectedModel.substring('HF/'.length);
    selectedModel = selectedModel.substring(3);

    let messagesWrapper = experimental_buildOpenAssistantPrompt
    let Hf;

    if (selectedModel.includes('llama')) {
      
      messagesWrapper = experimental_buildLlama2Prompt
      const endpointUrl = `https://api-inference.huggingface.co/models/${selectedModel}`
      Hf = new HfInferenceEndpoint(endpointUrl, process.env.HUGGINGFACE_API_KEY)

    } else {

    
      Hf = new HfInference(apiKey)

      try {

        const info = await whoAmI({credentials: {accessToken: process.env.HUGGINGFACE_TOKEN!}});
      } catch (error) {
        return new Response('Invalid HF Token',{ status: 401, statusText: 'Invalid HF Token',});
      }

    }



  const response = await Hf.textGenerationStream({
    model: selectedModel,
    inputs: messagesWrapper(messages),
    parameters: {
      // max_new_tokens: 200,
      // @ts-ignore (this is a valid parameter specifically in OpenAssistant models)
      typical_p: 0.2,
      repetition_penalty: 1,
      truncate: 1000,
      return_full_text: false
    }
  })

  const stream = HuggingFaceStream(response)
  return new StreamingTextResponse(stream)

  }

  // selectedModel = selectedModel.substring('OPENAI/'.length)
  selectedModel = selectedModel.substring(7)

  let configuration;

  if (apiKey) {
    configuration = new Configuration({
      apiKey: apiKey
    })

  } else {
    configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY ?? ''
    })

  }

  if (!selectedModel) {
    selectedModel = 'gpt-3.5-turbo'
  }

  let res;

  try {

    const openai = new OpenAIApi(configuration)

    res = await openai.createChatCompletion({
      model: selectedModel,
      messages,
      temperature: 0.7,
      stream: true
    })

  } catch (error: any) {

    if (error.response && error.response.status === 401) {
      return new Response('Invalid api key',{ status: 401, statusText: 'Invalid api Key',});
    }

    return new Response('Error generating response', {status: 400, statusText: 'Error generating response'})

  }

  if (!res) {
    return new Response('Failed generating response. Try again.', {status: 400, statusText: 'Failed generating response. Try again.'})
  }

  if (res.status == 401) {
    return new Response('Invalid api key',{ status: 401, statusText: 'Invalid api Key',});
  }

  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      const title = json.messages[0].content.substring(0, 100)
      const id = json.id ?? nanoid()
      const createdAt = Date.now()
      const path = `/chat/${id}`
      const payload = {
        id,
        title,
        // userId,
        createdAt,
        path,
        messages: [
          ...messages,
          {
            content: completion,
            role: 'assistant'
          }
        ]
      }
    }
  })

  return new StreamingTextResponse(stream)
}
