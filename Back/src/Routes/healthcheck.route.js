import { Router } from "express";
import { healthcheck } from "../Controllers/healthckeck.controller.js";

const router = Router();
router.route("/").get(healthcheck);

export default router;