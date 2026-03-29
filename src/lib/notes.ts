import { supabase } from "@/lib/supabase";
import type { Note } from "@/lib/types";

export async function fetchNotesForUser(userId: string) {
  return supabase
    .from("notes")
    .select("id, title, content, created_at, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .returns<Note[]>();
}

export async function createNoteForUser(userId: string) {
  return supabase
    .from("notes")
    .insert({
      user_id: userId,
      title: "Untitled note",
      content: "",
    })
    .select("id, title, content, created_at, updated_at")
    .single<Note>();
}

export async function updateNoteForUser(
  userId: string,
  noteId: string,
  input: { title: string; content: string }
) {
  return supabase
    .from("notes")
    .update(input)
    .eq("id", noteId)
    .eq("user_id", userId);
}

export async function deleteNoteForUser(userId: string, noteId: string) {
  return supabase
    .from("notes")
    .delete()
    .eq("id", noteId)
    .eq("user_id", userId);
}
