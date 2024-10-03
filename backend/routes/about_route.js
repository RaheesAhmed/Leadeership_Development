import { getLevelTwoQuestions, getLevelTwoQuestionsbyLevel } from '../utils/get_all_question.js';
import { createRouter, wrapAsync } from '../lib/routerLib.js';

const router = createRouter();

router.get("/", wrapAsync(async (req, res) => {
    const aboutQuestions = await getLevelTwoQuestions();
    res.json({ aboutQuestions });
}));

router.post("/:level", wrapAsync(async (req, res) => {
    const level = req.params.level;
    const levelTwoQuestions = await getLevelTwoQuestionsbyLevel({ level });
    res.json({ levelTwoQuestions });
}));

export default router;
