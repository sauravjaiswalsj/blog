import React from 'react';

export default function Definition({ children }) {
  return (
    <div style={{
      borderLeft: '4px solid #2e8555',
      padding: '0.75em 1em',
      background: '#f6fdf9',
      margin: '1em 0'
    }}>
      <strong>Def.</strong> {children}
    </div>
  );
}
