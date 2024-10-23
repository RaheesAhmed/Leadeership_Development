import { supabaseClient } from "../lib/supabaseClient.js";

export const getDashboardData = async () => {
  // Fetch total number of assessments
  const { count: totalAssessments, error: assessmentError } =
    await supabaseClient
      .from("assessments")
      .select("*", { count: "exact", head: true });

  if (assessmentError) throw new Error("Error fetching total assessments");

  // Fetch total number of users
  const { count: totalUsers, error: userError } = await supabaseClient
    .from("users")
    .select("*", { count: "exact", head: true });

  if (userError) throw new Error("Error fetching total users");

  // Fetch average ratings for each capability
  const { data: averageRatings, error: ratingError } = await supabaseClient
    .from("ratings")
    .select("capability, rating")
    .then((result) => {
      if (result.error) throw result.error;
      return result.data.reduce((acc, curr) => {
        if (!acc[curr.capability]) {
          acc[curr.capability] = { sum: 0, count: 0 };
        }
        acc[curr.capability].sum += curr.rating;
        acc[curr.capability].count += 1;
        return acc;
      }, {});
    })
    .then((aggregated) =>
      Object.entries(aggregated).map(([capability, { sum, count }]) => ({
        capability,
        averageRating: sum / count,
      }))
    );

  if (ratingError) throw new Error("Error fetching average ratings");

  // Fetch recent assessments
  const { data: recentAssessments, error: recentError } = await supabaseClient
    .from("assessments")
    .select("id, created_at, user:users(name)")
    .order("created_at", { ascending: false })
    .limit(10);

  if (recentError) throw new Error("Error fetching recent assessments");

  return {
    totalAssessments,
    totalUsers,
    averageRatings,
    recentAssessments,
  };
};
