'use client';

import { useCallback, useEffect, useState } from 'react';

type NotesMap = Record<string, string>;

const NOTES_KEY = 'pokemon-notes';

export function useNotes() {
  const [notesById, setNotesById] = useState<NotesMap>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(NOTES_KEY);
      if (raw) setNotesById(JSON.parse(raw));
    } catch {
      // ignore
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(notesById));
    } catch {
      // ignore
    }
  }, [notesById, isLoaded]);

  const getNote = useCallback((id: number | string) => {
    return notesById[String(id)] || '';
  }, [notesById]);

  const setNote = useCallback((id: number | string, note: string) => {
    setNotesById((prev) => ({ ...prev, [String(id)]: note }));
  }, []);

  const clearNote = useCallback((id: number | string) => {
    setNotesById((prev) => {
      const next = { ...prev };
      delete next[String(id)];
      return next;
    });
  }, []);

  return { getNote, setNote, clearNote, isLoaded };
}


