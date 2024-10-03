import { createRouter } from '../lib/routerLib.js';
import { handleChat } from '../controller/chat_controller.js';


const router = createRouter();

router.post('/', handleChat);

export default router;
