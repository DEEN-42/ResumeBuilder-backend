import express from "express";
import { handleDeploy } from "../Controllers/deployController.js";
import authMiddleware from "../middleware/AuthenticationMIddleware.js";

const router = express.Router();

router.post("/:id", authMiddleware, handleDeploy);

export default router;
