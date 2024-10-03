import Joi from "joi";

export const demographicSchema = Joi.object({
  name: Joi.string().required(),
  industry: Joi.string().required(),
  companySize: Joi.number().integer().min(1).required(),
  department: Joi.string().required(),
  jobTitle: Joi.string().required(),
  directReports: Joi.number().integer().min(0).required(),
  reportingRoles: Joi.string().allow(''),
  decisionLevel: Joi.string().valid("Operational", "Tactical", "Strategic").required(),
  typicalProject: Joi.string().allow(''),
  levelsToCEO: Joi.number().integer().min(0).required(),
  managesBudget: Joi.boolean().required(),
});
