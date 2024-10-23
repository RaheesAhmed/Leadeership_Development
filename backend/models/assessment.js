import { supabaseClient } from "../lib/supabaseClient.js";

export const createAssessment = async (userId, assessmentData) => {
  const { data, error } = await supabaseClient
    .from("assessments")
    .insert({ user_id: userId, ...assessmentData })
    .select();

  if (error) throw error;
  return data[0];
};

export const addRating = async (assessmentId, raterData) => {
  const { data, error } = await supabaseClient
    .from("ratings")
    .insert({ assessment_id: assessmentId, ...raterData })
    .select();

  if (error) throw error;
  return data[0];
};

export const getAssessmentWithRatings = async (assessmentId) => {
  const { data, error } = await supabaseClient
    .from("assessments")
    .select(
      `
      *,
      ratings (*)
    `
    )
    .eq("id", assessmentId)
    .single();

  if (error) throw error;
  return data;
};
