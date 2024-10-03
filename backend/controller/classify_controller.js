import { demographicSchema } from '../utils/validationSchemas.js';
import { classifyResponsibilityLevel } from '../utils/classification.js';

const handleClassify = async (req, res) => {
    const demographicInfo = req.body;
    const { error } = demographicSchema.validate(demographicInfo);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    console.log("Received demographic info:", demographicInfo);
    const responsibilityLevel = await classifyResponsibilityLevel(demographicInfo);
    res.json({ responsibilityLevel });
}

export { handleClassify };


