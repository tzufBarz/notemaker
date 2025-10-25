'use client';

import { useParams } from "next/navigation";
import { NotePage } from "./NotePage";

export default function NotePageRoute() {
    const { id } = useParams();
    return <NotePage id={Number(id)} />;
}