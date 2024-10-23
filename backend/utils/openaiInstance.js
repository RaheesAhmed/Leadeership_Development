import axios from "axios";

const OPENAI_API_BASE = "https://api.openai.com/v1";

const createOpenAIInstance = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  return axios.create({
    baseURL: OPENAI_API_BASE,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "OpenAI-Beta": "assistants=v2",
    },
  });
};

export default createOpenAIInstance;
