"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useAuthenticatedUser } from "@/components/authenticated-app-shell";
import {
  createNoteForUser,
  deleteNoteForUser,
  fetchNotesForUser,
  updateNoteForUser,
} from "@/lib/notes";
import type { Note } from "@/lib/types";

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function NotesPage() {
  const user = useAuthenticatedUser();
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const deferredSearch = useDeferredValue(search);

  const activeNote = useMemo(
    () => notes.find((note) => note.id === activeNoteId) ?? null,
    [notes, activeNoteId]
  );

  const filteredNotes = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();

    if (!query) {
      return notes;
    }

    return notes.filter((note) => {
      const haystack = `${note.title} ${note.content}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [notes, deferredSearch]);

  const hasDraftChanges =
    !!activeNote &&
    (draftTitle !== activeNote.title || draftContent !== activeNote.content);

  function applyActiveNote(nextNote: Note | null) {
    setActiveNoteId(nextNote?.id ?? null);
    setDraftTitle(nextNote?.title ?? "");
    setDraftContent(nextNote?.content ?? "");
  }

  async function refreshNotes(nextActiveId?: string | null) {
    const { data, error } = await fetchNotesForUser(user.id);

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    const nextNotes = data || [];
    setNotes(nextNotes);
    setErrorMessage("");
    setLoading(false);

    const resolvedActiveId =
      nextActiveId !== undefined
        ? nextActiveId
        : nextNotes.some((note) => note.id === activeNoteId)
          ? activeNoteId
          : nextNotes[0]?.id ?? null;

    const resolvedActiveNote =
      resolvedActiveId !== null
        ? nextNotes.find((note) => note.id === resolvedActiveId) ?? null
        : null;

    applyActiveNote(resolvedActiveNote);
  }

  async function createNote() {
    setCreating(true);
    setErrorMessage("");
    setStatusMessage("");

    const { data, error } = await createNoteForUser(user.id);

    if (error) {
      setErrorMessage(error.message);
      setCreating(false);
      return;
    }

    await refreshNotes(data.id);
    setStatusMessage("Note created.");
    setCreating(false);
  }

  async function saveNote() {
    if (!activeNote) return;

    setSaving(true);
    setErrorMessage("");
    setStatusMessage("");

    const cleanTitle = draftTitle.trim() || "Untitled note";
    const { error } = await updateNoteForUser(user.id, activeNote.id, {
      title: cleanTitle,
      content: draftContent,
    });

    if (error) {
      setErrorMessage(error.message);
      setSaving(false);
      return;
    }

    await refreshNotes(activeNote.id);
    setDraftTitle(cleanTitle);
    setStatusMessage("Note saved.");
    setSaving(false);
  }

  async function deleteNote() {
    if (!activeNote) return;

    setDeleting(true);
    setErrorMessage("");
    setStatusMessage("");

    const { error } = await deleteNoteForUser(user.id, activeNote.id);

    if (error) {
      setErrorMessage(error.message);
      setDeleting(false);
      return;
    }

    await refreshNotes(null);
    setDraftTitle("");
    setDraftContent("");
    setStatusMessage("Note deleted.");
    setDeleting(false);
  }

  useEffect(() => {
    async function loadNotes() {
      const { data, error } = await fetchNotesForUser(user.id);

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      const nextNotes = data || [];
      setNotes(nextNotes);
      setErrorMessage("");
      setLoading(false);
      applyActiveNote(nextNotes[0] ?? null);
    }

    void loadNotes();
  }, [user.id]);

  return (
    <div className="atlas-fade-up space-y-10">
      <section className="grid gap-10 border-b border-border pb-8 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div>
          <p className="atlas-kicker">Notes</p>
          <h1 className="atlas-title mt-4 text-5xl leading-none sm:text-6xl">
            Keep the details that do not belong on a task list.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
            Use notes for drafts, context, and anything you want to come back to later.
          </p>
        </div>

        <div className="grid gap-6 border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <div>
            <p className="atlas-kicker">Total notes</p>
            <p className="mt-2 text-5xl font-semibold tracking-tight">{notes.length}</p>
          </div>
          <div>
            <p className="atlas-kicker">Search</p>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter notes"
              className="atlas-input mt-3 w-full"
            />
          </div>
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

      <section className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="atlas-kicker">Library</p>
              <h2 className="atlas-title mt-3 text-3xl">All notes</h2>
            </div>
            <button
              onClick={() => void createNote()}
              disabled={creating}
              className="atlas-button-primary px-4 py-2"
            >
              {creating ? "Adding..." : "New"}
            </button>
          </div>

          <div className="divide-y divide-border border-y border-border">
            {loading ? (
              <div className="py-6 text-sm text-muted-foreground">Loading notes...</div>
            ) : filteredNotes.length === 0 ? (
              <div className="py-6 text-sm text-muted-foreground">
                {search.trim()
                  ? "No notes match that search yet."
                  : "No notes yet. Create the first one to start the library."}
              </div>
            ) : (
              filteredNotes.map((note) => {
                const isActive = note.id === activeNoteId;

                return (
                  <button
                    key={note.id}
                    onClick={() => applyActiveNote(note)}
                    className={`block w-full py-5 text-left transition ${
                      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <p className="text-lg font-medium">
                      {note.title || "Untitled note"}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm leading-6">
                      {note.content || "Empty note"}
                    </p>
                    <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.18em] opacity-60">
                      {formatTimestamp(note.updated_at)}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <div>
          {!activeNote && !loading ? (
            <div className="border-y border-border py-10">
              <p className="atlas-kicker">Editor</p>
              <p className="mt-4 text-lg leading-8">
                Select a note or create a new one to start editing.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
                <div>
                  <p className="atlas-kicker">Editor</p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {activeNote ? `Last updated ${formatTimestamp(activeNote.updated_at)}` : ""}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => void saveNote()}
                    disabled={!activeNote || !hasDraftChanges || saving}
                    className="atlas-button-primary"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => void deleteNote()}
                    disabled={!activeNote || deleting}
                    className="atlas-button-secondary"
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>

              <div className="space-y-5">
                <input
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  placeholder="Untitled note"
                  className="w-full border-b border-border bg-transparent pb-4 text-3xl outline-none placeholder:text-muted-foreground"
                />

                <textarea
                  value={draftContent}
                  onChange={(e) => setDraftContent(e.target.value)}
                  placeholder="Write the note here."
                  className="min-h-[420px] w-full resize-none bg-transparent text-base leading-8 outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
