"use client";
import React, { useEffect, useState } from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import { Input } from '@/components/ui/input';

const Home: React.FC = () => {
  const [videoId, setVideoId] = useState(''); // Default video ID

  const handleVideoIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoId(e.target.value);
  };

  return (
    <div >

      <h1 className='p-8  text-[#101828] text-3xl font-semibold '>Video Player with Notes</h1>
      <div className='w-full flex items-end px-8 mb-5'>
        <Input
          className='items-end justify-end flex w-fit '
          type="text"
          value={videoId}
          onChange={handleVideoIdChange}
          placeholder="Enter YouTube Video ID"
        />
      </div>
      {/* <VideoPlayer videoId={videoId} /> */}
      <div className='2xl:block hidden'>
        {videoId && <VideoPlayer videoId={videoId} width={1376} height={774} />}
      </div>
      <div className='md:block hidden'>
        {videoId && <VideoPlayer videoId={videoId} width={1200} height={500} />}
      </div>

    </div>
  );
};

export default Home;
