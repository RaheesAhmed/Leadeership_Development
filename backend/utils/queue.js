import Queue from "bull";

const devPlanQueue = new Queue(
  "development plan generation",
  process.env.REDIS_URL
);

export const queueDevPlan = (data) => {
  return devPlanQueue.add(data);
};

devPlanQueue.process(async (job) => {
  try {
    const { projectDetails } = job.data;

    // Import the generateDevelopmentPlan function
    const { generateDevelopmentPlan } = await import(
      "../services/conduct_assesment.js"
    );

    // Generate the development plan
    const developmentPlan = await generateDevelopmentPlan(projectDetails);

    // Update job progress
    job.progress(100);

    // Return the result
    return developmentPlan;
  } catch (error) {
    console.error("Error processing development plan job:", error);
    throw error;
  }
});

export const getJobStatus = async (jobId) => {
  const job = await devPlanQueue.getJob(jobId);
  if (job === null) {
    return { status: "not found" };
  }
  const state = await job.getState();
  const progress = job._progress;
  const result = job.returnvalue;
  return { jobId, state, progress, result };
};
