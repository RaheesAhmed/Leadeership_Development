import { supabaseClient } from "../lib/supabaseClient.js";
import askQuestions from "../data/ask_questions.json" assert { type: "json" };
import framework from "../data/framework.json" assert { type: "json" };
import logger from "../utils/logger.js";

export const importQuestionsData = async () => {
  try {
    // Transform ask_questions.json data
    const questionsData = askQuestions.map((q) => ({
      level: q.Lvl,
      role_name: q["Role Name"].trim(),
      description: q.Description.trim(),
      building_team_skill: q["Building a Team (Skill)"],
      building_team_confidence: q["Building a Team (Confidence)"],
      developing_others_skill: q["Developing Others (Skill)"],
      developing_others_confidence: q["Developing Others (Confidence)"],
      leading_team_skill: q["Leading a Team to Get Results (Skill)"],
      leading_team_confidence: q["Leading a Team to Get Results (Confidence)"],
      managing_performance_skill: q["Managing Performance (Skill)"],
      managing_performance_confidence: q["Managing Performance (Confidence)"],
      business_acumen_skill:
        q["Managing the Business (Business Acumen) (Skill)"],
      business_acumen_confidence:
        q["Managing the Business (Business Acumen) (Confidence)"],
      personal_development_skill: q["Personal Development (Skill)"],
      personal_development_confidence: q["Personal Development (Confidence)"],
      communication_skill: q["Communicating as a Leader(skills)"],
      communication_confidence: q["Communicating as a Leader (Confidence)"],
      employee_relations_skill:
        q["Creating the Environment (Employee Relations) (Skill)"],
      employee_relations_confidence:
        q["Creating the Environment (Employee Relations) (Confidence)"],
    }));

    // Transform framework.json data
    const frameworkData = framework
      .filter((f) => f["Target Audience"]) // Remove empty entries
      .map((f) => ({
        target_audience: f["Target Audience"].trim(),
        building_team: f["Building a team"],
        developing_others: f["Developing Others"],
        leading_team: f["Leading a team to get results"],
        managing_performance: f["Managing Performance"],
        business_acumen: f["Managing the business \r\n(Business Acumen)"],
        personal_development: f["Personal Development"],
        communication: f["Communicating as a Leader"],
        employee_relations:
          f["Creating the environment \r\n(Employee relations)"],
      }));

    // Insert questions data
    const { error: questionsError } = await supabaseClient
      .from("assessment_questions")
      .upsert(questionsData, {
        onConflict: "level",
        ignoreDuplicates: false,
      });

    if (questionsError) {
      throw new Error(
        `Error inserting questions data: ${questionsError.message}`
      );
    }

    // Insert framework data
    const { error: frameworkError } = await supabaseClient
      .from("assessment_framework")
      .upsert(frameworkData, {
        onConflict: "target_audience",
        ignoreDuplicates: false,
      });

    if (frameworkError) {
      throw new Error(
        `Error inserting framework data: ${frameworkError.message}`
      );
    }

    logger.info("Successfully imported assessment data to Supabase");
    return { success: true, message: "Data import completed successfully" };
  } catch (error) {
    logger.error("Error importing data:", error);
    throw error;
  }
};
