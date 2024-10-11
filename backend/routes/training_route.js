import multer from "multer";
import { createRouter, wrapAsync } from "../lib/routerLib.js";
import { handleTraining } from "../controller/training_controller.js";

const router = createRouter();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), wrapAsync(handleTraining));

export default router;
