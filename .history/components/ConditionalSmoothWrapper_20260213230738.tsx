'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export default function ConditionalSmoothWrapper({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    // Don't use ScrollSmoother for routes that should use native scrolling
    const disableSmoothScroll = pathname?.startsWith('/admin') || pathname === '/shortlisted-teams';

    if (disableSmoothScroll) {
        return <>{children}</>;
    }

    return (
        <div id="smooth-wrapper">
            <div id="smooth-content">
                {children}
            </div>
        </div>
    );
}
