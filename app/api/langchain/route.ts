
import { LangChainStream, StreamingTextResponse } from 'ai'
import { ChatOpenAI } from 'langchain/chat_models/openai'

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
import { ConversationalRetrievalQAChain } from "langchain/chains";


export const runtime = 'edge'

export async function POST(req: Request) {

    const json = await req.json()
    let { messages, apiKey, selectedModel, contextText } = json

    if (!contextText) {
        contextText = ''
    }

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

}