import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const DeadlineCountdown = ({ targetDate, compact = false }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.expired) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        <Clock className="w-3.5 h-3.5 text-rose-500" />
        <span>Competition Closed</span>
      </span>
    );
  }

  if (compact) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 font-mono">
        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 font-sans" />
        <span>
          {timeLeft.days}d {timeLeft.hours}h left
        </span>
      </span>
    );
  }

  return (
    <div className="flex items-center space-x-1.5 sm:space-x-2">
      <div className="flex items-center space-x-1 font-mono">
        <div className="bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg text-center min-w-[42px] shadow-2xs">
          <span className="text-sm sm:text-base font-extrabold text-slate-900 block leading-tight">{timeLeft.days}</span>
          <span className="text-[9px] uppercase text-slate-500 font-sans font-semibold block">Days</span>
        </div>
        <span className="text-slate-400 font-bold text-xs">:</span>
        <div className="bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg text-center min-w-[42px] shadow-2xs">
          <span className="text-sm sm:text-base font-extrabold text-slate-900 block leading-tight">{timeLeft.hours}</span>
          <span className="text-[9px] uppercase text-slate-500 font-sans font-semibold block">Hrs</span>
        </div>
        <span className="text-slate-400 font-bold text-xs">:</span>
        <div className="bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg text-center min-w-[42px] shadow-2xs">
          <span className="text-sm sm:text-base font-extrabold text-slate-900 block leading-tight">{timeLeft.minutes}</span>
          <span className="text-[9px] uppercase text-slate-500 font-sans font-semibold block">Min</span>
        </div>
        <span className="text-slate-400 font-bold text-xs">:</span>
        <div className="bg-indigo-50 border border-indigo-200 px-2.5 py-1.5 rounded-lg text-center min-w-[42px] shadow-2xs">
          <span className="text-sm sm:text-base font-extrabold text-indigo-700 block leading-tight">{timeLeft.seconds}</span>
          <span className="text-[9px] uppercase text-indigo-600 font-sans font-semibold block">Sec</span>
        </div>
      </div>
    </div>
  );
};
