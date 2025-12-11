'use client';

import { useEffect } from 'react';

interface DevfolioButtonProps {
  hackathonSlug?:  string;
}

export default function DevfolioButton({ hackathonSlug = "ghrhack2" }: DevfolioButtonProps) {
  useEffect(() => {
    // Load the Devfolio SDK script
    const script = document.createElement('script');
    script.src = 'https://apply.devfolio.co/v2/sdk.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // Cleanup:  remove script when component unmounts
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div
      className="apply-button"
      data-hackathon-slug={hackathonSlug}
      data-button-theme="light"
      style={{ height: '44px', width: '312px' }}
    />
  );
}
