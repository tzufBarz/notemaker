'use client';

import { createRef, JSX, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import styles from './Notebook.module.css';
import { Note } from '../note/Note';
import { useSearchParams } from 'next/navigation';
import editorStyles from './../editor/editor.module.css';

let notes: JSX.Element[] = [];
let noteRefs: React.RefObject<{handleSave: () => void} | null>[] = [];

export default function NotebookPage() {
    const id = useSearchParams().get('id');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        console.log(id);

        supabase
            .from('notes')
            .select('id')
            .eq('notebook', id)
            .then(({ data, error }) => {
                if (error) console.error(error);
                else {
                    noteRefs = Array(data?.length).fill(undefined).map(() => createRef<{handleSave: () => void}>());
                    notes = data?.map((note, i) => <Note key={note.id} id={note.id} ref={noteRefs[i]} />);
                }
                setLoading(false);
            });
    }, [id]);

    if (loading) return <p>Loading notebook...</p>;

    return <div className={styles.notebookPage}>
        <div className={editorStyles.saveButton}><button onClick={() => noteRefs.forEach(noteRef => noteRef.current?.handleSave())}>Save</button></div>
        <div className={styles.notebook}>{notes}</div>
    </div>;
}
