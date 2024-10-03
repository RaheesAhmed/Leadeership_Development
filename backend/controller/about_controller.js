import { getLevelTwoQuestions, getLevelTwoQuestionsbyLevel } from '../utils/get_all_question.js';
import { createRouter, wrapAsync } from '../lib/routerLib.js';

const handleAbout = async (req, res) => {
    const aboutQuestions = await getLevelTwoQuestions();
    res.json({ aboutQuestions });
}

const handleAboutLevel = async (req, res) => {
    const level = req.params.level;
    const levelTwoQuestions = await getLevelTwoQuestionsbyLevel({ level });
    res.json({ levelTwoQuestions });
}

export { handleAbout, handleAboutLevel };


