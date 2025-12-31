'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

interface SwipeButtonProps {
    onComplete: () => void;
}

const BUTTON_WIDTH = 100;
const BUTTON_HEIGHT = 350;
const BUTTON_PADDING = 10;
const SWIPEABLE_SIZE = BUTTON_WIDTH - 2 * BUTTON_PADDING;
const SWIPE_RANGE = BUTTON_HEIGHT - 2 * BUTTON_PADDING - SWIPEABLE_SIZE;

export default function SwipeButton({ onComplete }: SwipeButtonProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const swipeableRef = useRef<HTMLDivElement>(null);
    const waveRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const draggableInstanceRef = useRef<Draggable[] | null>(null);

    useEffect(() => {
        if (!swipeableRef.current || !waveRef.current || !textRef.current) return;

        const swipeable = swipeableRef.current;
        const wave = waveRef.current;
        const text = textRef.current;

        // Create draggable instance - VERTICAL (y-axis)
        draggableInstanceRef.current = Draggable.create(swipeable, {
            type: 'y',
            bounds: { minY: -SWIPE_RANGE, maxY: 0 }, // Negative because we go UP
            inertia: false,
            onDrag: function () {
                const progress = Math.abs(this.y) / SWIPE_RANGE; // Use absolute value

                // Update wave height and opacity
                gsap.set(wave, {
                    height: SWIPEABLE_SIZE + Math.abs(this.y),
                    opacity: progress,
                });

                // Update circle color from orange to purple
                gsap.set(swipeable, {
                    backgroundColor: gsap.utils.interpolate('#ff5100', '#5c0f8b', progress),
                });

                // Update text opacity
                gsap.set(text, {
                    opacity: 0.7 - progress * 0.7,
                });
            },
            onDragEnd: function () {
                const threshold = SWIPE_RANGE / 2;

                if (Math.abs(this.y) > threshold) {
                    // Complete the swipe
                    gsap.to(swipeable, {
                        y: -SWIPE_RANGE,
                        duration: 0.3,
                        ease: 'power2.out',
                        onUpdate: () => {
                            const progress = Math.abs(gsap.getProperty(swipeable, 'y') as number) / SWIPE_RANGE;
                            gsap.set(wave, {
                                height: SWIPEABLE_SIZE + (progress * SWIPE_RANGE),
                                opacity: progress,
                            });
                            gsap.set(swipeable, {
                                backgroundColor: gsap.utils.interpolate('#ff5100', '#5c0f8b', progress),
                            });
                            gsap.set(text, {
                                opacity: 0.7 - progress * 0.7,
                            });
                        },
                        onComplete: () => {
                            onComplete();
                        },
                    });
                } else {
                    // Snap back to bottom
                    gsap.to(swipeable, {
                        y: 0,
                        duration: 0.4,
                        ease: 'back.out(1.7)',
                        onUpdate: () => {
                            const progress = Math.abs(gsap.getProperty(swipeable, 'y') as number) / SWIPE_RANGE;
                            gsap.set(wave, {
                                height: SWIPEABLE_SIZE + (progress * SWIPE_RANGE),
                                opacity: progress,
                            });
                            gsap.set(swipeable, {
                                backgroundColor: gsap.utils.interpolate('#ff5100', '#5c0f8b', progress),
                            });
                            gsap.set(text, {
                                opacity: 0.7 - progress * 0.7,
                            });
                        },
                    });
                }
            },
        });

        // Sequential blinking animation for chevron arrows (1 -> 2 -> 3 -> repeat)
        const arrows = containerRef.current?.querySelectorAll('.chevron-arrow');
        if (arrows) {
            // Set initial state - all invisible
            gsap.set(arrows, { opacity: 0 });

            // Create timeline for sequential appearance (BOTTOM to TOP)
            const tl = gsap.timeline({ repeat: -1 });

            // Show bottom arrow (3rd) first
            tl.to(arrows[2], { opacity: 1, duration: 0.3 })
                .to(arrows[2], { opacity: 1, duration: 0.2 })
                // Show middle arrow (2nd)
                .to(arrows[1], { opacity: 1, duration: 0.3 }, '-=0.1')
                .to([arrows[2], arrows[1]], { opacity: 1, duration: 0.2 })
                // Show top arrow (1st)
                .to(arrows[0], { opacity: 1, duration: 0.3 }, '-=0.1')
                .to(arrows, { opacity: 1, duration: 0.3 })
                // Hide all and restart
                .to(arrows, { opacity: 0, duration: 0.3 })
                .to({}, { duration: 0.3 }); // Pause before repeat
        }

        return () => {
            if (draggableInstanceRef.current) {
                draggableInstanceRef.current[0].kill();
            }
        };
    }, [onComplete]);

    return (
        <div className="relative flex items-center justify-center">
            <div
                ref={containerRef}
                className="relative overflow-hidden bg-white rounded-full flex items-center justify-center"
                style={{
                    width: BUTTON_WIDTH,
                    height: BUTTON_HEIGHT,
                    padding: BUTTON_PADDING,
                }}
            >
                {/* Color Wave - starts from BOTTOM */}
                <div
                    ref={waveRef}
                    className="absolute bottom-0 w-full rounded-full bg-gradient-to-t from-primary-orange to-primary-purple"
                    style={{
                        height: SWIPEABLE_SIZE,
                        opacity: 0,
                    }}
                />

                {/* Swipeable Circle - starts at BOTTOM */}
                <div
                    ref={swipeableRef}
                    className="absolute bottom-[10px] z-10 rounded-full cursor-grab active:cursor-grabbing shadow-lg"
                    style={{
                        width: SWIPEABLE_SIZE,
                        height: SWIPEABLE_SIZE,
                        backgroundColor: '#ff5100', // Start with orange at BOTTOM
                    }}
                />

                {/* Chevron Arrows - pointing UP with sequential animation */}
                <div
                    ref={textRef}
                    className="absolute z-[5] flex flex-col items-center gap-2"
                    style={{
                        opacity: 0.7,
                    }}
                >
                    <div className="chevron-arrow text-primary-purple text-4xl font-bold leading-none">^</div>
                    <div className="chevron-arrow text-primary-purple text-4xl font-bold leading-none">^</div>
                    <div className="chevron-arrow text-primary-purple text-4xl font-bold leading-none">^</div>
                </div>
            </div>
        </div>
    );
}
