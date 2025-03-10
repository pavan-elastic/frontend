"use client";
// import { useAppContext } from "../context/AppContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie"; // Correct import

const NameForm = () => {
  // const { setName } = useAppContext(); // Get setName from context
  const [input, setInput] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      // setName(input);
      Cookies.set("username", input, { expires: 30, path: "/" });
      router.push("/notes");
    }
  };

  return (
    <div>
      <nav className="w-full p-3 bg-[rgba(255,255,255,0.25)] backdrop-blur-lg border border-blue-500">
        <h1 className="text-blue-600 border border-green-600 rounded-full px-5 py-2 bg-white inline-block w-auto">
          Demo App
        </h1>
      </nav>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row items-center justify-center min-h-[800px] max-w-[800px] p-4 border-2 border-blue-600 mx-auto my-[30px]">
          {/* Image Section */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src="/assets/usernameform.jpg"
              alt="Illustration"
              width={400}
              height={400}
              className="rounded-lg object-cover max-w-full"
            />
          </div>

          {/* Form Section */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start p-6">
            <h2 className="text-2xl font-semibold mb-4">Enter Your Name</h2>
            <input
              type="text"
              placeholder="Your Name"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full max-w-sm p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NameForm;
