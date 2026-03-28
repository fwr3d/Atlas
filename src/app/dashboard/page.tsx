export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[240px_1fr]">
        <aside className="border-r border-border bg-card px-6 py-8">
          <div className="mb-10">
            <h1 className="text-xl font-semibold tracking-tight">Atlas</h1>
            <p className="text-sm text-muted-foreground">Personal workspace</p>
          </div>

          <nav className="space-y-2">
            <a
              href="/dashboard"
              className="block rounded-md bg-muted px-3 py-2 text-sm font-medium"
            >
              Dashboard
            </a>
            <a
              href="/tasks"
              className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              Tasks
            </a>
            <a
              href="/notes"
              className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              Notes
            </a>
            <a
              href="/settings"
              className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              Settings
            </a>
          </nav>
        </aside>

        <section className="px-6 py-8 md:px-10">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Welcome back</p>
              <h2 className="text-3xl font-semibold tracking-tight">Your dashboard</h2>
            </div>

            <button className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90">
              Add task
            </button>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-6 xl:col-span-2">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Today</p>
                <h3 className="text-xl font-semibold">Tasks</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-border bg-background p-4">
                  <div>
                    <p className="font-medium">Finish dashboard layout</p>
                    <p className="text-sm text-muted-foreground">High priority</p>
                  </div>
                  <span className="text-sm text-muted-foreground">Due today</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-border bg-background p-4">
                  <div>
                    <p className="font-medium">Review resume projects</p>
                    <p className="text-sm text-muted-foreground">Medium priority</p>
                  </div>
                  <span className="text-sm text-muted-foreground">Tomorrow</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-border bg-background p-4">
                  <div>
                    <p className="font-medium">Polish login page</p>
                    <p className="text-sm text-muted-foreground">Low priority</p>
                  </div>
                  <span className="text-sm text-muted-foreground">This week</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Quick stats</p>
                <h3 className="text-xl font-semibold">Overview</h3>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="text-sm text-muted-foreground">Open tasks</p>
                  <p className="mt-2 text-3xl font-semibold">7</p>
                </div>

                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="mt-2 text-3xl font-semibold">14</p>
                </div>

                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="text-sm text-muted-foreground">Focus streak</p>
                  <p className="mt-2 text-3xl font-semibold">5d</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}