import { queueDevPlan } from "../utils/queue.js";
import DevPlan from "../models/DevPlan.js";

export const handleDevPlan = async (req, res) => {
  try {
    const { query, memory } = req.body;
    const job = await queueDevPlan({ query, memory });
    res.json({ jobId: job.id, message: "Development plan generation queued" });
  } catch (error) {
    console.error("Error handling dev plan:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getDevelopmentPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const plan = await DevPlan.findOne({ where: { userId } });

    if (!plan) {
      return res.status(404).json({ message: "No development plan found" });
    }

    res.json(plan);
  } catch (error) {
    console.error("Error fetching development plan:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createDevelopmentPlan = async (req, res) => {
  try {
    let plan = await DevPlan.findOne({ userId: req.user.id });
    if (plan) {
      return res
        .status(400)
        .json({ message: "Development plan already exists" });
    }

    plan = new DevPlan({
      userId: req.user.id,
      formattedPlan: req.body.formattedPlan,
      rawPlan: req.body.rawPlan,
    });

    await plan.save();
    res.status(201).json(plan);
  } catch (error) {
    console.error("Error creating development plan:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateDevelopmentPlan = async (req, res) => {
  try {
    const plan = await DevPlan.findOneAndUpdate(
      { userId: req.user.id },
      { $set: req.body },
      { new: true }
    );
    if (!plan) {
      return res.status(404).json({ message: "Development plan not found" });
    }
    res.json(plan);
  } catch (error) {
    console.error("Error updating development plan:", error);
    res.status(500).json({ message: "Server error" });
  }
};
