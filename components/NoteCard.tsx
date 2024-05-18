"use client";
import React, { useState } from 'react'
import { Input } from './ui/input';

const NoteCard = ({ notes, note, setNotes, playerRef, index,videoId }: any) => {
    const [isEditing, setIsEditing] = useState(false);
    const [EditingNodeText, setEditingNoteText] = useState("");
    const handleSeekToTimestamp = (timestamp: number) => {
        playerRef.current.internalPlayer.seekTo(timestamp, true);
    };
    const timeStampFormatter = (timestamp: number): string => {

        const minutes = Math.floor(timestamp / 60);
        const remainingSeconds = Math.floor(timestamp % 60);

        const formattedMinutes = `${minutes.toString().padStart(2, '0')} min`;
        const formattedSeconds = `${remainingSeconds.toString().padStart(2, '0')} sec`;

        return `${formattedMinutes} ${formattedSeconds}`;

    }

    const dateFormatter = (dateString: any) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = months[date.getMonth()];
        const year = date.getFullYear().toString().slice(-2);

        const formattedDate = `${day} ${month} ‘${year}`;

        return formattedDate;
    }
    const handleDeleteNote = (id: number) => {
        const updatedNotes = notes.filter( (note:any) => note.id !== id);
        setNotes(updatedNotes);
        localStorage.setItem(`notes-${videoId}`, JSON.stringify(updatedNotes));
    };
    const handleEditNote = (index: number) => {
        let temp = notes;
        // console.log(temp[index].content);
        temp[index].content = EditingNodeText
        // console.log(temp[index].content);
        // console.log(temp[index])
        setNotes(temp);
        localStorage.setItem(`notes-${videoId}`, JSON.stringify(temp));
        setIsEditing(false);
    }

    return (
        <div>
            <div className={!isEditing ? "cursor-pointer" : ""} onClick={!isEditing ? () => handleSeekToTimestamp(note.timestamp) : () => { }}>
                <p className='font-medium text-[#344054] text-sm'>{dateFormatter(note.date)}</p>
                <p className='font-medium text-sm text-[#475467]'>Timestamp: <span className='text-[#6941c6]'>{timeStampFormatter(note.timestamp)}</span></p>
                <div style={{ borderRadius: "0px 8px 8px 8px" }} className='mt-3 border-[#eaecf0] border p-3 '>
                    {!isEditing && (note.content)}
                    {isEditing && <Input className='w-fit transition-all' placeholder={note.content} value={EditingNodeText} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingNoteText(e.target.value)} />}
                </div>
            </div>

            <div className='w-full flex items-center mt-3 gap-1 mb-4 justify-end'>
                <button className='px-2 p-0.5 border-2 border-[#d0d5dd] rounded-xl text-[#344054] font-medium text-sm ' onClick={() => handleDeleteNote(note.id)}>Delete note</button>
                {!isEditing && <button className='px-2 p-0.5 border-2 border-[#d0d5dd] rounded-xl text-[#344054] font-medium text-sm ' onClick={() => setIsEditing(true)}>Edit note</button>}
                {isEditing && (
                    <div className='transition-all gap-1 flex'>
                        <button className='px-2 p-0.5 border-2 border-[#d0d5dd] rounded-xl text-[#344054] font-medium text-sm ' onClick={() => handleEditNote(index)}>Save changes</button>
                        <button className='px-2 p-0.5 border-2 border-[#d0d5dd]  rounded-xl text-[#344054] font-medium text-sm ' onClick={() => { setIsEditing(false); setEditingNoteText(""); }}>cancel editing</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default NoteCard
