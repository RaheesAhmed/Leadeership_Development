import Joi from "joi";

export const demographicValidationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  jobTitle: Joi.string().required(),
  department: Joi.string().required(),
  companySize: Joi.string().required(),
  industry: Joi.string().required(),
  levelsToCEO: Joi.string().required(),
  directReports: Joi.string().required(),
  decisionLevel: Joi.string()
    .valid("strategic", "tactical", "operational")
    .required(),
  managesBudget: Joi.boolean().required(),
  typicalProject: Joi.string().required(),
});

export const assessmentValidationSchema = Joi.object({
  userId: Joi.string().required(),
  answers: Joi.array()
    .items(
      Joi.object({
        questionId: Joi.string().required(),
        rating: Joi.number().min(1).max(5).required(),
        category: Joi.string().required(),
      })
    )
    .required(),
});
