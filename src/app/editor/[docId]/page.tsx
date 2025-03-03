"use client";

import { Toaster } from "sonner";

import { PlateEditor } from "@/components/editor/plate-editor";
import { SettingsProvider } from "@/components/editor/settings";
import { useParams } from "next/navigation";

export default function Page() {
  const { docId } = useParams();
  return (
    <div className="h-screen w-full" data-registry="plate">
      <SettingsProvider>
        <PlateEditor docId={docId} />
      </SettingsProvider>

      <Toaster />
    </div>
  );
}
