"use client";
import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button';
import { PlusCircleIcon } from 'lucide-react';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import NoteCard from './NoteCard';

interface Note {
    id: number;
    timestamp: number;
    date: string;
    content: string;
}

interface VideoPlayerProps {
    videoId: string;
    height: number;
    width: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, width, height }) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [newNote, setNewNote] = useState('');
    const playerRef = useRef<any>(null);
    const [showFullText, setShowFullText] = useState(false);
    const [videotitle, setVideoTitle] = useState("")
    const [videoDesc, setVideoDesc] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [EditingNodeText,setEditingNoteText] = useState("");

    useEffect(() => {
        const storedNotes = localStorage.getItem(`notes-${videoId}`);
        if (storedNotes) {
            setNotes(JSON.parse(storedNotes));
        } else {
            setNotes([]);
        }
    }, [videoId]);
    // console.log(notes)
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
    const handleEditNote = (index: number)=>{
        let temp = notes;
        // console.log(temp[index].content);
        temp[index].content = EditingNodeText
        // console.log(temp[index].content);
        // console.log(temp[index])
        setNotes(temp);
        localStorage.setItem(`notes-${videoId}`, JSON.stringify(temp));
        setIsEditing(false);
    }
    const handleSeekToTimestamp = (timestamp: number) => {
        playerRef.current.internalPlayer.seekTo(timestamp, true);
    };
    const videoOptions = {
        height: height.toString(),
        width: width.toString(),

    }
    const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

    useEffect(() => {
        const fetchVideoDetails = async () => {
            if (!videoId) return;
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`
            );
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                setVideoTitle(data.items[0].snippet.title);
                setVideoDesc(data.items[0].snippet.description);
            }
        };

        fetchVideoDetails();
    }, [videoId]);
    const toggleShowFullText = () => {
        setShowFullText(!showFullText);
    };

    const renderText = () => {
        if (
            videoDesc &&
            videoDesc.split(" ").length > 100 &&
            !showFullText
        ) {
            return videoDesc.split(" ").slice(0, 100).join(" ") + "...";
        } else {
            return videoDesc;
        }
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
    return (
        <div className={"px-8 p-2"}>
            <div>
                <YouTube opts={videoOptions} videoId={videoId} ref={playerRef} />
                <div className='flex-col flex mt-4 gap-1'>
                    <h1 className='font-semibold text-lg'>{videotitle}</h1>
                    <p className='font-normal text-sm text-[#475467]'>
                        {renderText()?.replace(/\\n/g, '\n')}
                        {videoDesc && videoDesc.length > 100 && (
                            <button
                                onClick={toggleShowFullText}
                                className=" text-sm text-blue-600"
                            >
                                {showFullText ? "Read Less" : "Read More"}
                            </button>
                        )}
                    </p>
                </div>
            </div>
            <Card className='rounded-xl my-5 pb-6'>
                <CardHeader className='flex flex-col w-full'>
                    <div className='flex w-full flex-row justify-between'>
                        <div>
                            <CardTitle className='font-semibold text-lg text-[#101828]'>My notes</CardTitle>
                            <CardDescription className='font-normal text-[#475467] text-sm'>All your notes at single place. Click on any note to go to specific timestamp in the video</CardDescription>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger><Button variant={'outline'} className='text-sm font-semibold gap-1 text-[#344054]'><PlusCircleIcon className='text-[#667085]' size={20} /> Add new note</Button></AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Add new note</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        <Input
                                            value={newNote}
                                            className='text-black font-medium'
                                            onChange={(e) => setNewNote(e.target.value)}
                                            placeholder="Description"
                                        />
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setNewNote("")}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleSaveNote}>Save note</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>

                    <Separator />
                </CardHeader>
                <CardDescription>
                    <div>
                        {notes.map((note,index):any => (
                            <div key={note.id} className='px-6' >
                                <NoteCard note={note} index={index} notes={notes} setNotes={setNotes} videoId={videoId} playerRef={playerRef} />
                                <Separator />
                            </div>
                        ))}
                    </div>
                </CardDescription>
            </Card>
        </div>
    );
};

export default VideoPlayer;