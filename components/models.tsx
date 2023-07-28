// Create a list of models to choose from and export it from components/models.tsx

export const openaiModels = ['OpenAI/gpt-3.5-turbo', 'OpenAI/gpt-3.5-turbo-16k', 'OpenAI/gpt-3.5-turbo-16k-0613', 'OpenAI/gpt-4', 'OpenAI/gpt-4-0613']
export const hfModels = ['HF/meta-llama/Llama-2-70b-chat-hf', 'HF/meta-llama/Llama-2-13b-chat-hf', 'HF/meta-llama/Llama-2-7b-chat-hf', 'HF/OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5', 'HF/OpenAssistant/oasst-sft-1-pythia-12b']
// , 'EleutherAI/gpt-neox-20b', 'google/flan-ul2', 'google/flan-t5-xxl', 'bigscience/bloomz', 'bigscience/bloom', 'bigcode/santacoder'
export const models = [...hfModels, ...openaiModels]