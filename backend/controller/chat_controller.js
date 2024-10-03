import { queryRAGSystem } from '../utils/rag.js';
const handleChat = async (req, res) => {
    const { query, memory, chatType} = req.body;
    const response = await queryRAGSystem(query, memory, chatType);
    const cleanrespone=response.answer;
    res.json({ response:cleanrespone, memory:response.memory });
}


export  {handleChat};
