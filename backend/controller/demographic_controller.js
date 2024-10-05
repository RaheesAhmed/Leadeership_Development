import { readDemographicQuestions } from "../services/dataLoader.js";

const handleDemographic = async (req, res) => {
  const demographicQuestions = await readDemographicQuestions();
  res.json({ demographicQuestions });
};

export { handleDemographic };
