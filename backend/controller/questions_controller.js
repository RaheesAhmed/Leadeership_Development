import {
  getLevelOneQuestions,
  getLevelOneQuestionsbyLevel,
} from "../services/get_all_question.js";

const handleQuestionsbyLevel = async (req, res) => {
  const level = req.params.level;
  console.log("level recieved", level);
  const levelOneQuestions = await getLevelOneQuestionsbyLevel({ level });
  res.json({ levelOneQuestions });
};

const handleAllQuestions = async (req, res) => {
  const levelOneQuestions = await getLevelOneQuestions();
  res.json({ assessmentQuestions: levelOneQuestions });
};

export { handleQuestionsbyLevel, handleAllQuestions };
