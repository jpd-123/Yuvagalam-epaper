import React from 'react';

export default function EditorialToolbar({ onAddNewsBox }) {
  return (
    <div style={{
      backgroundColor: '#f8fafc',
      padding: '12px 20px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      flexWrap: 'wrap'
    }}>
      <button
        onClick={() => onAddNewsBox('main')}
        style={{
          backgroundColor: '#2563eb',
          color: '#fff',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '5px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        ➕ ప్రధాన వార్త (Main News)
      </button>

      <button
        onClick={() => onAddNewsBox('box')}
        style={{
          backgroundColor: '#16a34a',
          color: '#fff',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '5px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        ➕ బాక్స్ వార్త (Box Story)
      </button>
    </div>
  );
}