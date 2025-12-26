const timelineData = [
  {
    step: 1,
    title: "Registration Starts",
    date: "1 January 2026",
    description: "Registration opens for all participants.",
    position: "right" as const,
  },
  {
    step: 2,
    title: "Application Deadline",
    date: "31 January 2026",
    description: "Last date to submit your application and confirm participation.",
    position: "left" as const,
  },
  {
    step: 3,
    title: "Announcement of Shortlisted Teams",
    date: "14 February 2026",
    description: "Selected teams will be notified via email and official channels.",
    position: "right" as const,
  },
  {
    step: 4,
    title: "Inauguration & Opening Ceremony",
    date: "28 February 2026 | 9:00 AM",
    description: "Formal inauguration, welcome address, and briefing.",
    position: "left" as const,
  },
  {
    step: 5,
    title: "Hackathon Begins (30 Hours)",
    date: "28 February 2026 | 11:00 AM",
    description: "The 30-hour hackathon officially kicks off.",
    position: "right" as const,
  },
  {
    step: 6,
    title: "Hackathon Ends",
    date: "1 March 2026 | 5:00 PM (30 hours)",
    description: "Final submissions and project wrap-up.",
    position: "left" as const,
  },
  {
    step: 7,
    title: "Award Ceremony & Closing",
    date: "1 March 2026 | Evening",
    description: "Results announcement, prize distribution, and closing remarks.",
    position: "right" as const,
  },
];

