'use client';

import { Note } from "./Note";
import { useSearchParams } from "next/navigation";
import styles from "./Note.module.css";
import { useRef } from "react";

export default function NotePageRoute() {
    const id = useSearchParams().get('id');
    const noteRef = useRef<{handleSave: () => void}>(null);

    return <div className={styles.notePage}>
                <div className={styles.saveButton}><button onClick={() => noteRef.current?.handleSave()}>Save</button></div>
                <div>
                    <div className={styles.noteEditor}>
                        <Note id={Number(id)} ref={noteRef} />
                    </div>
                </div>
            </div>;
}