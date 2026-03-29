"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setSubmitting(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setSubmitting(false);
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  };

  return (
    <main className="atlas-shell min-h-screen px-6 py-6 text-foreground sm:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-5xl items-start gap-12 border-t border-border pt-12 lg:grid-cols-[1fr_360px]">
        <section className="atlas-fade-up">
          <p className="atlas-kicker">Atlas</p>
          <h1 className="atlas-title mt-4 max-w-3xl text-5xl leading-none sm:text-6xl">
            Log back in and get back to work.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground">
            Tasks stay visible, notes stay close, and the interface stays out of the way.
          </p>
        </section>

        <section className="atlas-fade-up-delay">
          <div className="space-y-5">
            <div>
              <p className="atlas-kicker">Welcome back</p>
              <h2 className="atlas-title mt-3 text-3xl">Log in</h2>
            </div>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="atlas-input w-full"
            />

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !submitting) {
                  void handleLogin();
                }
              }}
              type="password"
              placeholder="Password"
              className="atlas-input w-full"
            />

            {errorMessage ? (
              <div className="border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {errorMessage}
              </div>
            ) : null}

            <button
              onClick={() => void handleLogin()}
              disabled={submitting}
              className="atlas-button-primary w-full"
            >
              {submitting ? "Logging in..." : "Log in"}
            </button>

            <p className="text-sm text-muted-foreground">
              Need an account?{" "}
              <Link href="/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
