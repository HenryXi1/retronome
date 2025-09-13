import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

interface GameModeCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
    color: string;
    hoverColor: string;
}

const GameModeCard: React.FC<GameModeCardProps> = ({
    title,
    description,
    icon,
    onClick,
    color,
    hoverColor
}) => {
    return (
        <Card
            hoverable
            onClick={onClick}
            style={{
                background: `linear-gradient(135deg, ${color} 0%, ${hoverColor} 100%)`,
                border: 'none',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div>
                    {icon}
                </div>
                <div>
                    <Title level={3} style={{
                        color: 'white',
                        marginBottom: '8px',
                        marginTop: '8px',
                        fontSize: '1.5rem',
                        fontWeight: 'bold'
                    }}>
                        {title}
                    </Title>
                    <Paragraph style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '1.125rem',
                        marginBottom: 0,
                        fontWeight: '500'
                    }}>
                        {description}
                    </Paragraph>
                </div>
            </div>
        </Card>
    );
};

export default GameModeCard;
