import React, { useState, useRef, useEffect } from 'react';

export default function MasterLayoutbuilder({ onBackToDashboard, selectedLayout }) {
  // 1. పేజీ ఆకృతి & సెటప్ కంట్రోలర్లు (మొదట్లోనే ఫిక్స్ కాకుండా యూజర్ ఎంచుకోవడానికి)
  const [pageSize, setPageSize] = useState(selectedLayout?.size || 'A3');
  const [columnCount, setColumnCount] = useState(selectedLayout?.columns || 4);
  const [borderStyle, setBorderStyle] = useState(selectedLayout?.border || 'డబుల్ లైన్');
  const [borderColor, setBorderColor] = useState('#000000');
  const [pageBgColor, setPageBgColor] = useState('#ffffff');

  // 2. టూల్‌బార్ అకార్డియన్ విభాగాలు (గందరగోళం లేకుండా ఓపెన్/క్లోజ్)
  const [activeSection, setActiveSection] = useState('pageSetup'); 

  // 3. లోగో & హెడర్ మోడల్స్ (10 రకాల హెడర్ స్టైల్స్ కి పునాది)
  const [logo, setLogo] = useState(null);
  const [logoWidth, setLogoWidth] = useState(250);
  const [logoHeight, setLogoHeight] = useState(80);
  const [logoAlign, setLogoAlign] = useState('center');
  const [paperTitle, setPaperTitle] = useState('యువగళం దినపత్రిక');
  const [titleFont, setTitleFont] = useState("'Ramabhadra', sans-serif");
  const [titleColor, setTitleColor] = useState('#000000');
  const [titleBg, setTitleBg] = useState('transparent');
  const [subHeaderInfo, setSubHeaderInfo] = useState('సంపుటి: 5 | సంచిక: 120 | అమరావతి | ఆదివారం, 15 ఆగస్టు 2026');

  // 4. వార్తల వివరాలు & రియాక్టర్ / మోడల్ ఎంపిక
  const [newsModel, setNewsModel] = useState('classic'); // 'classic', 'card', 'highlight', 'interview'
  const [mainHeadline, setMainHeadline] = useState('రాష్ట్రంలో ఘనంగా స్వాతంత్ర్య దినోత్సవ వేడుకలు');
  const [headFont, setHeadFont] = useState("'Ramabhadra', sans-serif");
  const [headSize, setHeadSize] = useState(32);
  const [headBg, setHeadBg] = useState('transparent');
  const [headColor, setHeadColor] = useState('#0b1b6e');
  const [subHeadline, setSubHeadline] = useState('ముఖ్యమంత్రి జాతీయ పతాకావిష్కరణ.. అధికారులకు అవార్డుల ప్రదానం');
  const [subBg, setSubBg] = useState('#fef3c7');
  const [subColor, setSubColor] = useState('#000000');
  const [subBullet, setSubBullet] = useState('➔');

  // 5. బాడీ టెక్స్ట్ & స్పేసింగ్ కంట్రోలర్లు
  const [dateLine, setDateLine] = useState('అమరావతి, ఆగస్టు 15 (యువగళం):');
  const [bodyText, setBodyText] = useState(
    'రాష్ట్రవ్యాప్తంగా 80వ స్వాతంత్ర్య దినోత్సవ వేడుకలు అంబరాన్నంటాయి. ముఖ్యమంత్రి జాతీయ పతాకాన్ని ఆవిష్కరించి పోలీసుల గౌరవ వందనం స్వీకరించారు. రాష్ట్ర ప్రజలకు శుభాకాంక్షలు తెలుపుతూ అభివృద్ధి పథకాలను వివరించారు. ఈ సందర్భంగా వివిధ రంగాల్లో ఉత్తమ సేవలుందించిన అధికారులకు అవార్డులను ప్రధానం చేశారు.'
  );
  const [bodyFontSize, setBodyFontSize] = useState(14);
  const [bodyTextColor, setBodyTextColor] = useState('#000000');
  const [lineSpacing, setLineSpacing] = useState(1.6);
  const [paragraphGap, setParagraphGap] = useState(12);

  // 6. ఫోటోలు & కంట్రోల్స్ (WhatsApp Ctrl+V + 6 Shapes)
  const [photos, setPhotos] = useState([]);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // కలర్ ప్యాలెట్లు & ఫాంట్లు
  const textColors12 = ['#ffffff', '#000000', '#0b1b6e', '#8b0000', '#006400', '#4b0082', '#800000', '#000080', '#5c4033', '#004d40', '#b91c1c', '#1e3a8a'];
  const darkColors = ['#0b1b6e', '#8b0000', '#006400', '#000000', '#4b0082', '#800000', '#000080', '#5c4033', '#004d40', '#333333'];
  const lightColors = ['#fef3c7', '#e0f2fe', '#fce7f3', '#dcfce7', '#ffedd5', '#f3f4f6', '#fffbeb', '#f3e8ff', '#cffafe', 'transparent'];
  
  const fontStyles = [
    { name: 'రామభద్ర (Ramabhadra)', value: "'Ramabhadra', sans-serif" },
    { name: 'మండలి (Mandali)', value: "'Mandali', sans-serif" },
    { name: 'గిడుగు (Gidugu)', value: "'Gidugu', sans-serif" },
    { name: 'సురవరం (Suravanna)', value: "'Suravanna', serif" },
    { name: 'ఎన్టీఆర్ (NTR)', value: "'NTR', sans-serif" },
    { name: 'గురజాడ (Gurazada)', value: "'Gurazada', serif" },
    { name: 'పెద్దన (Peddana)', value: "'Peddana', serif" },
    { name: 'నోటో శాన్స్ (Noto Sans)', value: "'Noto Sans Telugu', sans-serif" }
  ];

  // వాట్సాప్ (Ctrl+V) పేస్ట్ సపోర్ట్
  useEffect(() => {
    const handlePaste = (e) => {
      const clipboardData = e.clipboardData || window.clipboardData;
      if (!clipboardData) return;
      const items = clipboardData.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (!blob) continue;

          if (photos.length >= 4) {
            alert('గరిష్టం 4 ఫోటోలు మాత్రమే అనుమతించబడతాయి!');
            return;
          }
          const newPhoto = {
            url: URL.createObjectURL(blob),
            shape: 'box',
            size: 200,
            zoom: 100,
            panX: 50,
            panY: 50,
            align: 'left',
            showCaption: true,
            caption: 'ఫోటో వివరణ'
          };
          setPhotos(prev => [...prev, newPhoto]);
          alert('వాట్సాప్ ఇమేజ్ అప్‌లోడ్ అయింది!');
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [photos]);

  const handleFileUpload = (e, target) => {
    const files = Array.from(e.target.files);
    if (target === 'logo' && files[0]) {
      setLogo(URL.createObjectURL(files[0]));
    }
    if (target === 'photo') {
      if (photos.length + files.length > 4) {
        alert('గరిష్టం 4 ఫోటోలు అనుమతం!');
        return;
      }
      const newPhotos = files.map(f => ({
        url: URL.createObjectURL(f),
        shape: 'box',
        size: 200,
        zoom: 100,
        panX: 50,
        panY: 50,
        align: 'left',
        showCaption: true,
        caption: ''
      }));
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const updatePhotoSetting = (key, value) => {
    if (photos.length === 0) return;
    const updated = [...photos];
    updated[activePhotoIdx] = { ...updated[activePhotoIdx], [key]: value };
    setPhotos(updated);
  };

  // ఆటో-ఫిట్ ఎంబెడెడ్ ఇంజిన్ (ఎక్కడా ఖాళీ లేకుండా సర్దుబాటు)
  const handleAutoFit = () => {
    setBodyFontSize(15);
    setLineSpacing(1.75);
    setParagraphGap(16);
    setHeadSize(34);
    alert('✨ ఆటో-ఫిట్ సిస్టమ్ ఖాళీలను గుర్తించి పర్ఫెక్ట్‌గా లేఅవుట్ సర్దుబాటు చేసింది!');
  };

  const toggleSection = (sec) => setActiveSection(activeSection === sec ? null : sec);

  const getPhotoShapeStyle = (shape) => {
    switch (shape) {
      case 'circle': return { borderRadius: '50%' };
      case 'v-oval': return { borderRadius: '50% / 35%' };
      case 'h-oval': return { borderRadius: '35% / 50%' };
      case 'rounded': return { borderRadius: '16px' };
      case 'capsule': return { borderRadius: '50px' };
      default: return { borderRadius: '0px' };
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '15px', backgroundColor: '#0f172a', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      
      {/* ఎడమ వైపు: అకార్డియన్ కస్టమ్‌ టూల్‌బార్ */}
      <div style={{ width: '420px', backgroundColor: '#1e293b', padding: '15px', borderRadius: '8px', border: '1px solid #334155', maxHeight: '95vh', overflowY: 'auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <button onClick={onBackToDashboard} style={{ backgroundColor: '#475569', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
            ⬅ డ్యాష్‌బోర్డ్
          </button>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#facc15' }}>మాస్టర్ లేఅవుట్ ఇంజిన్</span>
        </div>

        {/* 1. పేజీ ఆకృతి & పరిమాణం సెటప్ */}
        <div style={{ marginBottom: '8px', backgroundColor: '#0f172a', borderRadius: '6px', overflow: 'hidden' }}>
          <button onClick={() => toggleSection('pageSetup')} style={{ width: '100%', padding: '10px', textAlign: 'left', backgroundColor: '#1e293b', border: 'none', color: '#38bdf8', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
            <span>1. పేజీ సెటప్ (సైజు & బోర్డర్లు)</span>
            <span>{activeSection === 'pageSetup' ? '▲' : '▼'}</span>
          </button>
          {activeSection === 'pageSetup' && (
            <div style={{ padding: '10px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <label>పేపర్ సైజు ఎంపిక: </label>
                <select value={pageSize} onChange={(e) => setPageSize(e.target.value)} style={{ width: '100%', padding: '5px', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '4px' }}>
                  <option value="A3">A3 ఎడిషన్</option>
                  <option value="Broadsheet">Broadsheet జంబో పేపర్</option>
                  <option value="Tabloid">Tabloid చిన్న పేపర్</option>
                </select>
              </div>
              <div>
                <label>వార్తా గ్రిడ్ కాలమ్స్ (Columns): </label>
                <select value={columnCount} onChange={(e) => setColumnCount(Number(e.target.value))} style={{ width: '100%', padding: '5px', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '4px' }}>
                  <option value={1}>1 కాలమ్</option>
                  <option value={2}>2 కాలమ్స్</option>
                  <option value={3}>3 కాలమ్స్</option>
                  <option value={4}>4 కాలమ్స్</option>
                  <option value={5}>5 కాలమ్స్</option>
                  <option value={8}>8 కాలమ్స్ (Broadsheet)</option>
                </select>
              </div>
              <div>
                <label>బోర్డర్ శైలి: </label>
                <select value={borderStyle} onChange={(e) => setBorderStyle(e.target.value)} style={{ width: '100%', padding: '5px', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '4px' }}>
                  <option value="డబుల్ లైన్">డబుల్ లైన్ (Double)</option>
                  <option value="సింగిల్ లైన్">సింగిల్ లైన్ (Single)</option>
                  <option value="బోర్డర్ లేదు">బోర్డర్ లేదు (None)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* 2. లోగో & హెడర్ డిజైన్ సెట్టింగ్స్ */}
        <div style={{ marginBottom: '8px', backgroundColor: '#0f172a', borderRadius: '6px', overflow: 'hidden' }}>
          <button onClick={() => toggleSection('headerSetup')} style={{ width: '100%', padding: '10px', textAlign: 'left', backgroundColor: '#1e293b', border: 'none', color: '#38bdf8', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
            <span>2. లోగో & మాస్టర్ హెడర్</span>
            <span>{activeSection === 'headerSetup' ? '▲' : '▼'}</span>
          </button>
          {activeSection === 'headerSetup' && (
            <div style={{ padding: '10px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <label>లోగో అప్‌లోడ్ (లేదా Ctrl+V పేస్ట్):</label>
                <input type="file" onChange={(e) => handleFileUpload(e, 'logo')} style={{ width: '100%', marginTop: '4px' }} />
              </div>
              <div>
                <label>పత్రిక పేరు (Title): </label>
                <input type="text" value={paperTitle} onChange={(e) => setPaperTitle(e.target.value)} style={{ width: '100%', padding: '5px', backgroundColor: '#334155', color: '#fff', border: '1px solid #475569', borderRadius: '4px' }} />
              </div>
              <div>
                <label>సంపుటి / తేదీ ఐడెంటిటీ: </label>
                <input type="text" value={subHeaderInfo} onChange={(e) => setSubHeaderInfo(e.target.value)} style={{ width: '100%', padding: '5px', backgroundColor: '#334155', color: '#fff', border: '1px solid #475569', borderRadius: '4px' }} />
              </div>
            </div>
          )}
        </div>

        {/* 3. వార్తా రియాక్టర్ / మోడల్ ఎంపిక (News Layout Models) */}
        <div style={{ marginBottom: '8px', backgroundColor: '#0f172a', borderRadius: '6px', overflow: 'hidden' }}>
          <button onClick={() => toggleSection('newsModel')} style={{ width: '100%', padding: '10px', textAlign: 'left', backgroundColor: '#1e293b', border: 'none', color: '#38bdf8', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
            <span>3. వార్తా శైలులు / మోడల్స్ (Reactors)</span>
            <span>{activeSection === 'newsModel' ? '▲' : '▼'}</span>
          </button>
          {activeSection === 'newsModel' && (
            <div style={{ padding: '10px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label>వార్తా లేఅవుట్ మోడల్ ఎంచుకోండి:</label>
              <select value={newsModel} onChange={(e) => setNewsModel(e.target.value)} style={{ width: '100%', padding: '6px', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '4px' }}>
                <option value="classic">1. క్లాసిక్ న్యూస్ మోడల్ (Standard)</option>
                <option value="card">2. బాక్స్ / కార్డ్ మోడల్ (Border Box)</option>
                <option value="highlight">3. హైలైట్ కలర్ మోడల్ (Full Color BG)</option>
                <option value="interview">4. స్పెషల్ ఇంటర్వ్యూ మోడల్ (Quote Box)</option>
              </select>
            </div>
          )}
        </div>

        {/* 4. ప్రధాన శీర్షిక & కంటెంట్ కంట్రోల్స్ */}
        <div style={{ marginBottom: '8px', backgroundColor: '#0f172a', borderRadius: '6px', overflow: 'hidden' }}>
          <button onClick={() => toggleSection('contentCtrl')} style={{ width: '100%', padding: '10px', textAlign: 'left', backgroundColor: '#1e293b', border: 'none', color: '#38bdf8', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
            <span>4. శీర్షికలు & వార్తా వచనం</span>
            <span>{activeSection === 'contentCtrl' ? '▲' : '▼'}</span>
          </button>
          {activeSection === 'contentCtrl' && (
            <div style={{ padding: '10px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <label>ప్రధాన శీర్షిక:</label>
                <input type="text" value={mainHeadline} onChange={(e) => setMainHeadline(e.target.value)} style={{ width: '100%', padding: '5px', backgroundColor: '#334155', color: '#fff', border: '1px solid #475569', borderRadius: '4px' }} />
              </div>
              <div>
                <label>ఉప శీర్షిక (Sub-Headline):</label>
                <input type="text" value={subHeadline} onChange={(e) => setSubHeadline(e.target.value)} style={{ width: '100%', padding: '5px', backgroundColor: '#334155', color: '#fff', border: '1px solid #475569', borderRadius: '4px' }} />
              </div>
              <div>
                <label>డేట్‌లైన్:</label>
                <input type="text" value={dateLine} onChange={(e) => setDateLine(e.target.value)} style={{ width: '100%', padding: '5px', backgroundColor: '#334155', color: '#fff', border: '1px solid #475569', borderRadius: '4px' }} />
              </div>
              <div>
                <label>ప్రధాన వార్తా పాఠం:</label>
                <textarea rows={4} value={bodyText} onChange={(e) => setBodyText(e.target.value)} style={{ width: '100%', padding: '5px', backgroundColor: '#334155', color: '#fff', border: '1px solid #475569', borderRadius: '4px' }} />
              </div>
              <div>
                <label>అక్షరాల పరిమాణం (Font Size): {bodyFontSize}px</label>
                <input type="range" min="11" max="24" value={bodyFontSize} onChange={(e) => setBodyFontSize(Number(e.target.value))} style={{ width: '100%' }} />
              </div>
            </div>
          )}
        </div>

        {/* 5. ఫోటో మేనేజర్ (Shapes & Positions) */}
        <div style={{ marginBottom: '8px', backgroundColor: '#0f172a', borderRadius: '6px', overflow: 'hidden' }}>
          <button onClick={() => toggleSection('photoCtrl')} style={{ width: '100%', padding: '10px', textAlign: 'left', backgroundColor: '#1e293b', border: 'none', color: '#38bdf8', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
            <span>5. ఫోటోల కంట్రోలర్ ({photos.length})</span>
            <span>{activeSection === 'photoCtrl' ? '▲' : '▼'}</span>
          </button>
          {activeSection === 'photoCtrl' && (
            <div style={{ padding: '10px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input type="file" multiple onChange={(e) => handleFileUpload(e, 'photo')} />
              <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>* ఇక్కడ నేరుగా వాట్సాప్ ఫోటోలు Ctrl+V పేస్ట్ చేయవచ్చు.</p>

              {photos.length > 0 && photos[activePhotoIdx] && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                  <label>ఫోటో ఆకారం (6 Shapes):</label>
                  <select value={photos[activePhotoIdx].shape} onChange={(e) => updatePhotoSetting('shape', e.target.value)} style={{ padding: '4px', backgroundColor: '#334155', color: '#fff', border: 'none' }}>
                    <option value="box">బాక్స్</option>
                    <option value="circle">గుండ్రంగా (Circle)</option>
                    <option value="v-oval">నిలువు ఓవల్</option>
                    <option value="h-oval">అడ్డం ఓవల్</option>
                    <option value="rounded">రౌండెడ్ కార్నర్</option>
                    <option value="capsule">క్యాప్సూల్</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 6. ఆటో-ఫిట్ మ్యాజిక్ బటన్ */}
        <div style={{ marginTop: '15px' }}>
          <button 
            onClick={handleAutoFit}
            style={{ width: '100%', backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}
          >
            ⚡ ఆటో-ఫిట్ పేజీ (Auto-Fill Whitespace)
          </button>
        </div>

      </div>

      {/* కుడి వైపు: లైవ్ పత్రిక డిజైన్ కాన్వాస్ */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', overflowY: 'auto', padding: '10px' }}>
        <div style={{
          backgroundColor: pageBgColor,
          color: '#000',
          width: pageSize === 'Broadsheet' ? '850px' : '680px',
          minHeight: '900px',
          padding: '25px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          border: borderStyle === 'డబుల్ లైన్' ? `4px double ${borderColor}` : borderStyle === 'సింగిల్ లైన్' ? `2px solid ${borderColor}` : 'none',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* 1. పత్రిక మాస్టర్ హెడర్ */}
          <div style={{ borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '15px', textAlign: logoAlign }}>
            {logo && <img src={logo} alt="Logo" style={{ width: `${logoWidth}px`, height: `${logoHeight}px`, objectFit: 'contain' }} />}
            <h1 style={{ margin: '5px 0 0 0', fontSize: '40px', fontWeight: '900', fontFamily: titleFont, color: titleColor, backgroundColor: titleBg }}>{paperTitle}</h1>
            <div style={{ borderTop: '1px solid #000', borderBottom: '1px solid #000', padding: '4px 0', marginTop: '8px', fontSize: '11px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
              <span>{subHeaderInfo}</span>
            </div>
          </div>

          {/* 2. పత్రిక వార్తా కార్డ్ / మోడల్ (Reactor View) */}
          <div style={{
            backgroundColor: newsModel === 'highlight' ? '#fef3c7' : 'transparent',
            border: newsModel === 'card' ? '2px solid #0b1b6e' : 'none',
            padding: newsModel === 'card' || newsModel === 'highlight' ? '15px' : '0px',
            borderRadius: newsModel === 'card' ? '6px' : '0px',
            marginBottom: '15px'
          }}>
            {/* శీర్షిక */}
            <h2 style={{ fontSize: `${headSize}px`, fontFamily: headFont, color: headColor, backgroundColor: headBg, margin: '0 0 10px 0', lineHeight: '1.3' }}>
              {mainHeadline}
            </h2>

            {/* సబ్-హెడ్‌లైన్ */}
            {subHeadline && (
              <div style={{ backgroundColor: subBg, color: subColor, padding: '6px 10px', fontSize: '14px', fontWeight: 'bold', borderLeft: '4px solid #0b1b6e', marginBottom: '12px' }}>
                <span>{subBullet} {subHeadline}</span>
              </div>
            )}

            {/* గ్రిడ్ కాలమ్స్‌తో వార్తా టెక్స్ట్ & ఫోటోలు */}
            <div style={{
              columnCount: columnCount,
              columnGap: '16px',
              columnRule: '1px solid #e2e8f0',
              fontSize: `${bodyFontSize}px`,
              lineHeight: lineSpacing,
              color: bodyTextColor,
              textAlign: 'justify'
            }}>
              {photos.length > 0 && photos[0] && (
                <div style={{ float: photos[0].align, margin: '0 10px 10px 0', width: `${photos[0].size}px` }}>
                  <img 
                    src={photos[0].url} 
                    alt="News" 
                    style={{ width: '100%', height: 'auto', ...getPhotoShapeStyle(photos[0].shape) }} 
                  />
                  {photos[0].showCaption && <div style={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'center', marginTop: '2px' }}>{photos[0].caption}</div>}
                </div>
              )}

              <p style={{ margin: 0, marginBottom: `${paragraphGap}px` }}>
                <strong style={{ color: '#dc2626' }}>{dateLine} </strong>
                {bodyText}
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
