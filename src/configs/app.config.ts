export const appConfig = {
  appName: "小说解说",
  appDescription: "小说解说，让你更轻松地阅读小说",
  appVersion: "0.0.1",
  appAuthor: "Capykyo",
  appAuthorEmail: "capykyo@capyexports.com",
  appAuthorGitHub: "https://github.com/capykyo",
  appDefaultModelConfig: {
    book: {
      model: "deepseek-ai/DeepSeek-R1-Distill-Llama-8B",
      temperature: 1.5,
      systemPrompt:
        "你是一个小说解说员，请根据章节内容，按照时间地点人物发生的事件，生成一段解说，解说内容要简洁明了，不要超过 100 字。",
    },
  },
};
