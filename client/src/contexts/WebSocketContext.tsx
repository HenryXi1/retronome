import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { message } from 'antd';

interface WebSocketContextType {
  isConnected: boolean;
  sendMessage: (message: any) => void;
  addMessageHandler: (handler: (data: any) => void) => () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const wsRef = useRef<WebSocket | null>(null); // For cleanup only
  const messageHandlersRef = useRef<Set<(data: any) => void>>(new Set());

  const connectWebSocket = () => {
    // Close existing connection if any
    if (ws) {
      ws.close();
    }

    try {
      console.log('Creating new WebSocket connection...');
      const newWs = new WebSocket('ws://localhost:8000/game/');
      
      newWs.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setWs(newWs);
        wsRef.current = newWs; // Keep ref for cleanup
      };

      newWs.onmessage = (event) => {
        try {
          console.log('📥 RAW MESSAGE RECEIVED:', event.data);
          const data = JSON.parse(event.data);
          console.log('✅ PARSED MESSAGE:', data);
          
          // Notify all registered handlers
          messageHandlersRef.current.forEach(handler => {
            try {
              handler(data);
            } catch (error) {
              console.error('Error in message handler:', error);
            }
          });
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
        }
      };

      newWs.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
        setWs(null);
        wsRef.current = null;
      };

      newWs.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        setIsConnected(false);
        setWs(null);
        wsRef.current = null;
        
        // Only show warning for unexpected closes (not clean shutdowns)
        if (event.code !== 1000) {
          message.warning('Connection lost');
        }
      };
    } catch (error) {
      console.error('❌ Failed to create WebSocket connection:', error);
      setIsConnected(false);
      setWs(null);
      wsRef.current = null;
    }
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      console.log('🧹 Cleaning up WebSocket connection...');
      // Use ref for cleanup to avoid stale closure
      if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
        try {
          wsRef.current.close(1000, 'Component unmounting');
        } catch (error) {
          console.log('WebSocket already closed during cleanup');
        }
      }
    };
  }, []); // Only run once on mount

  const sendMessage = (messageData: any) => {
    if (!ws) {
      console.error('❌ WebSocket is not initialized');
      message.error('Not connected to server');
      return;
    }

    if (ws.readyState === WebSocket.OPEN) {
      try {
        const jsonMessage = JSON.stringify(messageData);
        console.log('🚀 SENDING MESSAGE:', messageData);
        console.log('📤 JSON length:', jsonMessage.length);
        
        ws.send(jsonMessage);
        console.log('✅ Message sent successfully');
      } catch (error) {
        console.error('❌ Error sending message:', error);
        message.error('Failed to send message');
      }
    } else if (ws.readyState === WebSocket.CONNECTING) {
      console.log('⏳ WebSocket is still connecting, please wait...');
      message.warning('Connecting to server, please wait...');
    } else {
      console.error('❌ WebSocket is not connected, state:', ws.readyState);
      message.error('Not connected to server. Please refresh the page.');
    }
  };

  const addMessageHandler = (handler: (data: any) => void) => {
    messageHandlersRef.current.add(handler);
    
    // Return cleanup function
    return () => {
      messageHandlersRef.current.delete(handler);
    };
  };

  const contextValue: WebSocketContextType = {
    isConnected,
    sendMessage,
    addMessageHandler,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
