import React from 'react';

const MasterToolbar = ({ selectedEdition, setSelectedEdition, totalPages, currentPage, setCurrentPage }) => {
  return (
    <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '15px', border: '1px solid #ddd' }}>
      <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '16px', color: '#333' }}>
        🛠️ మాస్టర్ లేఅవుట్ కంట్రోల్స్ (Master Layout Controls)
      </h3>
      
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <label style={{ fontWeight: 'bold', marginRight: '8px', fontSize: '14px' }}>ఎడిషన్ రకం:</label>
          <select 
            value={selectedEdition} 
            onChange={(e) => setSelectedEdition(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="main">మెయిన్ ఎడిషన్ (Main Edition)</option>
            <option value="district">డిస్ట్రిక్ట్ టాబ్లాయిడ్ (District Special)</option>
            <option value="special">అర్థచంద్ర స్పెషల్ (Special Layout)</option>
          </select>
        </div>

        <div>
          <label style={{ fontWeight: 'bold', marginRight: '8px', fontSize: '14px' }}>పేజీ ఎంపిక:</label>
          <select 
            value={currentPage} 
            onChange={(e) => setCurrentPage(Number(e.target.value))}
            style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <option key={page} value={page}>
                పేజీ {page} / {totalPages}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default MasterToolbar;