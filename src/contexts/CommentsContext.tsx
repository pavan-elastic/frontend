"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { type TDiscussion } from "@/components/plate-ui/block-discussion";
import { ycomments } from "@/lib/yjs";
import * as Y from "yjs";

interface CommentsContextType {
  discussions: TDiscussion[];
  updateDiscussion: (discussion: TDiscussion) => void;
  removeDiscussion: (id: string) => void;
  addDiscussion: (discussion: TDiscussion) => void;
}

const CommentsContext = createContext<CommentsContextType | undefined>(
  undefined
);

export function CommentsProvider({ children }: { children: React.ReactNode }) {
  const [discussions, setDiscussions] = useState<TDiscussion[]>([]);

  useEffect(() => {
    // Initialize discussions from Yjs
    let ydiscussions = ycomments.get("discussions") as Y.Array<TDiscussion>;
    if (!ydiscussions) {
      ydiscussions = new Y.Array<TDiscussion>();
      ycomments.set("discussions", ydiscussions);
    }

    // Initialize state
    const initialDiscussions = Array.from(ydiscussions) as TDiscussion[];
    setDiscussions(initialDiscussions);

    // Subscribe to changes
    const observer = (event: Y.YEvent) => {
      const updatedDiscussions = Array.from(ydiscussions) as TDiscussion[];
      setDiscussions(updatedDiscussions);
    };

    ycomments.observe(observer);
    return () => ycomments.unobserve(observer);
  }, []);

  const updateDiscussion = (discussion: TDiscussion) => {
    const ydiscussions = ycomments.get("discussions") as Y.Array<TDiscussion>;
    const index = Array.from(ydiscussions).findIndex(
      (d: TDiscussion) => d.id === discussion.id
    );
    if (index !== -1) {
      ydiscussions.delete(index, 1);
      ydiscussions.insert(index, [discussion]);
    }
  };

  const removeDiscussion = (id: string) => {
    const ydiscussions = ycomments.get("discussions") as Y.Array<TDiscussion>;
    const index = Array.from(ydiscussions).findIndex(
      (d: TDiscussion) => d.id === id
    );
    if (index !== -1) {
      ydiscussions.delete(index, 1);
    }
  };

  const addDiscussion = (discussion: TDiscussion) => {
    const ydiscussions = ycomments.get("discussions") as Y.Array<TDiscussion>;
    ydiscussions.push([discussion]);
  };

  return (
    <CommentsContext.Provider
      value={{ discussions, updateDiscussion, removeDiscussion, addDiscussion }}
    >
      {children}
    </CommentsContext.Provider>
  );
}

export function useComments() {
  const context = useContext(CommentsContext);
  if (context === undefined) {
    throw new Error("useComments must be used within a CommentsProvider");
  }
  return context;
}
