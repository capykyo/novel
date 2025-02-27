import { ChatOpenAIFields, ClientOptions } from "@langchain/openai";

type OpenAIFields = {
  model: string;
  temperature?: number;
  clientConfig: ClientOptions;
};

export const langChainModelConfigs: ChatOpenAIFields[] = [
  {
    model: "deepseek-ai/DeepSeek-R1-Distill-Llama-8B",
    temperature: 1,
    // maxTokens: 2000,
    // topP: 1,
    // frequencyPenalty: 0,
    // presencePenalty: 0,
    configuration: {
      baseURL: "https://api.siliconflow.cn/v1/",
    },
  },
  {
    model: "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",
    temperature: 1,
    configuration: {
      baseURL: "https://api.siliconflow.cn/v1/",
    },
  },
  {
    model: "internlm/internlm2_5-7b-chat",
    temperature: 1,
    configuration: {
      baseURL: "https://api.siliconflow.cn/v1/",
    },
  },
  // 添加更多模型...
];

// export const openaiModelConfigs: OpenAIFields[] = [
//   {
//     model: "internlm/internlm2_5-7b-chat",
//     baseURL: "https://api.siliconflow.cn/v1/",
//   },
// ];
