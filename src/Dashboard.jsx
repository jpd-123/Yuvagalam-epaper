import React from 'react';

export default function Dashboard({ onSelectLayout, onCreateNewLayout, onOpenClippingEditor }) {
  const presetLayouts = [
    { id: 1, name: 'A3 మెయిన్ ఎడిషన్ (ఫ్రంట్ పేజీ)', size: 'A3', columns: 5, border: 'డబుల్ లైన్' },
    { id: 2, name: 'A3 డిస్ట్రిక్ట్ టాబ్లాయిడ్', size: 'A3', columns: 4, border: 'సింగిల్ లైన్' },
    { id: 3, name: 'Broadsheet క్లాసిక్ పేపర్', size: 'Broadsheet', columns: 8, border: 'డబుల్ లైన్' },
  ];

  return (
    <div style={{ padding: '30px', backgroundColor: '#0f172a', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      
      {/* టైటిల్ హెడర్ */}
      <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155', marginBottom: '25px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', color: '#f8fafc' }}>సాత్విక పబ్లిషర్స్ - డిజిటల్ పత్రికా మేకర్</h1>
        <p style={{ margin: '5px 0 0 0', color: '#94a3b8', fontSize: '14px' }}>మీ వార్తాపత్రిక మాస్టర్ లేఅవుట్ డిజైన్ చేయండి లేదా రోజువారీ వార్తలు ఫిల్ చేయండి.</p>
      </div>

      {/* ప్రధాన ఆప్షన్ల బటన్లు */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <button 
          onClick={onCreateNewLayout}
          style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '6px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}
        >
          ➕ కొత్త మాస్టర్ లేఅవుట్ డిజైన్ చేయండి (A3, Broadsheet)
        </button>

        <button 
          onClick={onOpenClippingEditor}
          style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '6px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}
        >
          📲 సింగిల్ న్యూస్ క్లిప్పింగ్ మేకర్ (PNG/Social Media)
        </button>
      </div>

      {/* సేవ్ చేసిన మాస్టర్ లేఅవుట్లు */}
      <h3 style={{ color: '#cbd5e1', marginBottom: '15px' }}>ప్రే-సెట్ మాస్టర్ లేఅవుట్లు (Saved Layouts)</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {presetLayouts.map((layout) => (
          <div key={layout.id} style={{ backgroundColor: '#1e293b', padding: '18px', borderRadius: '8px', border: '1px solid #334155' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#f1f5f9' }}>{layout.name}</h4>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '15px', lineHeight: '1.6' }}>
              <div>సైజు: {layout.size}</div>
              <div>కాలమ్స్: {layout.columns}</div>
              <div>బోర్డర్: {layout.border}</div>
            </div>
            <button 
              onClick={() => onSelectLayout(layout)}
              style={{ width: '100%', backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              ఈ లేఅవుట్‌లో వార్తలు రాయండి ➔
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
