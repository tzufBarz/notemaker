'use client';

import { supabase } from "@/lib/supabaseClient";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextDirection from "tiptap-text-direction";

export default function EditorClient() {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [StarterKit,
            TextDirection.configure({
                types: ['heading', 'paragraph', 'listItem'],
            })
        ],
        content: '',
    });

    const handleSave = () => {
        if (editor) {
            const json = editor.getJSON();
            console.log(json);
            supabase.from('notes').insert({ content: json }).then(({ data, error }) => {
                if (error) {
                    console.error('Error saving note:', error);
                } else {
                    console.log('Note saved:', data);
                }
            });
        }
    };

    return (
        <div>
            <EditorContent editor={editor} />
            <button onClick={handleSave}>Save</button>
        </div>
    );
}