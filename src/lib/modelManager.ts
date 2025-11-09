import { OpenAI } from "openai";

class Client extends OpenAI {
  private static instance: Client;

  // 允许直接使用 new Client(apiKey) 创建实例
  constructor(apiKey?: string) {
    super({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
  }

  public static getInstance(apiKey?: string): Client {
    // 如果提供了 API Key，创建新实例；否则使用单例
    if (apiKey) {
      return new Client(apiKey);
    }
    if (!Client.instance) {
      Client.instance = new Client();
    }
    return Client.instance;
  }

  public async createChatCompletion(
    options: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming
  ): Promise<string> {
    const response = await this.chat.completions.create(options);
    return response.choices[0].message.content || "";
  }

  public streamChatCompletion() {
    return this.beta.chat.completions.stream;
  }
}

export default Client;
