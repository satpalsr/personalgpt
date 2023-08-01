// import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse, HuggingFaceStream, LangChainStream, Message } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'
import { HfInference, HfInferenceEndpoint } from '@huggingface/inference'
import { experimental_buildOpenAssistantPrompt, experimental_buildLlama2Prompt } from 'ai/prompts'
import { whoAmI } from "@huggingface/hub";

import { nanoid } from '@/lib/utils'
import { cp } from 'fs'
import { hfModels } from '@/components/models'

import { ChatOpenAI } from 'langchain/chat_models/openai'
import { AIMessage, HumanMessage } from 'langchain/schema'

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
import { ConversationalRetrievalQAChain } from "langchain/chains";

export const runtime = 'edge'

export async function POST(req: Request) {

  const json = await req.json()
  let { messages, apiKey, selectedModel, contextText } = json

  if (contextText) {
    // Youtube Search

    // console.log(`context_text: ${contextText} for messages ${JSON.stringify(messages)}`)

    const { stream, handlers } = LangChainStream()

    selectedModel = 'gpt-3.5-turbo'
  
    const llm = new ChatOpenAI({
      modelName: selectedModel,
      openAIApiKey: apiKey,
      streaming: true,
    })

    let embeddings = new OpenAIEmbeddings({openAIApiKey: apiKey});
    const vectorStore = new MemoryVectorStore(embeddings, {});

    const splitter = new RecursiveCharacterTextSplitter({chunkSize: 2000, chunkOverlap: 0});

    const docs = await splitter.splitDocuments([
        new Document({ pageContent: contextText }),
    ])

    const texts = docs.map(({ pageContent }) => pageContent);
    const MemoryInst = new MemoryVectorStore(embeddings, {});
    const vectors = await MemoryInst.embeddings.embedDocuments(texts);
    
    await vectorStore.addVectors(vectors, docs)

    const chain = ConversationalRetrievalQAChain.fromLLM(
      llm,
      vectorStore.asRetriever(),
    );

    const question = messages[0]['content']

    chain.call({ question, chat_history: [] }, [handlers]);

    return new StreamingTextResponse(stream)

  } else {
    // Normal Flow

    if (hfModels.includes(selectedModel)) {
      // HF MODELS

      // selectedModel = selectedModel.substring('HF/'.length);
      selectedModel = selectedModel.substring(3);

      let messagesWrapper = experimental_buildOpenAssistantPrompt
      let Hf;
      let max_new_tokens = 1000

      if (selectedModel.includes('meta-llama')) {

        max_new_tokens = 4000
        
        messagesWrapper = experimental_buildLlama2Prompt
        const endpointUrl = `https://api-inference.huggingface.co/models/${selectedModel}`
        Hf = new HfInferenceEndpoint(endpointUrl, process.env.HUGGINGFACE_API_KEY)

      } else {
      
        Hf = new HfInference(apiKey)

        try {

          const info = await whoAmI({credentials: {accessToken: apiKey}});
        } catch (error) {
          return new Response('Invalid HF Token',{ status: 401, statusText: 'Invalid HF Token',});
        }

      }



      const response = await Hf.textGenerationStream({
        model: selectedModel,
        inputs: messagesWrapper(messages),
        parameters: {
          max_new_tokens: max_new_tokens,
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
  else {
    // OPENAI MODELS

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
  }
}
