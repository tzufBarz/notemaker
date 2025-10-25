'use client';

import { NotePage } from "./NotePage";
import { useSearchParams } from "next/navigation";

export default function NotePageRoute() {
    const id = useSearchParams().get('id');
    return <NotePage id={Number(id)} />;
}