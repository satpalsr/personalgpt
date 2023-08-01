'use client'
import React, { useEffect, useState } from 'react';
import { getSources } from '@/utils/localStorage';

export interface SourceList {
  sources: any;
}

export function SourceBlock({ sources, ...props }: SourceList) {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log(`sources chatid ${sources}`)
        // Assuming getSources is a function that fetches data from an API
        const sourcesData = await getSources(sources);
        // console.log(`sourcesData: ${JSON.stringify(sourcesData)}`);
        // const parsedData = JSON.parse(sourcesData);
        setVideos(sourcesData);
      } catch (error) {
        // Handle errors here if necessary
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [sources]);

  return (
    <div className='relative mx-auto max-w-2xl px-4 mb-4'>
  <h1 className="mb-2 text-lg font-semibold">Video Sources</h1>
  {/* Show loading if videos length is 0 */}
  {videos.length === 0 ? (
    <p>Loading...</p>
  )
   : (
    <ol>
      {videos.map((video: any, index: any) => (
        <li key={video.title} className="flex items-center space-x-4">
          <img src={video.thumbnail} alt={video.title} className=" mt-2 mb-2" />
          <div>
            <p className="mb-1">
              {index + 1}.{" "}
              <a
                className='underline'
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {video.title}
              </a>
            </p>
          </div>
        </li>
      ))}
    </ol>
  )}
</div>
  );
}