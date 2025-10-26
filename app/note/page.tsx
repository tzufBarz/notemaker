'use client';

import { Note } from "./Note";
import { useSearchParams } from "next/navigation";
import styles from "./Note.module.css";
import { Suspense, useRef } from "react";

export function NotePage() {
    const noteRef = useRef<{handleSave: () => void}>(null);

    return <div className={styles.notePage}>
                <div className={styles.saveButton}><button onClick={() => noteRef.current?.handleSave()}>Save</button></div>
                <div>
                    <div className={styles.noteEditor}>
                        <Note id={Number(useSearchParams().get('id'))} ref={noteRef} onDelete={() => {}} />
                    </div>
                </div>
            </div>;
}

export default function NotePageRoute() {
    return <Suspense><NotePage /></Suspense>
}