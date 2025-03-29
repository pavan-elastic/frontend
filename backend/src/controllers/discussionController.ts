import { Request, Response } from "express";
import { Discussion } from "../models/Discussion";

export const discussionController = {
  // Get all discussions for a document
  getDiscussions: async (req: Request, res: Response) => {
    try {
      const { documentId } = req.query;

      if (!documentId || typeof documentId !== "string") {
        return res.status(400).json({ error: "Valid documentId is required" });
      }

      const discussions = await Discussion.find({ documentId });
      res.json(discussions);
    } catch (error) {
      console.error("Error fetching discussions:", error);
      res.status(500).json({ error: "Failed to fetch discussions" });
    }
  },

  // Save discussions
  saveDiscussions: async (req: Request, res: Response) => {
    try {
      const { discussions, documentId } = req.body;

      if (!documentId || !Array.isArray(discussions)) {
        return res
          .status(400)
          .json({
            error: "Valid documentId and discussions array are required",
          });
      }

      // Use bulkWrite for better performance
      const operations = discussions.map((discussion) => ({
        updateOne: {
          filter: { id: discussion.id, documentId },
          update: { $set: discussion },
          upsert: true,
        },
      }));

      await Discussion.bulkWrite(operations);
      res.json({ success: true });
    } catch (error) {
      console.error("Error saving discussions:", error);
      res.status(500).json({ error: "Failed to save discussions" });
    }
  },

  // Get single discussion
  getDiscussion: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const discussion = await Discussion.findOne({ id });

      if (!discussion) {
        return res.status(404).json({ error: "Discussion not found" });
      }

      res.json({ discussion });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch discussion" });
    }
  },

  // Update single discussion
  updateDiscussion: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const discussion = await Discussion.findOneAndUpdate(
        { id },
        { $set: updates },
        { new: true }
      );

      if (!discussion) {
        return res.status(404).json({ error: "Discussion not found" });
      }

      res.json({ discussion });
    } catch (error) {
      res.status(500).json({ error: "Failed to update discussion" });
    }
  },

  // Delete single discussion
  deleteDiscussion: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const discussion = await Discussion.findOneAndDelete({ id });

      if (!discussion) {
        return res.status(404).json({ error: "Discussion not found" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete discussion" });
    }
  },
};
