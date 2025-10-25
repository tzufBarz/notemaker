'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextDirection from "tiptap-text-direction";

export default function NotePage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const editor = useEditor({
    extensions: [StarterKit, TextDirection.configure({
        types: ['heading', 'paragraph', 'listItem'],
    })],
    content: '',
    immediatelyRender: false,
    editable: false,
  });

  useEffect(() => {
    if (!id) return;

    supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) console.error(error);
        else {
          editor?.commands?.setContent(data?.content || '');
        }
        setLoading(false);
      });
  }, [id, editor]);

  if (loading) return <p>Loading note...</p>;
  if (!editor) return <p>Note not found</p>;

  return <EditorContent editor={editor} />;
}
