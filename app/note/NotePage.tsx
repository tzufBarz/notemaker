'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextDirection from "tiptap-text-direction";
import styles from './NotePage.module.css';

type NoteProps = {
  id: number;
}

export function NotePage({id}: NoteProps) {
  const [loading, setLoading] = useState(true);

  const editor = useEditor({
    extensions: [StarterKit, TextDirection.configure({
        types: ['heading', 'paragraph', 'listItem'],
    })],
    content: '',
    immediatelyRender: false,
  });

  const handleSave = () => {
      if (editor) {
          const json = editor.getJSON();
          console.log(json);
          supabase.from('notes').update({ content: json }).eq('id', id).then(({ data, error }) => {
              if (error) {
                  console.error('Error saving note:', error);
              } else {
                  console.log('Note saved:', data);
              }
          });
      }
  };

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

  return (
    <div className={styles.notePage}>
      <div className={styles.saveButton}><button onClick={handleSave}>Save</button></div>
      <div className={styles.noteEditor}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
