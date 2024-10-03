import Queue from 'bull';

const devPlanQueue = new Queue('development plan generation', process.env.REDIS_URL);

export const queueDevPlan = (data) => {
  return devPlanQueue.add(data);
};

devPlanQueue.process(async (job) => {
  // Process the job here
  // This is where you'd call your generateDevelopmentPlan function
  // Return the result
});

export const getJobStatus = async (jobId) => {
  const job = await devPlanQueue.getJob(jobId);
  if (job === null) {
    return { status: 'not found' };
  }
  const state = await job.getState();
  const progress = job._progress;
  const result = job.returnvalue;
  return { jobId, state, progress, result };
};