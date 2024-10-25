import { importQuestionsData } from "../services/dataImport.js";
import logger from "../utils/logger.js";

export const handleDataImport = async (req, res) => {
  try {
    const result = await importQuestionsData();
    res.json(result);
  } catch (error) {
    logger.error("Error in handleDataImport:", error);
    res.status(500).json({ error: error.message });
  }
};
