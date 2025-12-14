'use client';

import { FileText } from 'lucide-react';
import Button from './Button';

interface TenderNoticeCardProps {
  title?: string;
  date?: string;
  onClickHere?: () => void;
}

export function ThemeCard({
  title = 'Divya Marathi Tender Notice',
  date = '28/08/25',
  onClickHere = () => console.log('Click Here clicked'),
}: TenderNoticeCardProps) {
  return (
    <div className="relative w-full max-w-[480px]">
      {/* PDF Icon Badge */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="bg-[#ff6b35] rounded-[20px] p-5 shadow-lg">
          <FileText className="h-10 w-10 text-white" strokeWidth={2} />
        </div>
      </div>

      {/* Main Card */}
      <div className="relative bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden pt-16 pb-10 px-10">
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <h2 className="text-black text-center text-xl font-normal leading-tight">{title}</h2>          
         
        </div>

        <div className="absolute bottom-0 right-0 w-full h-[200px] pointer-events-none">
          <svg
  width="100%"
  height="200"
  viewBox="0 0 480 200"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  className="absolute bottom-0 right-0"
  preserveAspectRatio="none"
>
  <path
    d="M0 120 
       C120 100, 200 140, 320 120 
       C440 100, 480 80, 480 0 
       L480 200 
       L0 200 
       Z"
    fill="#6b46c1"
    fill-opacity="0.1"
  />
</svg>
        </div>
      </div>
    </div>
  );
}
