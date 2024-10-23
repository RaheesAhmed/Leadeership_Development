import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatOpenAI } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { supabaseClient } from "../lib/supabaseClient.js";
import { Document } from "langchain/document";
import { PromptTemplate } from "@langchain/core/prompts";
import { BufferMemory } from "langchain/memory";
import { LLMChain } from "langchain/chains";
import { readFile } from "fs/promises";

// Function to split documents
export async function splitDocuments(docs) {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  return await textSplitter.splitDocuments(docs);
}

// Function to create and store embeddings in Supabase
export async function createAndStoreEmbeddings(docs) {
  const embeddings = new OpenAIEmbeddings();
  return await SupabaseVectorStore.fromDocuments(docs, embeddings, {
    client: supabaseClient,
    tableName: "documents",
    queryName: "match_documents",
  });
}

// Function to query the vectorstore
export async function queryVectorStore(vectorStore, query) {
  return await vectorStore.similaritySearch(query, 4);
}

// Updated function to generate answer using ChatOpenAI with Prompt Template and Memory
export async function generateAnswer(docs, query, memory) {
  const model = new ChatOpenAI({ model: "gpt-4o-mini", maxTokens: 8000 });
  const custom_instructions = await getCustomInstructions();
  const template = `${custom_instructions}As an AI leadership development expert, your task is to generate the  personalized development plan. 
Use the following information about the participant:


Ensure your response is tailored to the participant's specific role, industry, and responsibility level. 
Maintain a professional yet encouraging tone throughout.
Focus on actionable insights and practical recommendations.

Key guidelines:
1. Personalization: Address the participant by name and reflect their unique profile.
2. Tone and Language: Use clear, encouraging language that motivates engagement.
3. Data Accuracy: Ensure all data from the participant's input and assessment is accurately reflected.
4. Formatting: Use headings, subheadings, bullet points, and numbered lists for readability.
5. Content Generation: Follow the specific guidelines for each section as outlined in the Development Plan structure.
6. Inference and Synthesis: Make reasonable inferences from participant responses to generate meaningful analyses.
7. Resource Recommendation: Suggest appropriate, credible, and relevant resources when applicable.

Your response must strictly adhere to the JSON schema provided for this section. Do not include any content outside of the specified schema structure.
 Use the following pieces of context to answer the question at the end.
  If you don't know the answer, just say that you don't know, don't try to make up an answer.

  Context: {context}

  Previous conversation:
  {chat_history}

  Human: {question}
  AI: `;

  const prompt = PromptTemplate.fromTemplate(template);

  const chain = new LLMChain({
    llm: model,
    prompt: prompt,
    memory: memory,
  });

  const context = docs.map((doc) => doc.pageContent).join("\n\n");

  const result = await chain.call({
    context: context,
    question: query,
  });

  return result.text;
}

// Modified function to process file content and save to Supabase
export async function processFileAndSaveToSupabase(filePath) {
  const content = await readFile(filePath, "utf-8");
  const doc = new Document(
    { pageContent: content },
    { metadata: { source: filePath } }
  );
  const splitDocs = await splitDocuments([doc]);
  return await createAndStoreEmbeddings(splitDocs);
}

// Updated main function to query the RAG system with memory
export async function queryRAGSystem(query, existingMemory = null) {
  const vectorStore = await SupabaseVectorStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    {
      client: supabaseClient,
      tableName: "documents",
      queryName: "match_documents",
    }
  );

  const relevantDocs = await queryVectorStore(vectorStore, query);

  const memory =
    existingMemory ||
    new BufferMemory({
      memoryKey: "chat_history",
      inputKey: "question",
    });

  const custom_instructions = await getCustomInstructions();
  console.log(custom_instructions);
  const answer = await generateAnswer(
    relevantDocs,
    query,
    memory,
    custom_instructions
  );

  return { answer, memory };
}

// New function to start a conversation
export async function startConversation() {
  return new BufferMemory({
    memoryKey: "chat_history",
    inputKey: "question",
  });
}

export async function getCustomInstructions() {
  try {
    const instructions = `You are  AI leadership development expert",
    "task": "Generate personalized development plan",
    "keyGuidelines": 
      
        "name": "Personalization",
        "description": "Address the participant by name and reflect their unique profile"
      
      
        "name": "Tone and Language",
        "description": "Use clear, encouraging language that motivates engagement"
      
        "name": "Data Accuracy",
        "description": "Ensure all data from the participant's input and assessment is accurately reflected"
      
        "name": "Formatting",
        "description": "Use headings, subheadings, bullet points, and numbered lists for readability"
      
        "name": "Content Generation",
        "description": "Follow the specific guidelines for each section as outlined in the Development Plan structure"
      
        "name": "Inference and Synthesis",
        "description": "Make reasonable inferences from participant responses to generate meaningful analyses"
      
        "name": "Resource Recommendation",
        "description": "Suggest appropriate, credible, and relevant resources when applicable"
     
    "participantInfo": 
      "description": "Use the following information about the participant"
    ,
    "responseGuidelines": 
      "Ensure response is tailored to the participant's specific role, industry, and responsibility level",
      "Maintain a professional yet encouraging tone throughout",
      "Focus on actionable insights and practical recommendations"
    ,
    "developmentPlanStructure": 
      "conclusion": {},
      "goalSetting": {},
      "introduction": {},
      "developmentAreas": {},
      "strengthsAnalysis": {},
      "resourceRecommendations": {}
    
  
`;
    return instructions;
  } catch (error) {
    console.error("Error in getCustomInstructions:", error);
    return null;
  }
}
