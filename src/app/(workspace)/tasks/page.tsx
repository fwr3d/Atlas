"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthenticatedUser } from "@/components/authenticated-app-shell";
import {
  createTaskForUser,
  deleteTaskForUser,
  fetchTasksForUser,
  updateTaskCompletionForUser,
} from "@/lib/tasks";
import type { Task } from "@/lib/types";

const priorityOptions: Task["priority"][] = ["high", "medium", "low"];

export default function TasksPage() {
  const user = useAuthenticatedUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<Task["priority"]>("medium");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "completed">("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | Task["priority"]>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "due-soon" | "priority">("newest");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function refreshTasks() {
    try {
      const data = await fetchTasksForUser(user.id);
      setTasks(data);
      setErrorMessage("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load tasks.";
      setErrorMessage(message);
    }

    setLoading(false);
  }

  async function addTask() {
    if (!newTask.trim()) return;

    setSubmitting(true);
    setErrorMessage("");
    setStatusMessage("");

    const { error } = await createTaskForUser(user.id, {
      title: newTask.trim(),
      priority: newTaskPriority,
      dueDate: newTaskDueDate,
    });

    if (error) {
      setErrorMessage(error.message);
      setSubmitting(false);
      return;
    }

    setNewTask("");
    setNewTaskPriority("medium");
    setNewTaskDueDate("");
    await refreshTasks();
    setStatusMessage("Task added.");
    setSubmitting(false);
  }

  async function toggleTask(id: string, completed: boolean) {
    setErrorMessage("");
    setStatusMessage("");

    const { error } = await updateTaskCompletionForUser(user.id, id, !completed);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    await refreshTasks();
    setStatusMessage(completed ? "Task reopened." : "Task completed.");
  }

  async function deleteTask(id: string) {
    setErrorMessage("");
    setStatusMessage("");

    const { error } = await deleteTaskForUser(user.id, id);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    await refreshTasks();
    setStatusMessage("Task deleted.");
  }

  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await fetchTasksForUser(user.id);
        setTasks(data);
        setErrorMessage("");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load tasks.";
        setErrorMessage(message);
      }

      setLoading(false);
    }

    void loadTasks();
  }, [user.id]);

  const filteredTasks = useMemo(() => {
    const priorityRank: Record<Task["priority"], number> = {
      high: 0,
      medium: 1,
      low: 2,
    };

    const nextTasks = tasks.filter((task) => {
      if (statusFilter === "open" && task.completed) {
        return false;
      }

      if (statusFilter === "completed" && !task.completed) {
        return false;
      }

      if (priorityFilter !== "all" && task.priority !== priorityFilter) {
        return false;
      }

      return true;
    });

    return nextTasks.sort((left, right) => {
      if (sortOrder === "priority") {
        const rankDifference = priorityRank[left.priority] - priorityRank[right.priority];
        if (rankDifference !== 0) {
          return rankDifference;
        }
      }

      if (sortOrder === "due-soon") {
        if (left.due_date && right.due_date) {
          const dueDifference = left.due_date.localeCompare(right.due_date);
          if (dueDifference !== 0) {
            return dueDifference;
          }
        } else if (left.due_date) {
          return -1;
        } else if (right.due_date) {
          return 1;
        }
      }

      return right.created_at.localeCompare(left.created_at);
    });
  }, [tasks, statusFilter, priorityFilter, sortOrder]);

  const openTaskCount = tasks.filter((task) => !task.completed).length;
  const scheduledTaskCount = tasks.filter(
    (task) => !task.completed && Boolean(task.due_date)
  ).length;

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
    <div className="atlas-fade-up space-y-10">
      <section className="border-b border-border pb-8">
        <p className="atlas-kicker">Task board</p>
        <h1 className="atlas-title mt-4 text-5xl leading-none sm:text-6xl">
          Capture tasks and keep the list moving.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
          Add work, assign a priority, and sort the list by what matters next.
        </p>

        <div className="mt-8 grid gap-3 lg:grid-cols-[minmax(0,1.8fr)_170px_190px_auto]">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !submitting) {
                void addTask();
              }
            }}
            placeholder="Write the next concrete task"
            className="atlas-input"
          />
          <select
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value as Task["priority"])}
            className="atlas-input"
          >
            {priorityOptions.map((priority) => (
              <option key={priority} value={priority}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)} priority
              </option>
            ))}
          </select>
          <input
            type="date"
            value={newTaskDueDate}
            onChange={(e) => setNewTaskDueDate(e.target.value)}
            className="atlas-input"
          />
          <button
            onClick={() => void addTask()}
            disabled={submitting}
            className="atlas-button-primary"
          >
            {submitting ? "Adding..." : "Add task"}
          </button>
        </div>

        <div className="mt-8 grid gap-6 border-t border-border pt-6 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto] lg:items-end">
          <div>
            <p className="atlas-kicker">Snapshot</p>
            <p className="mt-3 text-sm text-muted-foreground">
              {openTaskCount} open, {scheduledTaskCount} scheduled, {tasks.length} total.
            </p>
          </div>

          <label className="space-y-2">
            <span className="atlas-kicker">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "open" | "completed")}
              className="atlas-input min-w-[140px]"
            >
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="completed">Completed</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="atlas-kicker">Priority</span>
            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value as "all" | Task["priority"])
              }
              className="atlas-input min-w-[150px]"
            >
              <option value="all">All priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="atlas-kicker">Sort</span>
            <select
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value as "newest" | "due-soon" | "priority")
              }
              className="atlas-input min-w-[150px]"
            >
              <option value="newest">Newest</option>
              <option value="due-soon">Due soon</option>
              <option value="priority">Priority</option>
            </select>
          </label>
        </div>
      </section>

      {errorMessage ? (
        <div className="border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}

      {statusMessage ? (
        <div className="text-sm text-muted-foreground">{statusMessage}</div>
      ) : null}

      <div className="divide-y divide-border border-y border-border">
        {loading ? (
          <div className="py-6 text-sm text-muted-foreground">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="py-6 text-sm text-muted-foreground">
            No tasks match the current filters.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => void toggleTask(task.id, task.completed)}
                  className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                />
                <div>
                  <p
                    className={task.completed ? "text-muted-foreground line-through" : "text-lg"}
                  >
                    {task.title}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full border border-border px-2.5 py-1 capitalize">
                      {task.priority}
                    </span>
                    <span className="rounded-full border border-border px-2.5 py-1">
                      {formatDueDate(task.due_date)}
                    </span>
                    <span className="rounded-full border border-border px-2.5 py-1">
                      {task.completed ? "Completed" : "Open"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => void deleteTask(task.id)}
                className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground transition hover:text-foreground"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
