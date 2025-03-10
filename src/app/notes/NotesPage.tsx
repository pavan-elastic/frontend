"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const NotesPage = () => {
  const router = useRouter();
  const [notes, setNotes] = useState<{ id: string; name: string }[]>([]);
  const [newNoteName, setNewNoteName] = useState("");

  // Fetch existing notes from the backend
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("http://172.105.57.243:5000/api/notes"); // Adjust the API route
        if (!response.ok) throw new Error("Failed to fetch notes");

        const data = await response.json();
        setNotes(data); // Assume backend returns [{ id: "uuid1", name: "Note 1" }, { id: "uuid2", name: "Note 2" }]
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, []);

  // Handle new note creation
  const createNote = async () => {
    if (!newNoteName.trim()) return alert("Note name cannot be empty");

    try {
      const response = await fetch("http://172.105.57.243:5000/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newNoteName }), // Send only name
      });

      if (!response.ok) throw new Error("Failed to create note");

      const newNote = await response.json(); // Get UUID from backend response
      setNotes([...notes, newNote]); // Update local state
      router.push(`/editor/${newNote.id}`); // Navigate with correct UUID
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      {/* Create New Note */}
      <div className="mb-6 w-full max-w-lg p-4 border border-blue-500 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Create a New Note</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newNoteName}
            onChange={(e) => setNewNoteName(e.target.value)}
            placeholder="Enter note name"
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={createNote}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </div>

      {/* List of Notes */}
      <div className="w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-2">Your Notes</h2>
        <div className="border border-gray-300 rounded-lg max-h-[400px] overflow-y-auto p-2">
          {notes.length === 0 ? (
            <p className="text-gray-500">No notes available.</p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                onClick={() => router.push(`/editor/${note.id}`)}
                className="cursor-pointer p-3 border-b last:border-none hover:bg-gray-100 transition"
              >
                {note.name}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
