export interface TComment {
  id: string;
  contentRich: any;
  createdAt: Date;
  discussionId: string;
  isEdited: boolean;
  userId: string;
  updatedAt?: Date;
}

export interface TDiscussion {
  id: string;
  comments: TComment[];
  createdAt: Date;
  isResolved: boolean;
  userId: string;
  documentContent?: string;
  documentId: string;
}
