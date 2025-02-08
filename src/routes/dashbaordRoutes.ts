import { Router } from "express";
import { getDashboardMetrics } from "../controllers/dashbaordController";

const router = Router();

router.get("/", getDashboardMetrics);

export default router;
