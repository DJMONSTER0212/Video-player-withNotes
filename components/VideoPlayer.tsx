"use client";
import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';

interface Note {
    id: number;
    timestamp: number;
    date: string;
    content: string;
}

interface VideoPlayerProps {
    videoId: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId }) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [newNote, setNewNote] = useState('');
    const playerRef = useRef<any>(null);
    // console.log(videoId)

    useEffect(() => {
        const storedNotes = localStorage.getItem(`notes-${videoId}`);
        if (storedNotes) {
            setNotes(JSON.parse(storedNotes));
        } else {
            setNotes([]);
        }
    }, [videoId]);
    console.log(notes)
    const handleSaveNote = async () => {
        const timestamp = await playerRef.current.internalPlayer.getCurrentTime();
        const date = new Date().toLocaleString();
        const newNoteObject = { id: Date.now(), timestamp, date, content: newNote };
        const updatedNotes = [...notes, newNoteObject];
        setNotes(updatedNotes);
        localStorage.setItem(`notes-${videoId}`, JSON.stringify(updatedNotes));
        setNewNote('');
    };

    const handleDeleteNote = (id: number) => {
        const updatedNotes = notes.filter(note => note.id !== id);
        setNotes(updatedNotes);
        localStorage.setItem(`notes-${videoId}`, JSON.stringify(updatedNotes));
    };

    const handleSeekToTimestamp = (timestamp: number) => {
        playerRef.current.internalPlayer.seekTo(timestamp, true);
    };

    return (
        <div className={"container"}>
            <YouTube videoId={videoId} ref={playerRef} />
            <div className={"notes"}>
                <h3>Notes</h3>
                <ul>
                    {notes.map(note => (
                        <li key={note.id} className={"note"}>
                            <span onClick={() => handleSeekToTimestamp(note.timestamp)} style={{ cursor: 'pointer' }}>
                                [{new Date(note.timestamp *1000).toISOString()}]
                            </span>
                            <span>{note.content} (Created on: {note.date})</span>
                            <button onClick={() => handleDeleteNote(note.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
                <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note"
                />
                <button onClick={handleSaveNote}>Save Note</button>
            </div>
        </div>
    );
};

export default VideoPlayer;
