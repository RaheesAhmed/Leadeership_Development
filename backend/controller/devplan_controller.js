import { generateDevelopmentPlan } from '../utils/conduct_assesment.js';

const handleDevPlan = async (req, res) => {
    const { query, memory } = req.body;
    const response = await generateDevelopmentPlan(query, memory);
    res.json({ response });
}

export { handleDevPlan };

