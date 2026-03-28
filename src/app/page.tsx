export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6">
        <header className="flex items-center justify-between py-6">
          <div className="text-xl font-semibold tracking-tight">Atlas</div>
          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              Log in
            </a>
            <a
              href="/signup"
              className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
            >
              Get started
            </a>
          </div>
        </header>

        <section className="flex flex-1 items-center py-16">
          <div className="grid w-full items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="inline-flex rounded-full border border-border px-3 py-1 text-sm text-muted-foreground">
                Personal productivity, rethought
              </div>

              <h1 className="max-w-xl text-5xl font-semibold tracking-tight sm:text-6xl">
                A clean dashboard for your work, notes, and daily flow.
              </h1>

              <p className="max-w-lg text-lg text-muted-foreground">
                Atlas helps you organize tasks, manage notes, and stay on top of your day
                with a fast, focused interface.
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href="/signup"
                  className="rounded-md bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:opacity-90"
                >
                  Create account
                </a>
                <a
                  href="/dashboard"
                  className="rounded-md border border-border px-5 py-3 text-sm font-medium transition hover:bg-muted"
                >
                  View demo
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overview</p>
                  <h2 className="text-xl font-semibold">Today at a glance</h2>
                </div>
                <div className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                  Live preview
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="text-sm text-muted-foreground">Tasks</p>
                  <p className="mt-2 text-3xl font-semibold">7</p>
                  <p className="mt-2 text-sm text-muted-foreground">2 due today</p>
                </div>

                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="mt-2 text-3xl font-semibold">14</p>
                  <p className="mt-2 text-sm text-muted-foreground">3 recently updated</p>
                </div>

                <div className="rounded-xl border border-border bg-background p-4 sm:col-span-2">
                  <p className="text-sm text-muted-foreground">Focus</p>
                  <p className="mt-2 text-lg font-medium">
                    Finish dashboard wireframe and review internship resume
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}