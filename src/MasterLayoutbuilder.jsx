import React, { useState } from 'react';

export default function MasterLayoutbuilder({ onBackToDashboard }) {
  // 1. పేజీ ఆప్షన్స్
  const [pageSize, setPageSize] = useState('A3');
  const [borderStyle, setBorderStyle] = useState('double');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(4); // default 4 pages, expandable to 16

  // 2. లోగో కంట్రోల్స్ (మాక్సిమం వెడల్పు పెంచబడింది)
  const [logoUrl, setLogoUrl] = useState(null);
  const [logoWidth, setLogoWidth] = useState(500);
  const [logoHeight, setLogoHeight] = useState(90);

  // 3. హెడర్ (సంపుటి, సంచిక) ఐడెంటిటీ లైన్
  const [headerStyle, setHeaderStyle] = useState('style1');
  const [editionNo, setEditionNo] = useState('1');
  const [issueNo, setIssueNo] = useState('105');
  const [place, setPlace] = useState('అమరావతి');
  const [date, setDate] = useState('సోమవారం, 10 ఆగస్టు 2026');
  const [price, setPrice] = useState('5.00');

  // 4. బాటమ్ ప్రెస్ మార్కులు
  const [showBottomMarks, setShowBottomMarks] = useState(true);

  // 5. లేఅవుట్ సేవ్ మేనేజ్‌మెంట్
  const [layoutName, setLayoutName] = useState('యువగళం మెయిన్ మాస్టర్');

  // వాట్సాప్ / ఇమేజ్ పేస్ట్ హ్యాండ్లర్ (Ctrl + V)
  const handlePasteImage = (e) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let item of items) {
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          setLogoUrl(URL.createObjectURL(file));
          break;
        }
      }
    }
  };

  const handleLogoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogoUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSaveMasterLayout = () => {
    const masterData = {
      name: layoutName,
      pageSize,
      borderStyle,
      totalPages,
      logoUrl,
      logoWidth,
      logoHeight,
      headerStyle,
      editionNo,
      issueNo,
      place,
      date,
      price,
      showBottomMarks
    };
    alert(`${layoutName} మాస్టర్ లేఅవుట్ విజయవంతంగా సేవ్ అయ్యింది!`);
    console.log('Saved Master Layout:', masterData);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#0f172a', color: '#fff', fontFamily: 'sans-serif' }} onPaste={handlePasteImage}>
      
      {/* టాప్ నావిగేషన్ బార్ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', backgroundColor: '#1e293b', borderBottom: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {onBackToDashboard && (
            <button onClick={onBackToDashboard} style={{ backgroundColor: '#475569', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
              ⬅️ డాష్‌బోర్డ్
            </button>
          )}
          <h2 style={{ margin: 0, fontSize: '18px' }}>🛠️ సాత్విక మాస్టర్ లేఅవుట్ డిజైనర్</h2>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input 
            type="text" 
            value={layoutName} 
            onChange={(e) => setLayoutName(e.target.value)} 
            placeholder="మాస్టర్ పేరు ఎంటర్ చేయండి"
            style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #64748b', outline: 'none', color: '#000' }}
          />
          <button onClick={handleSaveMasterLayout} style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            💾 మాస్టర్ సేవ్ చేయండి
          </button>
        </div>
      </div>

      {/* మెయిన్ వర్క్‌స్పేస్ (ఎడమ వైపు టూల్‌బార్ + కుడి వైపు ప్రివ్యూ) */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* ఎడమవైపు టూల్‌బార్ */}
        <div style={{ width: '360px', backgroundColor: '#1e293b', padding: '20px', overflowY: 'auto', borderRight: '1px solid #334155' }}>
          
          {/* 1. పేపర్ సైజు ఎంపిక */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#93c5fd' }}>1. న్యూస్‌పేపర్ సైజ్ ఎంచుకోండి:</label>
            <select value={pageSize} onChange={(e) => setPageSize(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', backgroundColor: '#0f172a', color: '#fff', border: '1px solid #475569' }}>
              <option value="A3">A3 సైజ్ (Standard Digital)</option>
              <option value="Broadsheet">Broadsheet (Main Edition)</option>
              <option value="Tabloid">Tabloid (District Edition)</option>
              <option value="SingleCard">Single News Card (Social Media)</option>
            </select>
          </div>

          {/* 2. బోర్డర్ స్టైల్ ఎంపిక */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#93c5fd' }}>2. పేపర్ బోర్డర్ డిజైన్:</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setBorderStyle('single')}
                style={{ flex: 1, padding: '8px', border: borderStyle === 'single' ? '2px solid #2563eb' : '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
              >
                సింగిల్ లైన్
              </button>
              <button 
                onClick={() => setBorderStyle('double')}
                style={{ flex: 1, padding: '8px', border: borderStyle === 'double' ? '2px solid #2563eb' : '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
              >
                డబుల్ లైన్
              </button>
            </div>
          </div>

          {/* 3. లోగో సెట్టింగ్స్ & వాట్సాప్ డైరెక్ట్ పేస్ట్ */}
          <div style={{ marginBottom: '20px', backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px', border: '1px solid #334155' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#93c5fd' }}>
              3. పత్రిక లోగో (Top Header):
            </label>
            
            {/* ఫైల్ ద్వారా అప్‌లోడ్ */}
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>ఆప్షన్ 1: ఫైల్ ఎంచుకోండి</span>
              <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ fontSize: '12px', width: '100%' }} />
            </div>

            {/* వాట్సాప్ డైరెక్ట్ పేస్ట్ (Ctrl + V) */}
            <div style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>ఆప్షన్ 2: వాట్సాప్ నుండి డైరెక్ట్ పేస్ట్</span>
              <div 
                tabIndex={0}
                onPaste={handlePasteImage}
                style={{
                  border: '2px dashed #3b82f6',
                  backgroundColor: '#1e293b',
                  padding: '10px',
                  textAlign: 'center',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: '#60a5fa',
                  outline: 'none'
                }}
              >
                📋 వాట్సాప్ లోగో కాపీ చేసి<br />
                <b style={{ color: '#fff', fontSize: '12px' }}>ఇక్కడ క్లిక్ చేసి Ctrl + V నొక్కండి</b>
              </div>
            </div>

            {/* స్లైడర్లు (గరిష్టంగా 1000px వరకు పెంచే వెసులుబాటు) */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }}>
              <span style={{ fontSize: '12px', minWidth: '55px' }}>వెడల్పు:</span>
              <input 
                type="range" 
                min="150" 
                max="1000" 
                value={logoWidth} 
                onChange={(e) => setLogoWidth(Number(e.target.value))} 
                style={{ flex: 1 }} 
              />
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>{logoWidth}px</span>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '8px' }}>
              <span style={{ fontSize: '12px', minWidth: '55px' }}>ఎత్తు:</span>
              <input 
                type="range" 
                min="40" 
                max="250" 
                value={logoHeight} 
                onChange={(e) => setLogoHeight(Number(e.target.value))} 
                style={{ flex: 1 }} 
              />
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>{logoHeight}px</span>
            </div>
          </div>

          {/* 4. సంపుటి, సంచిక ఐడెంటిటీ బార్ */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#93c5fd' }}>4. ఐడెంటిటీ లైన్ స్టైల్స్ (10 మోడల్స్):</label>
            <select value={headerStyle} onChange={(e) => setHeaderStyle(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', backgroundColor: '#0f172a', color: '#fff', border: '1px solid #475569', marginBottom: '10px' }}>
              <option value="style1">మోడల్ 1 - క్లాసిక్ డబుల్ బోర్డర్</option>
              <option value="style2">మోడల్ 2 - సెంటర్‌డ్ టాప్ బార్</option>
              <option value="style3">మోడల్ 3 - బోల్డ్ బ్యాక్‌గ్రౌండ్ బార్</option>
              <option value="style4">మోడల్ 4 - మినిమల్ సింగిల్ లైన్</option>
              <option value="style5">మోడల్ 5 - ఈనాడు స్టైల్ క్లాసిక్</option>
              <option value="style6">మోడల్ 6 - ఆంధ్రజ్యోతి క్లాసిక్</option>
              <option value="style7">మోడల్ 7 - మోడర్న్ బాక్స్ డిజైన్</option>
              <option value="style8">మోడల్ 8 - సెపరేటెడ్ డివైడర్</option>
              <option value="style9">మోడల్ 9 - ఎడిషన్ హైలైటర్</option>
              <option value="style10">మోడల్ 10 - ప్రెస్ డిజిటల్ లేఅవుట్</option>
            </select>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
              <div>
                <label>సంపుటి:</label>
                <input type="text" value={editionNo} onChange={(e) => setEditionNo(e.target.value)} style={{ width: '100%', padding: '4px', borderRadius: '4px', color: '#000' }} />
              </div>
              <div>
                <label>సంచిక:</label>
                <input type="text" value={issueNo} onChange={(e) => setIssueNo(e.target.value)} style={{ width: '100%', padding: '4px', borderRadius: '4px', color: '#000' }} />
              </div>
              <div>
                <label>స్థలం:</label>
                <input type="text" value={place} onChange={(e) => setPlace(e.target.value)} style={{ width: '100%', padding: '4px', borderRadius: '4px', color: '#000' }} />
              </div>
              <div>
                <label>వెల (రూ.):</label>
                <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: '100%', padding: '4px', borderRadius: '4px', color: '#000' }} />
              </div>
            </div>
          </div>

          {/* 5. పేజీల సంఖ్య మేనేజర్ */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#93c5fd' }}>5. మొత్తం పేజీల సంఖ్య (1 to 16):</label>
            <input 
              type="number" 
              min="1" 
              max="16" 
              value={totalPages} 
              onChange={(e) => setTotalPages(Math.min(16, Math.max(1, Number(e.target.value))))}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', backgroundColor: '#0f172a', color: '#fff', border: '1px solid #475569' }}
            />
          </div>

          {/* 6. బాటమ్ ప్రెస్ మార్కులు */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={showBottomMarks} onChange={(e) => setShowBottomMarks(e.target.checked)} />
              <span style={{ fontSize: '13px', color: '#93c5fd' }}>అడుగున ప్రెస్ మార్కింగ్ గుర్తులు (Footer Marks) ఉంచు</span>
            </label>
          </div>

        </div>

        {/* కుడివైపు: పేజీ లైవ్ ప్రివ్యూ */}
        <div style={{ flex: 1, backgroundColor: '#334155', padding: '30px', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* పేజీ నావిగేషన్ టాబ్‌లు */}
          <div style={{ display: 'flex', gap: '5px', marginBottom: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
              <button
                key={pNum}
                onClick={() => setCurrentPage(pNum)}
                style={{
                  padding: '6px 14px',
                  backgroundColor: currentPage === pNum ? '#2563eb' : '#1e293b',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: currentPage === pNum ? 'bold' : 'normal'
                }}
              >
                పేజీ {pNum}
              </button>
            ))}
          </div>

          {/* న్యూస్‌పేపర్ షీట్ */}
          <div style={{
            width: pageSize === 'Broadsheet' ? '680px' : pageSize === 'Tabloid' ? '460px' : pageSize === 'SingleCard' ? '400px' : '540px',
            backgroundColor: '#fff',
            color: '#000',
            minHeight: pageSize === 'SingleCard' ? '500px' : '760px',
            padding: '20px',
            boxSizing: 'border-box',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            position: 'relative'
          }}>
            
            {/* బోర్డర్ బాక్స్ */}
            <div style={{
              border: borderStyle === 'double' ? '4px double #000' : '1px solid #000',
              padding: '12px',
              minHeight: pageSize === 'SingleCard' ? '450px' : '700px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              
              <div>
                {/* మొదటి పేజీలో మాత్రమే మెయిన్ లోగో వస్తుంది */}
                {currentPage === 1 ? (
                  <>
                    <div style={{ textAlign: 'center', marginBottom: '8px', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
                      {logoUrl ? (
                        <img 
                          src={logoUrl} 
                          alt="Newspaper Logo" 
                          style={{ 
                            width: `${logoWidth}px`, 
                            maxWidth: '100%', 
                            height: `${logoHeight}px`, 
                            objectFit: 'fill' 
                          }} 
                        />
                      ) : (
                        <h1 style={{ margin: 0, fontSize: '36px', fontFamily: 'serif', color: '#1e293b' }}>యువగళం</h1>
                      )}
                    </div>

                    {/* సంపుటి, సంచిక ఐడెంటిటీ బార్ డిజైన్ */}
                    <div style={{
                      borderTop: headerStyle === 'style3' ? 'none' : '1px solid #000',
                      borderBottom: headerStyle === 'style3' ? 'none' : '1px solid #000',
                      backgroundColor: headerStyle === 'style3' ? '#000' : headerStyle === 'style9' ? '#f1f5f9' : 'transparent',
                      color: headerStyle === 'style3' ? '#fff' : '#000',
                      padding: '4px 8px',
                      fontSize: '11px',
                      display: 'flex',
                      justify: 'space-between',
                      fontWeight: 'bold',
                      fontFamily: 'serif'
                    }}>
                      <span>సంపుటి {editionNo} | సంచిక {issueNo}</span>
                      <span>{place} | {date}</span>
                      <span>వెల: రూ. {price}</span>
                    </div>
                  </>
                ) : (
                  /* 2వ పేజీ నుండి 16వ పేజీ వరకు క్లాసిక్ టాప్ లైన్ */
                  <div style={{ borderBottom: '2px solid #000', paddingBottom: '4px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold' }}>
                    <span>యువగళం దిపాంతర ఎడిషన్</span>
                    <span>పేజీ నంబర్: {currentPage}</span>
                    <span>{date}</span>
                  </div>
                )}

                {/* డమ్మీ గ్రిడ్ ప్రాంతం */}
                <div style={{ marginTop: '20px', border: '1px dashed #cbd5e1', padding: '40px 10px', textAlign: 'center', color: '#64748b' }}>
                  <h3>పేజీ {currentPage} మాస్టర్ లేఅవుట్ సిద్ధంగా ఉంది!</h3>
                  <p style={{ fontSize: '12px' }}>ఈ మాస్టర్ సేవ్ అయ్యాక, రోజువారీ వార్తలు ఫిల్ చేసే మోడ్‌లో ఈ పేజీలోని బాక్సుల్లో వార్తలు టైప్ చేయవచ్చు.</p>
                </div>
              </div>

              {/* అడుగున ప్రెస్ మార్కింగ్ గుర్తులు */}
              {showBottomMarks && (
                <div style={{ borderTop: '1px solid #000', paddingTop: '6px', marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px', color: '#475569' }}>
                  <span>SATHWIKA PUBLISHER MASTER LAYOUT ENGINE</span>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#00ffff' }}></span>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#ff00ff' }}></span>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#ffff00' }}></span>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#000000' }}></span>
                  </div>
                  <span>PAGE {currentPage} OF {totalPages}</span>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
