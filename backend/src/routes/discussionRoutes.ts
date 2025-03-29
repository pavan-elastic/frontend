import express from "express";
import { discussionController } from "../controllers/discussionController";

const router = express.Router();

router.get("/", discussionController.getDiscussions);
router.post("/", discussionController.saveDiscussions);
router.get("/:id", discussionController.getDiscussion);
router.patch("/:id", discussionController.updateDiscussion);
router.delete("/:id", discussionController.deleteDiscussion);

export default router;
