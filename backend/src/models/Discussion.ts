import mongoose, { Schema, Document } from "mongoose";

interface IComment {
  id: string;
  contentRich: any;
  createdAt: Date;
  discussionId: string;
  isEdited: boolean;
  userId: string;
  updatedAt?: Date;
}

interface IDiscussion extends Document {
  id: string;
  comments: IComment[];
  createdAt: Date;
  isResolved: boolean;
  userId: string;
  documentContent?: string;
  documentId: string;
}

const CommentSchema = new Schema({
  id: { type: String, required: true },
  contentRich: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now },
  discussionId: { type: String, required: true },
  isEdited: { type: Boolean, default: false },
  userId: { type: String, required: true },
  updatedAt: { type: Date },
});

const DiscussionSchema = new Schema({
  id: { type: String, required: true, unique: true },
  comments: [CommentSchema],
  createdAt: { type: Date, default: Date.now },
  isResolved: { type: Boolean, default: false },
  userId: { type: String, required: true },
  documentContent: { type: String },
  documentId: { type: String, required: true },
});

export const Discussion = mongoose.model<IDiscussion>(
  "Discussion",
  DiscussionSchema
);
