"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "http://localhost:3000/login",
    },
  });

  if (error) alert(error.message);
  else alert("Check your email to confirm signup");
};

  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-md space-y-4">
        <h2 className="text-2xl font-semibold">Sign Up</h2>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-3 border rounded"
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded"
        />

        <button
          onClick={handleSignup}
          className="w-full p-3 bg-foreground text-background rounded"
        >
          Create Account
        </button>
      </div>
    </main>
  );
}