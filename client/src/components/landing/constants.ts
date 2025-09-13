export interface GameModeInfo {
    title: string;
    description: string;
    instructions: string[];
}

export interface TimerOption {
    value: number;
    label: string;
}

export const GAME_MODE_INFO: Record<'local' | 'online-multiplayer', GameModeInfo> = {
    local: {
        title: 'Local Play',
        description: 'Perfect for couch co-op gaming!',
        instructions: [
            'Sit together with a friend',
            'Take turns recording song snippets',
            'Listen to the reversed audio',
            'Try to guess each other\'s songs',
            'See who can guess the most correctly!'
        ]
    },
    'online-multiplayer': {
        title: 'Online Multiplayer',
        description: 'Up to 8 players in the chaos!',
        instructions: [
            'Join with up to 8 friends',
            'Everyone records a song snippet',
            'Audio gets passed around and reversed',
            'Watch the chaos unfold',
            'See how badly the songs get distorted!'
        ]
    }
};

export const TIMER_OPTIONS: TimerOption[] = [
    { value: 30, label: '30 seconds' },
    { value: 45, label: '45 seconds' },
    { value: 60, label: '1 minute' },
    { value: 75, label: '1:15' },
    { value: 90, label: '1:30' }
];
