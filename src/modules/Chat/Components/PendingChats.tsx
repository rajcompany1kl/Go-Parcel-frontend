import React from 'react'
import type { PendingUser } from '../types';

const PendingChats: React.FC<{ p: PendingUser; accept: (userId: string, trackingId: string) => void }> = ({ p, accept }) => {
    return (
        <div key={p.userId} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 0',
            borderBottom: '1px solid #e5e7eb'
        }}>
            <div>
                <strong>{p.userName}</strong> <small style={{ color: '#6b7280' }}>({p.userId})</small>
            </div>
            <button
                onClick={() => accept(p.userId, p.trackingId)} 
                style={{
                    backgroundColor: '#3b82f6',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: 6,
                    cursor: 'pointer'
                }}
            >
                Accept
            </button>
        </div>
    )
}

export default PendingChats