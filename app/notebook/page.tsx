'use client';

import { createRef, JSX, RefObject, Suspense, useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import styles from './Notebook.module.css';
import { Note } from '../note/Note';
import { useSearchParams } from 'next/navigation';

export function NotebookPage() {
    const [notes, setNotes] = useState<JSX.Element[]>([]);
    const [noteRefs, setNoteRefs] = useState<React.RefObject<{handleSave: () => void} | null>[]>([]);

    const id = useSearchParams().get('id');
    const [loading, setLoading] = useState(true);

    const deleteNote = useCallback((ref: RefObject<{handleSave: () => void} | null>) => {
        const index = noteRefs.indexOf(ref);

        setNotes(prev => prev.filter((_, i) => i !== index));
        setNoteRefs(prev => prev.filter((_, i) => i !== index));
    }, [noteRefs])


    useEffect(() => {
        if (!id) return;

        supabase
            .from('notes')
            .select('id')
            .eq('notebook', id)
            .order('date')
            .order('id')
            .then(({ data, error }) => {
                if (error) console.error(error);
                else if (data) {
                    const refs = data.map(() => createRef<{ handleSave: () => void }>());
                    setNoteRefs(refs);
                    setNotes(data.map((note, i) => <Note key={note.id} id={note.id} ref={refs[i]} onDelete={deleteNote.bind(null, refs[i])} />));
                }
                setLoading(false);
            });
    }, [id, deleteNote]);

    const addNewNote = async () => {
        const { data, error } = await supabase.from('notes').insert({ notebook: id }).select('id').single();
        if (error) {
            console.error(error);
            return;
        }

        // Create a ref for the new note
        const newRef = createRef<{handleSave: () => void}>();
        
        // Add the new Note component
        setNoteRefs(prev => [...prev, newRef]);
        setNotes(prev => [...prev, <Note key={data.id} id={data.id} ref={newRef} onDelete={deleteNote.bind(null, newRef)} />]);
    };

    if (loading) return <p>Loading notebook...</p>;

    return <div className={styles.notebookPage}>
        <div className={styles.saveButton}><button onClick={() => noteRefs.forEach(noteRef => noteRef.current?.handleSave())}>Save</button></div>
        <div className={styles.notebook}>
            <div className={styles.notes}>
                {notes}
            </div>
            <button className={styles.insertButton} onClick={addNewNote}>+ New Note</button>
        </div>
    </div>;
}


export default function NotebookPageRoute() {
    return <Suspense><NotebookPage /></Suspense>
}