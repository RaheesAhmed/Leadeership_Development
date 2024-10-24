import Joi from "joi";

export const demographicSchema = Joi.object({
  name: Joi.string().required(),
  industry: Joi.string().required(),
  companySize: Joi.string().required(),
  department: Joi.string().required(),
  jobTitle: Joi.string().required(),
  directReports: Joi.string().required(),
  directReportRoles: Joi.string().allow(""),
  decisionLevel: Joi.string().required(),
  typicalProject: Joi.string().allow(""),
  levelsToCEO: Joi.string().required(),
  managesBudget: Joi.boolean().required(),
  managesBudget_additional: Joi.string().allow(""),
});
