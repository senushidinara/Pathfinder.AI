import React from 'react';

interface ScoreRingProps {
  score: number;
}

const ScoreRing: React.FC<ScoreRingProps> = ({ score }) => {
    const circumference = 2 * Math.PI * 28; // r=28
    const offset = circumference - (score / 10) * circumference;
    const color = score > 7 ? 'stroke-green-400' : score > 4 ? 'stroke-yellow-400' : 'stroke-red-400';

    return (
      <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
        <svg className="absolute w-full h-full opacity-30">
          <circle className="stroke-indigo-500/50" strokeWidth="1" fill="transparent" r="38" cx="48" cy="48" />
          <circle className="stroke-indigo-500/50" strokeWidth="1" fill="transparent" r="44" cx="48" cy="48" />
        </svg>
        <svg className="absolute w-full h-full transform -rotate-90">
          <circle className="stroke-gray-700" strokeWidth="4" fill="transparent" r="28" cx="48" cy="48" />
          <circle
            className={`transition-all duration-1000 ease-out ${color}`}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            r="28"
            cx="48"
            cy="48"
          />
        </svg>
        <span className="text-4xl font-bold text-white z-10">{score}</span>
        <div className="absolute inset-0 bg-gray-900/40 rounded-full"></div>
      </div>
    );
};

export default ScoreRing;