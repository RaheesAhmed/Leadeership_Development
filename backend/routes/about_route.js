import { createRouter, wrapAsync } from "../lib/routerLib.js";
import {
  handleAbout,
  handleAboutLevel,
} from "../controller/about_controller.js";

const router = createRouter();

router.get("/", handleAbout);

router.post("/:level", handleAboutLevel);

export default router;
