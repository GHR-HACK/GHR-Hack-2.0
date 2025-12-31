'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface VideoContextType {
    hasStarted: boolean;
    videoEnded: boolean;
    setHasStarted: (value: boolean) => void;
    setVideoEnded: (value: boolean) => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: ReactNode }) {
    const [hasStarted, setHasStarted] = useState(false);
    const [videoEnded, setVideoEnded] = useState(false);

    return (
        <VideoContext.Provider value={{ hasStarted, videoEnded, setHasStarted, setVideoEnded }}>
            {children}
        </VideoContext.Provider>
    );
}

export function useVideo() {
    const context = useContext(VideoContext);
    if (context === undefined) {
        throw new Error('useVideo must be used within a VideoProvider');
    }
    return context;
}
