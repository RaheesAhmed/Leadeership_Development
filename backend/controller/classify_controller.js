import { demographicSchema } from "../services/validationSchemas.js";
import { classifyResponsibilityLevel } from "../services/classification.js";
import logger from "../utils/logger.js";

const handleClassify = async (req, res) => {
  const demographicInfo = req.body;
  logger.info("Received demographic info:", demographicInfo);

  try {
    const { error, value } = demographicSchema.validate(demographicInfo, {
      abortEarly: false,
    });
    if (error) {
      logger.error("Validation error:", error.details);
      return res
        .status(400)
        .json({ error: error.details.map((detail) => detail.message) });
    }

    // Convert string values to numbers where necessary
    const processedInfo = {
      ...value,
      companySize: parseInt(value.companySize, 10),
      directReports: parseInt(value.directReports, 10),
      levelsToCEO: parseInt(value.levelsToCEO, 10),
    };

    const responsibilityLevel = await classifyResponsibilityLevel(
      processedInfo
    );
    logger.info("Classified responsibility level:", responsibilityLevel);
    res.json({ responsibilityLevel });
  } catch (error) {
    logger.error("Error classifying responsibility level:", error);
    res
      .status(500)
      .json({
        error: error.message || "Failed to classify responsibility level",
      });
  }
};

export { handleClassify };
