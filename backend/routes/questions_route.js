import { handleQuestionsbyLevel, handleAllQuestions } from '../controller/questions_controller.js';
import { createRouter, wrapAsync } from '../lib/routerLib.js';

const router = createRouter();

router.get("/", handleAllQuestions);

router.post("/:level", handleQuestionsbyLevel);
   

export default router;
