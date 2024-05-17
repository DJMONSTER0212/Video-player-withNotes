"use client";
import React, { useState } from 'react';
import VideoPlayer from '@/components/VideoPlayer';

const Home: React.FC = () => {
  const [videoId, setVideoId] = useState(''); // Default video ID

  const handleVideoIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoId(e.target.value);
  };

  return (
    <div>
      <h1>YouTube Notes App</h1>
      <input
        type="text"
        value={videoId}
        onChange={handleVideoIdChange}
        placeholder="Enter YouTube Video ID"
      />
      <VideoPlayer videoId={videoId} />
    </div>
  );
};

export default Home;