const EventTimeline = () => {
  const stepHeight = 160;
  const totalHeight = timelineData.length * stepHeight + 60;
  const centerX = 300;
  const leftX = 180;
  const rightX = 420;
  const circleRadius = 28;

  // Generate continuous snake path connecting all circles
  const generatePath = () => {
    const positions = [
      { x: centerX, y: 10 }, // Step 1 - center top
      { x: leftX, y: 50 + stepHeight }, // Step 2 - left
      { x: rightX, y: 50 + stepHeight * 2 }, // Step 3 - right
      { x: leftX, y: 50 + stepHeight * 3 }, // Step 4 - left
      { x: rightX, y: 50 + stepHeight * 4 }, // Step 5 - right
      { x: leftX, y: 50 + stepHeight * 5 }, // Step 6 - left
      { x: rightX, y: 50 + stepHeight * 6 }, // Step 7 - right
    ];

    let path = `M${positions[0].x} ${positions[0].y + circleRadius}`;

    for (let i = 0; i < positions.length - 1; i++) {
      const start = positions[i];
      const end = positions[i + 1];
      const curveRadius = 40;

      // Go down from current circle
      const downY = start.y + circleRadius + 20;
      path += ` L${start.x} ${downY}`;

      // Curve horizontally to the next column
      if (start.x < end.x) {
        // Going left to right
        path += ` Q${start.x} ${downY + curveRadius} ${start.x + curveRadius} ${downY + curveRadius}`;
        path += ` L${end.x - curveRadius} ${downY + curveRadius}`;
        path += ` Q${end.x} ${downY + curveRadius} ${end.x} ${downY + curveRadius * 2}`;
      } else {
        // Going right to left
        path += ` Q${start.x} ${downY + curveRadius} ${start.x - curveRadius} ${downY + curveRadius}`;
        path += ` L${end.x + curveRadius} ${downY + curveRadius}`;
        path += ` Q${end.x} ${downY + curveRadius} ${end.x} ${downY + curveRadius * 2}`;
      }

      // Go down to the next circle
      path += ` L${end.x} ${end.y - circleRadius}`;
    }

    return path;
  };

  // Mobile snake path
  const generateMobilePath = () => {
    const mobileLeftX = 40;
    const mobileRightX = 80;
    const positions = [
      { x: 75, y: 50 },
      { x: mobileLeftX, y: 50 + stepHeight },
      { x: mobileRightX, y: 50 + stepHeight * 2 },
      { x: mobileLeftX, y: 50 + stepHeight * 3 },
      { x: mobileRightX, y: 50 + stepHeight * 4 },
      { x: mobileLeftX, y: 50 + stepHeight * 5 },
      { x: mobileRightX, y: 50 + stepHeight * 6 },
    ];

    let path = `M${positions[0].x} ${positions[0].y + circleRadius}`;

    for (let i = 0; i < positions.length - 1; i++) {
      const start = positions[i];
      const end = positions[i + 1];
      const curveRadius = 20;

      const downY = start.y + circleRadius + 15;
      path += ` L${start.x} ${downY}`;

      if (start.x < end.x) {
        path += ` Q${start.x} ${downY + curveRadius} ${start.x + curveRadius} ${downY + curveRadius}`;
        path += ` L${end.x - curveRadius} ${downY + curveRadius}`;
        path += ` Q${end.x} ${downY + curveRadius} ${end.x} ${downY + curveRadius * 2}`;
      } else {
        path += ` Q${start.x} ${downY + curveRadius} ${start.x - curveRadius} ${downY + curveRadius}`;
        path += ` L${end.x + curveRadius} ${downY + curveRadius}`;
        path += ` Q${end.x} ${downY + curveRadius} ${end.x} ${downY + curveRadius * 2}`;
      }

      path += ` L${end.x} ${end.y - circleRadius}`;
    }
    return path;
  };

  const getCirclePosition = (index: number) => {
    const positions = [
      { x: centerX, y: 50 },
      { x: leftX, y: 50 + stepHeight },
      { x: rightX, y: 50 + stepHeight * 2 },
      { x: leftX, y: 50 + stepHeight * 3 },
      { x: rightX, y: 50 + stepHeight * 4 },
      { x: leftX, y: 50 + stepHeight * 5 },
      { x: rightX, y: 50 + stepHeight * 6 },
    ];
    return positions[index];
  };

  const getMobileCirclePosition = (index: number) => {
    const mobileLeftX = 40;
    const mobileRightX = 80;
    const positions = [
      { x: 75, y: 50 },
      { x: mobileLeftX, y: 50 + stepHeight },
      { x: mobileRightX, y: 50 + stepHeight * 2 },
      { x: mobileLeftX, y: 50 + stepHeight * 3 },
      { x: mobileRightX, y: 50 + stepHeight * 4 },
      { x: mobileLeftX, y: 50 + stepHeight * 5 },
      { x: mobileRightX, y: 50 + stepHeight * 6 },
    ];
    return positions[index];
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto py-8 px-4 overflow-hidden font-redhat">
      {/* Desktop Timeline */}
      <div className="hidden md:block relative" style={{ height: totalHeight }}>
        {/* SVG for connecting snake lines - 3 parallel lines with gaps */}
        <svg
          className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
          width="600"
          height={totalHeight}
          viewBox={`0 0 600 ${totalHeight}`}
          fill="none"
        >
          {/* Fallback color for timeline line if CSS variable is missing */}
          {[-6, 0, 6].map((offset, idx) => (
            <path
              key={idx}
              d={generatePath()}
              stroke="hsl(var(--timeline-line,220,10%,60%))"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transform: `translate(${offset}px, 0)` }}
            />
          ))}
        </svg>

        {/* Timeline items */}
        {timelineData.map((item, index) => {
          const pos = getCirclePosition(index);
          const isRight = item.position === "right";

          return (
            <div
              key={item.step}
              className="absolute flex items-center"
              style={{
                top: pos.y - circleRadius,
                left: "50%",
                transform: "translateX(-50%)",
                width: "600px",
              }}
            >
              {/* Left Content */}
              {!isRight && (
                <div
                  className="absolute text-right pr-8"
                  style={{
                    right: `${600 - pos.x + circleRadius + 10}px`,
                    width: "200px",
                  }}
                >
                  <h3 className="text-base font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mb-1">{item.date}</p>
                  <p className="text-muted-foreground text-sm leading-tight">{item.description}</p>
                </div>
              )}

              {/* Circle */}
              <div
                className="absolute flex items-center justify-center rounded-full bg-timeline-circle text-primary-foreground font-bold text-xl shadow-lg z-10"
                style={{
                  left: pos.x - circleRadius,
                  width: circleRadius * 2,
                  height: circleRadius * 2,
                  background: 'var(--timeline-circle-bg, #e9d8fd)', // fallback for bg-timeline-circle
                  color: 'var(--timeline-circle-fg, #22223b)', // fallback for text-primary-foreground
                }}
              >
                {item.step}
              </div>

              {/* Right Content */}
              {isRight && (
                <div
                  className="absolute text-left pl-8"
                  style={{
                    left: `${pos.x + circleRadius + 10}px`,
                    width: "200px",
                  }}
                >
                  <h3 className="text-base font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mb-1">{item.date}</p>
                  <p className="text-muted-foreground text-sm leading-tight">{item.description}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Timeline */}
      <div className="md:hidden relative" style={{ height: totalHeight }}>
        {/* SVG for snake connecting lines on mobile */}
        <svg
          className="absolute top-0 left-0 pointer-events-none"
          width="120"
          height={totalHeight}
          viewBox={`0 0 120 ${totalHeight}`}
          fill="none"
        >
          {/* Fallback color for timeline line if CSS variable is missing */}
          {[-4, 0, 4].map((offset, idx) => (
            <path
              key={idx}
              d={generateMobilePath()}
              stroke="hsl(var(--timeline-line,220,10%,60%))"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transform: `translate(${offset}px, 0)` }}
            />
          ))}
        </svg>

        {/* Mobile Timeline items */}
        {timelineData.map((item, index) => {
          const pos = getMobileCirclePosition(index);
          return (
            <div
              key={item.step}
              className="absolute flex items-start gap-4"
              style={{
                top: pos.y - circleRadius,
                left: 0,
                right: 0,
              }}
            >
              {/* Circle */}
              <div
                className="flex-shrink-0 flex items-center justify-center rounded-full bg-timeline-circle text-primary-foreground font-bold text-lg shadow-lg z-10"
                style={{
                  width: circleRadius * 2,
                  height: circleRadius * 2,
                  marginLeft: pos.x - circleRadius,
                  background: 'var(--timeline-circle-bg, #e9d8fd)', // fallback for bg-timeline-circle
                  color: 'var(--timeline-circle-fg, #22223b)', // fallback for text-primary-foreground
                }}
              >
                {item.step}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1 pr-4" style={{ marginLeft: 100 - pos.x - circleRadius }}>
                <h3 className="text-sm font-bold text-foreground mb-0.5">{item.title}</h3>
                <p className="text-muted-foreground text-xs mb-0.5">{item.date}</p>
                <p className="text-muted-foreground text-xs leading-tight">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventTimeline;