'use client';

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
    return <EditorContent editor={editor} />;
}