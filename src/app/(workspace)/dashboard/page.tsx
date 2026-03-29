"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuthenticatedUser } from "@/components/authenticated-app-shell";
import { fetchTasksForUser } from "@/lib/tasks";
import type { Task } from "@/lib/types";

export default function DashboardPage() {
  const user = useAuthenticatedUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setErrorMessage("");

      try {
        const data = await fetchTasksForUser(user.id);

        if (active) {
          setTasks(data);
          setLoading(false);
        }
      } catch (error) {
        if (active) {
          const message =
            error instanceof Error ? error.message : "Unable to load the dashboard.";
          setErrorMessage(message);
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      active = false;
    };
  }, [user.id]);

  const openTasks = useMemo(
    () => tasks.filter((task) => !task.completed).length,
    [tasks]
  );
  const highPriorityTasks = useMemo(
    () => tasks.filter((task) => !task.completed && task.priority === "high").length,
    [tasks]
  );
  const todayString = new Intl.DateTimeFormat("en-CA").format(new Date());
  const dueSoonTasks = useMemo(
    () =>
      tasks.filter(
        (task) => !task.completed && task.due_date && task.due_date <= todayString
      ).length,
    [tasks, todayString]
  );

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks]
  );

  const recentTasks = useMemo(() => tasks.slice(0, 3), [tasks]);
  const mostRecentTask = recentTasks[0] ?? null;
  const statusLine =
    openTasks > 0
      ? `${openTasks} open task${openTasks === 1 ? "" : "s"}`
      : "No open tasks";
  const priorityLine =
    highPriorityTasks > 0
      ? `${highPriorityTasks} high-priority task${highPriorityTasks === 1 ? "" : "s"}`
      : "No high-priority tasks";
  const dueLine =
    dueSoonTasks > 0
      ? `${dueSoonTasks} due now`
      : "Nothing due right now";

  function formatDueDate(value: string | null) {
    if (!value) {
      return "No date";
    }

    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(`${value}T12:00:00`));
  }

  return (
    <div className="atlas-fade-up space-y-12">
      <section className="grid gap-10 border-b border-border pb-10 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div>
          <p className="atlas-kicker">Welcome back</p>
          <h1 className="atlas-title mt-4 max-w-4xl text-5xl leading-none sm:text-6xl">
            Dashboard
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
            See your task count, recent activity, and what still needs attention.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/tasks" className="atlas-button-primary">
              Open tasks
            </Link>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>

        <div className="grid gap-6 border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <div>
            <p className="atlas-kicker">Open</p>
            <p className="mt-2 text-5xl font-semibold tracking-tight">{openTasks}</p>
          </div>
          <div>
            <p className="atlas-kicker">Completed</p>
            <p className="mt-2 text-5xl font-semibold tracking-tight">{completedTasks}</p>
          </div>
          <div>
            <p className="atlas-kicker">Total</p>
            <p className="mt-2 text-5xl font-semibold tracking-tight">{tasks.length}</p>
          </div>
          <div>
            <p className="atlas-kicker">High priority</p>
            <p className="mt-2 text-5xl font-semibold tracking-tight">{highPriorityTasks}</p>
          </div>
        </div>
      </section>

      {errorMessage ? (
        <div className="border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}

      {loading ? (
        <div className="border border-border py-8 text-sm text-muted-foreground">
          Loading dashboard...
        </div>
      ) : (
        <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <div className="mb-5">
              <p className="atlas-kicker">Recent activity</p>
              <h2 className="atlas-title mt-3 text-3xl">Latest tasks</h2>
            </div>

            <div className="divide-y divide-border border-y border-border">
              {recentTasks.length === 0 ? (
                <div className="py-6 text-sm text-muted-foreground">
                  No tasks yet. Add your first task to get started.
                </div>
              ) : (
                recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between gap-4 py-6">
                    <div>
                      <p className="text-xl font-medium">{task.title}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span className="rounded-full border border-border px-2.5 py-1 capitalize">
                          {task.priority}
                        </span>
                        <span className="rounded-full border border-border px-2.5 py-1">
                          {task.due_date ? `Due ${formatDueDate(task.due_date)}` : "No date"}
                        </span>
                        <span className="rounded-full border border-border px-2.5 py-1">
                          {task.completed ? "Completed" : "Open"}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">
                      {task.completed ? "Done" : "Active"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <div className="space-y-8 border-l border-border pl-0 lg:pl-8">
              <div>
                <p className="atlas-kicker">Status</p>
                <p className="mt-3 text-lg leading-8">{statusLine}</p>
              </div>

              <div>
                <p className="atlas-kicker">Finished</p>
                <p className="mt-3 text-lg leading-8">
                  {completedTasks > 0
                    ? `${completedTasks} completed`
                    : "Nothing completed yet"}
                </p>
              </div>

              <div>
                <p className="atlas-kicker">Priority</p>
                <p className="mt-3 text-lg leading-8">{priorityLine}</p>
              </div>

              <div>
                <p className="atlas-kicker">Due</p>
                <p className="mt-3 text-lg leading-8">{dueLine}</p>
              </div>

              <div>
                <p className="atlas-kicker">Most recent</p>
                <p className="mt-3 text-lg leading-8">
                  {mostRecentTask ? mostRecentTask.title : "No task activity yet."}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
