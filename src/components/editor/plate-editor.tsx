"use client";

import React, { useEffect, useState, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Plate } from "@udecode/plate/react";
import { useCreateEditor } from "@/components/editor/use-create-editor";
import { Editor, EditorContainer } from "@/components/plate-ui/editor";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

export function PlateEditor({ docId }: { docId: string | undefined }) {
  const editor = useCreateEditor({ docId });
  const [isConnected, setIsConnected] = useState(false);
  const wsProviderRef = useRef<WebsocketProvider | null>(null);
  const yDocRef = useRef<Y.Doc | null>(null);
  const [comments, setComments] = useState<string[]>([]);

  useEffect(() => {
    if (!docId) {
      console.error("❌ Missing docId! WebSocket connection will fail.");
      return;
    }

    console.log("🔗 Connecting to Hocuspocus with docId:", docId);

    const yDoc = new Y.Doc();
    yDocRef.current = yDoc;
    const wsProvider = new WebsocketProvider(
      "ws://localhost:4000", // ✅ Make sure this matches the backend WebSocket
      docId,
      yDoc
    );

    wsProviderRef.current = wsProvider;

    wsProvider.on("status", ({ status }) => {
      console.log("🔄 WebSocket status:", status);
      setIsConnected(status === "connected");
    });

    wsProvider.on("sync", (isSynced) => {
      console.log("📡 Sync status:", isSynced ? "Synced" : "Not Synced");
    });

    wsProvider.on("connection-error", (error) => {
      console.error("❌ WebSocket connection error:", error);
    });

    return () => {
      console.log("🔌 Disconnecting WebSocket provider...");
      wsProvider.disconnect();
      yDoc.destroy();
    };
  }, [docId]);

  const saveDocument = async () => {
    if (!yDocRef.current) return;
    const content = JSON.stringify(yDocRef.current.toJSON());

    try {
      const response = await fetch(
        `http://localhost:5000/api/documents/${docId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, comments }),
        }
      );

      if (!response.ok) throw new Error("❌ Failed to save document");

      console.log("✅ Document saved successfully.");
    } catch (error) {
      console.error("❌ Error saving document:", error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="relative">
        {/* ✅ WebSocket status indicator */}
        <div
          className={`absolute top-2 right-2 px-2 py-1 rounded text-sm ${
            isConnected
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {isConnected ? "Connected" : "Disconnected"}
        </div>

        <Plate editor={editor}>
          <EditorContainer>
            <Editor variant="demo" />
          </EditorContainer>
        </Plate>

        <button
          onClick={saveDocument}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Save Document
        </button>
      </div>
    </DndProvider>
  );
}
