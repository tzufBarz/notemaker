'use client';

import { ChangeEvent, Dispatch, FocusEvent, forwardRef, SetStateAction, useEffect, useImperativeHandle, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextDirection from "tiptap-text-direction";
import styles from "./Note.module.css";

type NoteProps = {
  id: number;
}


export const Note = forwardRef(({id}: NoteProps, ref) => {
  const [date, setDate] = useState('');

  const [loading, setLoading] = useState(true);

  const editor = useEditor({
    extensions: [StarterKit, TextDirection.configure({
        types: ['heading', 'paragraph', 'listItem'],
    })],
    content: '',
    immediatelyRender: false,
  });

  useImperativeHandle(ref, () => ({
    handleSave: () => {
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
    }
  }));

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

          if (data?.date) {
            setDate(data.date);
          }
        }
        setLoading(false);
      });
  }, [id, editor]);

  if (loading) return <p>Loading note...</p>;
  if (!editor) return <p>Note not found</p>;

  const updateDate = (event: FocusEvent<HTMLInputElement, Element>) => {
    const newDate = event.target.value;

    if (newDate == date) return;

    if (Number.isNaN(Date.parse(newDate))) {
      event.target.value = date;
      return;
    }
  
    supabase.from('notes').update({ date: newDate }).eq('id', id).then(({ data, error }) => {
      if (error) {
        console.error('Error saving date: ', error);
        setDate(date);
      } else {
        setDate(newDate);
      }
    })
  }

  return <EditorContent className={styles.noteEditor} editor={editor}><input type={date} className={styles.dateSelector} defaultValue={date} onBlur={updateDate} /></EditorContent>;
});

Note.displayName = 'Note';