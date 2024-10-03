import { queueDevPlan, getJobStatus } from '../utils/queue.js';

export const handleDevPlan = async (req, res) => {
    const { query, memory } = req.body;
    const job = await queueDevPlan({ query, memory });
    res.json({ jobId: job.id, message: 'Development plan generation queued' });
};

export const handleDevPlanStatus = async (req, res) => {
    const { jobId } = req.params;
    const status = await getJobStatus(jobId);
    res.json(status);
};

