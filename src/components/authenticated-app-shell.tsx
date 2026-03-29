"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { getCurrentUser, supabase } from "@/lib/supabase";

type AuthenticatedAppContextValue = {
  user: User;
};

const AuthenticatedAppContext =
  createContext<AuthenticatedAppContextValue | null>(null);

const navItems = [
  { href: "/dashboard", label: "Dashboard", index: "01" },
  { href: "/tasks", label: "Tasks", index: "02" },
  { href: "/notes", label: "Notes", index: "03" },
];

export function useAuthenticatedUser() {
  const context = useContext(AuthenticatedAppContext);

  if (!context) {
    throw new Error("useAuthenticatedUser must be used within AuthenticatedAppShell");
  }

  return context.user;
}

export function AuthenticatedAppShell({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState("");
  const [authReady, setAuthReady] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const nextUser = await getCurrentUser();

        if (!active) {
          return;
        }

        if (!nextUser) {
          router.replace("/login");
          return;
        }

        setUser(nextUser);
        setAuthError("");
      } catch (error) {
        if (!active) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "Unable to load your session.";
        setAuthError(message);
      } finally {
        if (active) {
          setAuthReady(true);
        }
      }
    }

    void loadUser();

    return () => {
      active = false;
    };
  }, [router]);

  async function handleLogout() {
    setLoggingOut(true);
    setAuthError("");

    const { error } = await supabase.auth.signOut();

    if (error) {
      setAuthError(error.message);
      setLoggingOut(false);
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  if (!authReady || !user) {
    return (
      <main className="atlas-shell min-h-screen text-foreground">
        <div className="grid min-h-screen place-items-center px-6">
          <div className="w-full max-w-md border border-border bg-card p-6 text-sm text-muted-foreground">
            {authError || "Loading your workspace..."}
          </div>
        </div>
      </main>
    );
  }

  return (
    <AuthenticatedAppContext.Provider value={{ user }}>
      <main className="atlas-shell min-h-screen text-foreground">
        <div className="grid min-h-screen w-full gap-10 px-5 py-6 lg:grid-cols-[220px_1fr] lg:px-6">
          <aside className="border-b border-border pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
            <div className="mb-10">
              <p className="atlas-kicker">Atlas</p>
              <p className="mt-3 text-xl tracking-[-0.03em]">Personal workspace</p>
              <p className="mt-6 text-sm leading-7 text-muted-foreground">{user.email}</p>
            </div>

            <nav className="space-y-3">
              {navItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between py-2 text-sm transition",
                      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span>{item.label}</span>
                    <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] opacity-60">
                      {item.index}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="mt-10 text-sm text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loggingOut ? "Logging out..." : "Log out"}
            </button>

            {authError ? (
              <p className="mt-3 text-sm text-destructive">{authError}</p>
            ) : null}
          </aside>

          <section className="min-w-0 py-2">{children}</section>
        </div>
      </main>
    </AuthenticatedAppContext.Provider>
  );
}
