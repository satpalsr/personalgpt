// Create a list of models to choose from and export it from components/models.tsx

export const openaiModels = ['OpenAI/gpt-3.5-turbo', 'OpenAI/gpt-4']
export const hfModels = ['HF/OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5']
// , 'EleutherAI/gpt-neox-20b', 'google/flan-ul2', 'google/flan-t5-xxl', 'bigscience/bloomz', 'bigscience/bloom', 'bigcode/santacoder'
export const models = [...openaiModels, ...hfModels]