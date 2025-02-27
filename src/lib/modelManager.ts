// 在服务端执行，所以不需要配置apiKey和baseURL
import { OpenAI } from "openai";

class Client extends OpenAI {
  private static instance: Client;

  private constructor() {
    super();
  }

  public static getInstance(): Client {
    if (!Client.instance) {
      Client.instance = new Client();
    }
    return Client.instance;
  }

  public async createChatCompletion(
    options: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming
  ): Promise<string> {
    const response = await Client.instance.chat.completions.create(options);
    return response.choices[0].message.content || "";
  }

  public streamChatCompletion() {
    return Client.instance.beta.chat.completions.stream;
  }
}

export default Client;
