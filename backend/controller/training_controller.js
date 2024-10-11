import os from "os";
import path from "path";
import { writeFile, unlink } from "fs/promises";
import { processFileAndSaveToSupabase } from "../services/rag.js";

const handleTraining = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { originalname, buffer } = req.file;
    const tempFilePath = path.join(os.tmpdir(), originalname);

    await writeFile(tempFilePath, buffer);

    const response = await processFileAndSaveToSupabase(tempFilePath);

    await unlink(tempFilePath);

    res.json({ message: "File processed successfully", response });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { handleTraining };
