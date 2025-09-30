import React from 'react';
import './index.css'

function SimpleApp() {
  return (
    <div style={{ 
      backgroundColor: '#0D0D0D', 
      color: '#EAEAEA', 
      minHeight: '100vh', 
      padding: '20px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        📚 BookBarn Test
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
        ✅ React is working!
      </p>
      <p style={{ fontSize: '1rem', color: '#B0B0B0' }}>
        If you see this page, the basic app structure is functional.
      </p>
      <button 
        style={{
          backgroundColor: '#00ADB5',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '8px',
          marginTop: '20px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
        onClick={() => alert('Button works!')}
      >
        Test Button
      </button>
    </div>
  );
}

export default SimpleApp;