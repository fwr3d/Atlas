"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSignup = async () => {
    setSubmitting(true);
    setErrorMessage("");
    setStatusMessage("");

    const redirectUrl =
      typeof window === "undefined" ? undefined : new URL("/login", window.location.origin).toString();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: redirectUrl
        ? {
            emailRedirectTo: redirectUrl,
          }
        : undefined,
    });

    if (error) {
      setErrorMessage(error.message);
      setSubmitting(false);
      return;
    }

    setStatusMessage("Check your email to confirm signup.");
    setSubmitting(false);
    router.prefetch("/login");
  };

  return (
    <main className="atlas-shell min-h-screen px-4 py-6 text-foreground sm:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="atlas-fade-up atlas-panel mx-auto w-full max-w-lg p-6 sm:p-8 lg:order-2">
          <div className="mb-8">
            <p className="atlas-kicker">Create account</p>
            <h2 className="atlas-title mt-3 text-4xl">Create account</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Set up a simple workspace for tasks and notes.
            </p>
          </div>

          <div className="space-y-4">
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
                  void handleSignup();
                }
              }}
              type="password"
              placeholder="Password"
              className="atlas-input w-full"
            />

            {errorMessage ? (
              <div className="rounded-[1.2rem] border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {errorMessage}
              </div>
            ) : null}

            {statusMessage ? (
              <div className="rounded-[1.2rem] border border-border bg-card/80 px-4 py-3 text-sm text-muted-foreground">
                {statusMessage}
              </div>
            ) : null}

            <button
              onClick={() => void handleSignup()}
              disabled={submitting}
              className="atlas-button-primary w-full"
            >
              {submitting ? "Creating account..." : "Create Account"}
            </button>

            <p className="text-sm text-muted-foreground">
              Already signed up?{" "}
              <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
                Log in
              </Link>
            </p>
          </div>
        </section>

        <section className="atlas-fade-up-delay atlas-panel hidden min-h-[560px] overflow-hidden p-8 lg:block lg:order-1">
          <div className="flex h-full flex-col justify-between">
            <div>
              <p className="atlas-kicker">Atlas</p>
              <h1 className="atlas-title mt-4 text-5xl leading-none">
                Start with a workspace that stays focused.
              </h1>
              <p className="mt-6 max-w-md text-base leading-8 text-muted-foreground">
                Atlas keeps tasks and notes together without a lot of extra noise.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="atlas-card p-5">
                <p className="atlas-kicker">Tasks first</p>
                <p className="mt-3 text-lg font-medium">
                  Keep the important work visible without crowding the rest of the day.
                </p>
              </div>
              <div className="atlas-card p-5">
                <p className="atlas-kicker">Notes next</p>
                <p className="mt-3 text-lg font-medium">
                  A writing space is already waiting right behind the shell.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
