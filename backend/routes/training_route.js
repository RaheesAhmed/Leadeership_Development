import multer from 'multer';
import { createRouter, wrapAsync } from '../lib/routerLib.js';
import { handleTraining } from '../controller/training_controller.js';
const router = createRouter();
const upload = multer();

router.post("/upload", upload.single("file"), handleTraining);

export default router;
