import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { type TDiscussion } from "@/components/plate-ui/block-discussion";

// Create a Yjs document for comments
export const ydoc = new Y.Doc();
export const ycomments = ydoc.getMap("comments");

// Initialize with test discussions if empty
if (!ycomments.get("discussions")) {
  ycomments.set("discussions", []);
}

// Connect to Yjs server
export const provider = new HocuspocusProvider({
  url: process.env.NEXT_PUBLIC_YJS_URL as string,
  name: "comments-doc",
  document: ydoc,
  onConnect: () => {
    console.log("Connected to Yjs server");
  },
  onDisconnect: () => {
    console.log("Disconnected from Yjs server");
  },
});

// Add status listener
provider.on("status", ({ status }: { status: string }) => {
  console.log("Yjs connection status:", status);
});
