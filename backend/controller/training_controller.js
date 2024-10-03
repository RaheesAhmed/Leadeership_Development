import os from 'os';
import path from 'path';
import { writeFile, unlink } from 'fs/promises';
import { processFileAndSaveToSupabase } from '../utils/rag.js';



const handleTraining = async (req, res) => {
    const { file } = req;
    const filePath = path.join(os.tmpdir(), file.originalname);
    await writeFile(filePath, file.buffer);
    const response = await processFileAndSaveToSupabase(filePath);
    unlink(filePath);
    res.json({ response });
}

export { handleTraining };
