import React from 'react';

interface CircularTimerProps {
    timeLeft: number;
    maxTime: number;
    radius?: number;
    strokeWidth?: number;
}

const CircularTimer: React.FC<CircularTimerProps> = ({
    timeLeft,
    maxTime,
    radius = 60,
    strokeWidth = 8
}) => {
    const progressPercent = (timeLeft / maxTime) * 100;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <svg
                height={radius * 2}
                width={radius * 2}
                style={{ transform: 'rotate(-90deg)' }}
            >
                <circle
                    stroke="rgba(59, 130, 246, 0.2)"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <circle
                    stroke={timeLeft <= 10 ? '#ef4444' : '#3b82f6'}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    style={{ strokeDashoffset }}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </svg>
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: timeLeft <= 10 ? '#ef4444' : '#1e293b'
            }}>
                {timeLeft}s
            </div>
        </div>
    );
};

export default CircularTimer;
