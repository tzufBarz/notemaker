'use client';

import { Note } from "./Note";
import { useSearchParams } from "next/navigation";
import editorStyles from "./../editor/editor.module.css";
import { useRef } from "react";

export default function NotePageRoute() {
    const id = useSearchParams().get('id');
    const noteRef = useRef<{handleSave: () => void}>(null);

    return <div className={editorStyles.notePage}>
                <div className={editorStyles.saveButton}><button onClick={() => noteRef.current?.handleSave()}>Save</button></div>
                <div className={editorStyles.noteEditor}>
                    <Note id={Number(id)} ref={noteRef} />
                </div>
            </div>;
}