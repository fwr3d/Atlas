import Link from "next/link";

export default function Home() {
  return (
    <main className="atlas-shell min-h-screen text-foreground">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-6 sm:px-10">
        <header className="atlas-fade-up flex items-center justify-between border-b border-border pb-5">
          <div>
            <p className="atlas-kicker">Atlas</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Calm infrastructure for daily work
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              Log in
            </Link>
            <Link href="/signup" className="atlas-button-primary px-4 py-2.5">
              Get started
            </Link>
          </div>
        </header>

        <section className="grid flex-1 items-start gap-14 py-14 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="atlas-fade-up space-y-10">
            <div className="space-y-6">
              <p className="atlas-kicker">Tasks and notes</p>
              <h1 className="atlas-title max-w-4xl text-6xl leading-none sm:text-7xl">
                A focused workspace for your tasks, notes, and daily work.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Atlas keeps the important work visible without getting in the way. It is fast,
                quiet, and simple enough to keep open all day.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/signup" className="atlas-button-primary">
                Create account
              </Link>
              <Link href="/dashboard" className="atlas-button-secondary">
                Explore the workspace
              </Link>
            </div>

            <div className="grid gap-8 border-t border-border pt-8 sm:grid-cols-3">
              <div>
                <p className="atlas-kicker">Tasks</p>
                <p className="mt-3 text-lg leading-7">
                  Keep active work visible and small enough to manage.
                </p>
              </div>
              <div>
                <p className="atlas-kicker">Notes</p>
                <p className="mt-3 text-lg leading-7">
                  Hold ideas, drafts, and supporting context nearby.
                </p>
              </div>
              <div>
                <p className="atlas-kicker">Overview</p>
                <p className="mt-3 text-lg leading-7">
                  See what is open, what is done, and what deserves focus next.
                </p>
              </div>
            </div>
          </div>

          <aside className="atlas-fade-up-delay border-l border-border pl-0 lg:pl-8">
            <div className="space-y-8">
              <div>
                <p className="atlas-kicker">Preview</p>
                <h2 className="atlas-title mt-3 text-3xl">Today at a glance</h2>
              </div>

              <div className="space-y-6">
                <div className="border-b border-border pb-5">
                  <p className="atlas-kicker">Open tasks</p>
                  <p className="mt-3 text-5xl font-semibold tracking-tight">7</p>
                </div>
                <div className="border-b border-border pb-5">
                  <p className="atlas-kicker">Recent notes</p>
                  <p className="mt-3 text-5xl font-semibold tracking-tight">14</p>
                </div>
                <div>
                  <p className="atlas-kicker">Focus</p>
                  <p className="mt-3 text-lg leading-8">
                    Finish the portfolio pass, tighten the notes model, and wrap up the day.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
