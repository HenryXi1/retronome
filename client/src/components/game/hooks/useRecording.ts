import { useState, useRef, useEffect } from 'react';

// Generic recording hook that can be used by any game type
export const useRecording = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
    const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(30);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Timer effect
    useEffect(() => {
        if (isRecording && timeLeft > 0) {
            timerRef.current = setTimeout(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isRecording) {
            stopRecording();
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [isRecording, timeLeft]);

    const startRecording = async (maxTime: number = 30) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
            mediaRecorderRef.current = mediaRecorder;

            const chunks: BlobPart[] = [];
            mediaRecorder.ondataavailable = (event) => {
                chunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                setRecordedAudio(blob);
                setCurrentAudioUrl(URL.createObjectURL(blob));
                setIsRecording(false);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setTimeLeft(maxTime);
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
        }
    };

    const resetRecording = (maxTime: number = 30) => {
        setRecordedAudio(null);
        setCurrentAudioUrl(null);
        setTimeLeft(maxTime);
        setIsRecording(false);
    };

    const playAudio = (url: string) => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.play();
    };

    // Call the reverse API to get reversed audio
    const reverseAudio = async (audioBlob: Blob): Promise<string> => {
        try {
            const formData = new FormData();
            formData.append('file', audioBlob, 'recording.webm');

            const response = await fetch('http://localhost:8000/reverse/', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to reverse audio');
            }

            const reversedBlob = await response.blob();
            return URL.createObjectURL(reversedBlob);
        } catch (error) {
            console.error('Error reversing audio:', error);
            throw error;
        }
    };

    return {
        // State
        isRecording,
        recordedAudio,
        currentAudioUrl,
        timeLeft,

        // Actions
        startRecording,
        stopRecording,
        resetRecording,
        playAudio,
        reverseAudio,

        // Refs (for cleanup)
        mediaRecorderRef,
        audioRef
    };
};
