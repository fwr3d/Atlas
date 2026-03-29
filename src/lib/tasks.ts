import { supabase } from "@/lib/supabase";
import type { Task } from "@/lib/types";

export async function fetchTasksForUser(userId: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select("id, title, completed, priority, due_date, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .returns<Task[]>();

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function createTaskForUser(
  userId: string,
  input: {
    title: string;
    priority: Task["priority"];
    dueDate: string;
  }
) {
  return supabase.from("tasks").insert({
    title: input.title,
    priority: input.priority,
    due_date: input.dueDate || null,
    user_id: userId,
  });
}

export async function updateTaskCompletionForUser(
  userId: string,
  taskId: string,
  completed: boolean
) {
  return supabase
    .from("tasks")
    .update({ completed })
    .eq("id", taskId)
    .eq("user_id", userId);
}

export async function deleteTaskForUser(userId: string, taskId: string) {
  return supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .eq("user_id", userId);
}
