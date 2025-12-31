'use client';

import { useVideo } from '@/lib/contexts/VideoContext';
import NavigationBar from './NavigationBar';

export default function ConditionalNav() {
    const { videoEnded } = useVideo();

    // Only show NavigationBar after video has ended
    if (!videoEnded) {
        return null;
    }

    return <NavigationBar />;
}
