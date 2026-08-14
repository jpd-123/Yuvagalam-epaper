import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';

const SingleClippingEditor = () => {
  // 1. పేపర్ లోగో సెట్టింగ్స్
  const [logo, setLogo] = useState(null);
  const [openLogo, setOpenLogo] = useState(false);
  const [logoWidth, setLogoWidth] = useState(250);
  const [logoHeight, setLogoHeight] = useState(70);
  const [logoAlign, setLogoAlign] = useState('center');

  // 2. ప్రధాన శీర్షిక (Headline)
  const [headline, setHeadline] = useState('ఎన్‌ఎమ్‌ఎమ్‌ఎస్‌లో బోరివంక విద్యార్థుల ప్రతిభ');
  const [openHeadCtrl, setOpenHeadCtrl] = useState(false);
  const [headBg, setHeadBg] = useState('#0b1b6e');
  const [headColor, setHeadColor] = useState('#ffffff');
  const [headSize, setHeadSize] = useState(26);
  const [headAlign, setHeadAlign] = useState('center');
  const [headFont, setHeadFont] = useState("'Ramabhadra', sans-serif");

  // 3. ఉప శీర్షిక (Sub-Headline)
  const [subHeadline, setSubHeadline] = useState('ముగ్గురు విద్యార్థులకు స్కాలర్‌షిప్..\nఅభినందించిన ఉపాధ్యాయులు, గ్రామపెద్దలు');
  const [openSubCtrl, setOpenSubCtrl] = useState(false);
  const [subBg, setSubBg] = useState('#fef3c7');
  const [subColor, setSubColor] = useState('#000000');
  const [subSize, setSubSize] = useState(15);
  const [subBullet, setSubBullet] = useState('➔');
  const [subBorderColor, setSubBorderColor] = useState('#0b1b6e');

  // 4. డేట్‌లైన్ & ప్రధాన వార్త
  const [dateLine, setDateLine] = useState('ఇచ్ఛాపురం, ఆగస్టు 12 (యువగళం):');
  const [dateLineColor, setDateLineColor] = useState('#dc2626');
  const [bodyText, setBodyText] = useState('శ్రీకాకుళం జిల్లా పాతపట్నం మోడల్ స్కూల్ కు చెందిన 10వ తరగతి విద్యార్థిని రాష్ట్రస్థాయి వక్తృత్వ పోటీల్లో ప్రథమ స్థానంలో నిలిచారు. గుంటూరుకు చెందిన యగోడ చారిటబుల్ ట్రస్ట్ నిర్వహించిన ఆన్‌లైన్ వక్తృత్వ పోటీల్లో మై నేషన్ మై ఇండియా అనే అంశంపై నిర్వహించిన పోటీలో ప్రతిభ కనబరిచి రాష్ట్రస్థాయిలో మొదటి స్థానం సాధించారు.');
  const [bodyFontSize, setBodyFontSize] = useState(14);
  const [bodyTextColor, setBodyTextColor] = useState('#000000');
  const [newsColumns, setNewsColumns] = useState(1);
  const [openBodyCtrl, setOpenBodyCtrl] = useState(false);

  // 5. ఫోటోలు & కంట్రోల్స్
  const [photos, setPhotos] = useState([]);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [openPhotoCtrl, setOpenPhotoCtrl] = useState(false);

  const canvasRef = useRef(null);

  // 12 ఫాంట్ కలర్స్
  const textColors12 = [
    '#ffffff', '#000000', '#0b1b6e', '#8b0000', '#006400', 
    '#4b0082', '#800000', '#000080', '#5c4033', '#004d40', 
    '#b91c1c', '#1e3a8a'
  ];

  // 10 ముదురు రంగులు (Solid Dark BG)
  const darkColors = [
    '#0b1b6e', '#8b0000', '#006400', '#000000', '#4b0082',
    '#800000', '#000080', '#5c4033', '#004d40', '#333333'
  ];

  // 10 తేలికపాటి రంగులు (Solid Light BG)
  const lightColors = [
    '#fef3c7', '#e0f2fe', '#fce7f3', '#dcfce7', '#ffedd5',
    '#f3f4f6', '#fffbeb', '#f3e8ff', '#cffafe', 'transparent'
  ];

  // 8 తెలుగు ఫాంట్‌లు
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

          if (openLogo) {
            setLogo(URL.createObjectURL(blob));
            alert('వాట్సాప్ ఇమేజ్ లోగోగా అప్‌లోడ్ అయింది!');
          } else {
            if (photos.length >= 3) {
              alert('గరిష్టం 3 ఫోటోలు మాత్రమే అనుమతించబడతాయి!');
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
              marginTop: 0,
              marginLeft: 0,
              showCaption: true,
              caption: 'ఫోటో వివరణ'
            };
            setPhotos(prev => [...prev, newPhoto]);
            alert('వాట్సాప్ ఇమేజ్ ఫోటోగా అప్‌లోడ్ అయింది!');
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [photos, openLogo]);

  const handleFileUpload = (e, target) => {
    const files = Array.from(e.target.files);
    if (target === 'logo' && files[0]) {
      setLogo(URL.createObjectURL(files[0]));
    }
    if (target === 'photo') {
      if (photos.length + files.length > 3) {
        alert('గరిష్టం 3 ఫోటోలు మాత్రమే అలవుడ్!');
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
        marginTop: 0,
        marginLeft: 0,
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

  const removePhoto = (idx) => {
    setPhotos(photos.filter((_, i) => i !== idx));
    setActivePhotoIdx(0);
  };

  const downloadPNG = () => {
    if (canvasRef.current) {
      html2canvas(canvasRef.current, { scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'clipping.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };

  const getPhotoShapeStyle = (shape) => {
    switch (shape) {
      case 'circle':
        return { borderRadius: '50%', shapeOutside: 'circle(50%)' };
      case 'v-oval':
        return { borderRadius: '50% / 35%', shapeOutside: 'ellipse(50% 50%)' };
      case 'h-oval':
        return { borderRadius: '35% / 50%', shapeOutside: 'ellipse(50% 50%)' };
      case 'rounded':
        return { borderRadius: '16px', shapeOutside: 'inset(0 round 16px)' };
      case 'capsule':
        return { borderRadius: '50px', shapeOutside: 'inset(0 round 50px)' };
      case 'box':
      default:
        return { borderRadius: '0px', shapeOutside: 'square(100%)' };
    }
  };
  return (
    <div className="flex flex-row gap-6 p-4 bg-gray-900 text-white min-h-screen w-full">
      {/* ఎడమ వైపు టూల్ బార్ */}
      <div className="w-[430px] min-w-[430px] bg-gray-800 p-4 rounded-lg overflow-y-auto max-h-[95vh] border border-gray-700">
        <h2 className="text-base font-bold text-yellow-400 mb-4 border-b border-gray-600 pb-2">
          న్యూస్ క్లిప్పింగ్ టూల్ బార్
        </h2>

        {/* 1. పేపర్ లోగో సెట్టింగ్స్ */}
        <div className="mb-3 bg-gray-700 p-3 rounded">
          <div className="flex justify-between items-center">
            <span className="font-bold text-xs text-yellow-300">1. పేపర్ లోగో సెట్టింగ్స్</span>
            <button onClick={() => setOpenLogo(!openLogo)} className="text-xs bg-gray-600 px-2 py-1 rounded">
              {openLogo ? 'హైడ్ చేయి ▲' : 'కంట్రోలర్ ఓపెన్ చేయి ▼'}
            </button>
          </div>
          <div className="mt-2">
            <input type="file" onChange={(e) => handleFileUpload(e, 'logo')} className="w-full bg-gray-800 p-1 text-xs rounded" />
            <p className="text-[10px] text-gray-300 mt-1">* లోగో కాపీ చేసి ఇక్కడ (Ctrl+V) పేస్ట్ చేయవచ్చు.</p>
          </div>

          {openLogo && (
            <div className="mt-3 space-y-2 text-xs border-t border-gray-600 pt-2">
              <div className="flex justify-between items-center">
                <span>వెడల్పు ({logoWidth}px):</span>
                <input type="range" min="100" max="600" value={logoWidth} onChange={(e) => setLogoWidth(Number(e.target.value))} />
              </div>
              <div className="flex justify-between items-center">
                <span>ఎత్తు ({logoHeight}px):</span>
                <input type="range" min="30" max="200" value={logoHeight} onChange={(e) => setLogoHeight(Number(e.target.value))} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setLogoAlign('start')} className="p-1 bg-gray-600 rounded flex-1">ఎడమ</button>
                <button onClick={() => setLogoAlign('center')} className="p-1 bg-gray-600 rounded flex-1">మధ్యలో</button>
                <button onClick={() => setLogoAlign('end')} className="p-1 bg-gray-600 rounded flex-1">కుడి</button>
              </div>
            </div>
          )}
        </div>

        {/* 2. ప్రధాన శీర్షిక (Headline) */}
        <div className="mb-3 bg-gray-700 p-3 rounded">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-xs text-yellow-300">2. ప్రధాన శీర్షిక (Headline)</span>
            <button onClick={() => setOpenHeadCtrl(!openHeadCtrl)} className="text-xs bg-gray-600 px-2 py-1 rounded">
              {openHeadCtrl ? 'హైడ్ చేయి ▲' : 'కంట్రోలర్ ఓపెన్ చేయి ▼'}
            </button>
          </div>
          <textarea 
            value={headline} 
            onChange={(e) => setHeadline(e.target.value)} 
            className="w-full p-2 bg-gray-900 border border-gray-500 text-white rounded text-xs font-semibold"
            rows={2}
          />

          {openHeadCtrl && (
            <div className="mt-3 space-y-3 text-xs border-t border-gray-600 pt-2">
              <div>
                <label className="block mb-1 font-bold">ఫాంట్ శైలి (8 స్టైల్స్):</label>
                <select value={headFont} onChange={(e) => setHeadFont(e.target.value)} className="w-full bg-gray-900 p-1 rounded text-white">
                  {fontStyles.map((f, i) => <option key={i} value={f.value}>{f.name}</option>)}
                </select>
              </div>

              <div className="flex justify-between items-center">
                <span>ఫాంట్ సైజ్:</span>
                <input type="range" min="18" max="50" value={headSize} onChange={(e) => setHeadSize(e.target.value)} />
              </div>

              <div>
                <label className="block mb-1 font-bold">10 ముదురు రంగులు (Solid Dark):</label>
                <div className="flex flex-wrap gap-1">
                  {darkColors.map((c, i) => (
                    <button key={i} onClick={() => setHeadBg(c)} style={{ backgroundColor: c }} className="w-6 h-6 rounded border border-white" />
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-1 font-bold">10 తేలికపాటి రంగులు (Solid Light):</label>
                <div className="flex flex-wrap gap-1">
                  {lightColors.map((c, i) => (
                    <button key={i} onClick={() => setHeadBg(c)} style={{ backgroundColor: c }} className="w-6 h-6 rounded border border-gray-400" />
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-1 font-bold">అక్షరాల కలర్ (12 రకాలు):</label>
                <div className="flex flex-wrap gap-1">
                  {textColors12.map((c, i) => (
                    <button key={i} onClick={() => setHeadColor(c)} style={{ backgroundColor: c }} className="w-6 h-6 rounded border border-gray-400" />
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setHeadAlign('left')} className="p-1 bg-gray-600 rounded flex-1">ఎడమ</button>
                <button onClick={() => setHeadAlign('center')} className="p-1 bg-gray-600 rounded flex-1">మధ్యలో</button>
                <button onClick={() => setHeadAlign('right')} className="p-1 bg-gray-600 rounded flex-1">కుడి</button>
              </div>
            </div>
          )}
        </div>

        {/* 3. ఉప శీర్షిక (Sub-Headline) */}
        <div className="mb-3 bg-gray-700 p-3 rounded">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-xs text-yellow-300">3. ఉప శీర్షిక (Sub-Headline)</span>
            <button onClick={() => setOpenSubCtrl(!openSubCtrl)} className="text-xs bg-gray-600 px-2 py-1 rounded">
              {openSubCtrl ? 'హైడ్ చేయి ▲' : 'కంట్రోలర్ ఓపెన్ చేయి ▼'}
            </button>
          </div>
          <textarea 
            value={subHeadline} 
            onChange={(e) => setSubHeadline(e.target.value)} 
            className="w-full p-2 bg-gray-900 border border-gray-500 text-white rounded text-xs"
            rows={2}
          />

          {openSubCtrl && (
            <div className="mt-3 space-y-3 text-xs border-t border-gray-600 pt-2">
              <div className="flex justify-between items-center">
                <span>బుల్లెట్ గుర్తు:</span>
                <select value={subBullet} onChange={(e) => setSubBullet(e.target.value)} className="bg-gray-900 p-1 rounded text-white">
                  <option value="➔">➔ బాణం</option>
                  <option value="➢">➢ బాణం 2</option>
                  <option value="■">■ బాక్స్</option>
                  <option value="●">● సర్కిల్</option>
                  <option value="⦿">⦿ బుల్‌ఐ</option>
                </select>
              </div>

              <div className="flex justify-between items-center">
                <span>ఫాంట్ సైజ్:</span>
                <input type="range" min="12" max="24" value={subSize} onChange={(e) => setSubSize(e.target.value)} />
              </div>

              <div>
                <label className="block mb-1 font-bold">సబ్-హెడ్‌లైన్ బ్యాక్‌గ్రౌండ్ కలర్స్:</label>
                <div className="flex flex-wrap gap-1">
                  {lightColors.map((c, i) => (
                    <button key={i} onClick={() => setSubBg(c)} style={{ backgroundColor: c }} className="w-6 h-6 rounded border border-gray-400" />
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-1 font-bold">అక్షరాల కలర్ (12 రకాలు):</label>
                <div className="flex flex-wrap gap-1">
                  {textColors12.map((c, i) => (
                    <button key={i} onClick={() => setSubColor(c)} style={{ backgroundColor: c }} className="w-6 h-6 rounded border border-gray-400" />
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-1 font-bold">లెఫ్ట్ బోర్డర్ కలర్ (12 రకాలు):</label>
                <div className="flex flex-wrap gap-1">
                  {textColors12.map((c, i) => (
                    <button key={i} onClick={() => setSubBorderColor(c)} style={{ backgroundColor: c }} className="w-6 h-6 rounded border border-gray-400" />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. డేట్‌లైన్ & ప్రధాన వార్త */}
        <div className="mb-3 bg-gray-700 p-3 rounded text-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-bold text-yellow-300">4. వార్తా వివరాలు & డేట్‌లైన్</span>
            <button onClick={() => setOpenBodyCtrl(!openBodyCtrl)} className="text-xs bg-gray-600 px-2 py-1 rounded">
              {openBodyCtrl ? 'హైడ్ చేయి ▲' : 'కంట్రోలర్ ఓపెన్ చేయి ▼'}
            </button>
          </div>
          <input 
            type="text" 
            value={dateLine} 
            onChange={(e) => setDateLine(e.target.value)} 
            className="w-full p-2 bg-gray-900 border border-gray-500 text-white rounded font-bold"
          />
          <textarea 
            value={bodyText} 
            onChange={(e) => setBodyText(e.target.value)} 
            className="w-full p-2 bg-gray-900 border border-gray-500 text-white rounded h-28 leading-normal"
          />

          {openBodyCtrl && (
            <div className="mt-2 border-t border-gray-600 pt-2 space-y-2">
              <div>
                <label className="block mb-1 font-bold">వార్తా లైన్లు / కాలమ్స్ ఆప్షన్:</label>
                <div className="flex gap-2">
                  <button onClick={() => setNewsColumns(1)} className={newsColumns === 1 ? "p-1 flex-1 rounded bg-yellow-500 text-black font-bold" : "p-1 flex-1 rounded bg-gray-600"}>సింగిల్ లైన్</button>
                  <button onClick={() => setNewsColumns(2)} className={newsColumns === 2 ? "p-1 flex-1 rounded bg-yellow-500 text-black font-bold" : "p-1 flex-1 rounded bg-gray-600"}>డబుల్ లైన్</button>
                  <button onClick={() => setNewsColumns(3)} className={newsColumns === 3 ? "p-1 flex-1 rounded bg-yellow-500 text-black font-bold" : "p-1 flex-1 rounded bg-gray-600"}>త్రిపుల్ లైన్</button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span>అక్షరాల సైజు:</span>
                <input type="range" min="11" max="22" value={bodyFontSize} onChange={(e) => setBodyFontSize(e.target.value)} />
              </div>
              <div>
                <label className="block mb-1 font-bold">వార్త అక్షరాల రంగు (12 రకాలు):</label>
                <div className="flex flex-wrap gap-1">
                  {textColors12.map((c, i) => (
                    <button key={i} onClick={() => setBodyTextColor(c)} style={{ backgroundColor: c }} className="w-6 h-6 rounded border border-gray-400" />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5. ఫోటోలు & కంట్రోల్స్ */}
        <div className="mb-4 bg-gray-700 p-3 rounded text-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-bold text-yellow-300">5. ఫోటోల కంట్రోలర్ (గరిష్టం 3)</span>
            <button onClick={() => setOpenPhotoCtrl(!openPhotoCtrl)} className="text-xs bg-gray-600 px-2 py-1 rounded">
              {openPhotoCtrl ? 'హైడ్ చేయి ▲' : 'కంట్రోలర్ ఓపెన్ చేయి ▼'}
            </button>
          </div>
          <input type="file" multiple onChange={(e) => handleFileUpload(e, 'photo')} className="w-full bg-gray-800 p-1 rounded" />
          <p className="text-[10px] text-gray-300">* ఫోటో కాపీ చేసి (Ctrl+V) ద్వారా ఇక్కడ అప్‌లోడ్ చేయవచ్చు.</p>

          {photos.length > 0 && (
            <div className="space-y-2 border-t border-gray-600 pt-2">
              <div className="flex gap-2 mb-2">
                {photos.map((item, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActivePhotoIdx(idx)}
                    className={activePhotoIdx === idx ? "px-2 py-1 rounded bg-yellow-500 text-black font-bold" : "px-2 py-1 rounded bg-gray-600"}
                  >
                    {"ఫోటో " + (idx + 1)}
                  </button>
                ))}
              </div>

              {openPhotoCtrl && photos[activePhotoIdx] && (
                <>
                  <div>
                    <label className="block mb-1 font-bold">ఫోటో ఆకారాలు (6 Shapes):</label>
                    <div className="grid grid-cols-3 gap-1">
                      <button onClick={() => updatePhotoSetting('shape', 'box')} className="bg-gray-600 p-1 rounded text-[10px]">1. బాక్స్</button>
                      <button onClick={() => updatePhotoSetting('shape', 'circle')} className="bg-gray-600 p-1 rounded text-[10px]">2. గుండ్రంగా</button>
                      <button onClick={() => updatePhotoSetting('shape', 'v-oval')} className="bg-gray-600 p-1 rounded text-[10px]">3. నిలువు ఓవల్</button>
                      <button onClick={() => updatePhotoSetting('shape', 'h-oval')} className="bg-gray-600 p-1 rounded text-[10px]">4. అడ్డం ఓవల్</button>
                      <button onClick={() => updatePhotoSetting('shape', 'rounded')} className="bg-gray-600 p-1 rounded text-[10px]">5. రౌండెడ్ బాక్స్</button>
                      <button onClick={() => updatePhotoSetting('shape', 'capsule')} className="bg-gray-600 p-1 rounded text-[10px]">6. క్యాప్సూల్</button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>స్థానం (Left / Center / Right):</span>
                    <div className="flex gap-1">
                      <button onClick={() => updatePhotoSetting('align', 'left')} className={"px-2 py-1 rounded " + (photos[activePhotoIdx].align === 'left' ? 'bg-blue-600' : 'bg-gray-600')}>ఎడమ</button>
                      <button onClick={() => updatePhotoSetting('align', 'center')} className={"px-2 py-1 rounded " + (photos[activePhotoIdx].align === 'center' ? 'bg-blue-600' : 'bg-gray-600')}>మధ్యలో</button>
                      <button onClick={() => updatePhotoSetting('align', 'right')} className={"px-2 py-1 rounded " + (photos[activePhotoIdx].align === 'right' ? 'bg-blue-600' : 'bg-gray-600')}>కుడి</button>
                    </div>
                  </div>

                  {/* ఫోటో స్థానము - పైకి/కిందకి, ఎడమ/కుడికి జరపడానికి మార్జిన్లు */}
                  <div className="bg-gray-800 p-2 rounded space-y-2 border border-gray-600">
                    <span className="font-bold text-yellow-300 block">ఫోటో పొజిషన్ (వార్త లోపల జరపండి):</span>
                    <div className="flex justify-between items-center">
                      <span>పైకి / కిందకి:</span>
                      <input 
                        type="range" 
                        min="0" 
                        max="200" 
                        value={photos[activePhotoIdx].marginTop || 0} 
                        onChange={(e) => updatePhotoSetting('marginTop', Number(e.target.value))} 
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>ఎడమ / కుడికి:</span>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={photos[activePhotoIdx].marginLeft || 0} 
                        onChange={(e) => updatePhotoSetting('marginLeft', Number(e.target.value))} 
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>వెడల్పు (సైజ్):</span>
                    <input 
                      type="range" 
                      min="100" 
                      max="400" 
                      value={photos[activePhotoIdx].size} 
                      onChange={(e) => updatePhotoSetting('size', Number(e.target.value))} 
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span>జూమ్ (Zoom):</span>
                    <input 
                      type="range" 
                      min="100" 
                      max="300" 
                      value={photos[activePhotoIdx].zoom} 
                      onChange={(e) => updatePhotoSetting('zoom', Number(e.target.value))} 
                    />
                  </div>

                  <div className="bg-gray-800 p-2 rounded space-y-2 border border-gray-600">
                    <span className="font-bold text-yellow-300 block">జూమ్ ఫోటో స్థానము (Position Adjust):</span>
                    <div className="flex justify-between items-center">
                      <span>పైకి / కిందకి జరపండి:</span>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={photos[activePhotoIdx].panY ?? 50} 
                        onChange={(e) => updatePhotoSetting('panY', Number(e.target.value))} 
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>పక్కకి (ఎడమ/కుడి):</span>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={photos[activePhotoIdx].panX ?? 50} 
                        onChange={(e) => updatePhotoSetting('panX', Number(e.target.value))} 
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-t border-gray-600 pt-2">
                    <input 
                      type="checkbox" 
                      id="captionCheck"
                      checked={photos[activePhotoIdx].showCaption} 
                      onChange={(e) => updatePhotoSetting('caption', e.target.checked)} 
                    />
                    <label htmlFor="captionCheck" className="font-bold">ఫోటో కింద క్యాప్షన్ (వివరణ) కావాలి</label>
                  </div>

                  {photos[activePhotoIdx].showCaption && (
                    <div>
                      <input 
                        type="text" 
                        value={photos[activePhotoIdx].caption} 
                        onChange={(e) => updatePhotoSetting('caption', e.target.value)}
                        placeholder="సారాంశం/వివరణ రాయండి"
                        className="w-full p-1 bg-white text-black border border-black rounded font-bold text-xs"
                      />
                    </div>
                  )}

                  <button onClick={() => removePhoto(activePhotoIdx)} className="bg-red-600 text-white px-2 py-1 rounded w-full mt-2">
                    ఈ ఫోటోను తొలగించు
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <button onClick={downloadPNG} className="w-full bg-green-600 hover:bg-green-700 font-bold py-2 rounded text-sm">
          PNG క్లిప్పింగ్ డౌన్‌లోడ్ చేయండి
        </button>
      </div>
      {/* కుడి వైపు - క్లిప్పింగ్ పేపర్ ప్రివ్యూ */}
      <div className="flex-1 flex justify-center items-start overflow-y-auto max-h-[95vh] p-2">
        <div 
          ref={canvasRef} 
          className="bg-white text-black p-5 rounded shadow-2xl w-[650px] border border-gray-300"
          style={{ height: 'auto', minHeight: '300px' }}
        >
          {/* 1. పేపర్ లోగో */}
          {logo && (
            <div className={"flex mb-2 justify-" + logoAlign + " w-full"}>
              <img 
                src={logo} 
                alt="Logo" 
                style={{ 
                  width: logoWidth + 'px', 
                  height: logoHeight + 'px', 
                  objectFit: 'contain',
                  maxWidth: '100%' 
                }} 
              />
            </div>
          )}

          {/* 2. ప్రధాన శీర్షిక (Headline) */}
          {headline && (
            <div 
              style={{ 
                background: headBg, 
                color: headColor, 
                padding: '8px 12px', 
                marginBottom: '8px',
                textAlign: headAlign
              }} 
              className="w-full rounded"
            >
              <h1 
                style={{ 
                  fontSize: headSize + 'px', 
                  lineHeight: '1.25', 
                  fontWeight: '900',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontFamily: headFont
                }} 
              >
                {headline}
              </h1>
            </div>
          )}

          {/* 3. ఉప శీర్షికలు (Sub Headlines) */}
          {subHeadline && (
            <div 
              style={{ 
                backgroundColor: subBg, 
                color: subColor, 
                padding: '6px 10px',
                borderLeft: '4px solid ' + subBorderColor 
              }} 
              className="mb-3 text-left font-bold space-y-1 w-full"
            >
              {subHeadline.split('\n').map((sub, i) => (
                sub.trim() && (
                  <div key={i} className="flex items-start gap-2">
                    <span style={{ color: subBorderColor }} className="font-extrabold">{subBullet}</span>
                    <h2 style={{ fontSize: subSize + 'px', lineHeight: '1.3' }}>
                      {sub.trim()}
                    </h2>
                  </div>
                )
              ))}
            </div>
          )}

          {/* 4. ఫోటోలు & వార్త కంటెంట్ (జస్టిఫికేషన్ మరియు ఆటో ఫ్లో అప్‌డేట్‌తో) */}
          <div 
            style={{ 
              fontSize: bodyFontSize + 'px', 
              color: bodyTextColor,
              columnCount: newsColumns,
              columnGap: '16px',
              textAlign: 'justify',
              textAlignLast: 'left',
              textJustify: 'inter-word',
              hyphens: 'auto',
              wordBreak: 'break-word',
              lineHeight: '1.6'
            }}
            className="clear-both"
          >
            {photos.map((imgObj, idx) => {
              const alignStyle = imgObj.align === 'center' 
                ? { 
                    display: 'block', 
                    margin: (imgObj.marginTop || 0) + 'px auto 12px auto', 
                    width: imgObj.size + 'px', 
                    clear: 'both' 
                  }
                : { 
                    float: imgObj.align || 'left', 
                    marginLeft: imgObj.align === 'right' ? ((imgObj.marginLeft || 0) + 14) + 'px' : (imgObj.marginLeft || 0) + 'px',
                    marginRight: imgObj.align === 'left' ? '14px' : '0px', 
                    marginTop: (imgObj.marginTop || 0) + 'px',
                    marginBottom: '10px', 
                    width: imgObj.size + 'px',
                    ...getPhotoShapeStyle(imgObj.shape)
                  };

              return (
                <div key={idx + '-' + imgObj.shape + '-' + imgObj.align + '-' + imgObj.marginTop + '-' + imgObj.marginLeft} style={alignStyle} className="relative z-10">
                  <div style={{ overflow: 'hidden', border: '1px solid #ccc', ...getPhotoShapeStyle(imgObj.shape) }}>
                    <img 
                      src={imgObj.url} 
                      alt="News" 
                      style={{ 
                        width: '100%', 
                        height: '100%',
                        transform: 'scale(' + (imgObj.zoom / 100) + ')',
                        objectPosition: (imgObj.panX ?? 50) + '% ' + (imgObj.panY ?? 50) + '%',
                        transition: 'transform 0.1s, object-position 0.1s'
                      }} 
                      className="block object-cover"
                    />
                  </div>

                  {/* ఫోటో కింద క్యాప్షన్ */}
                  {imgObj.showCaption && imgObj.caption && (
                    <div className="mt-1 p-1 text-[11px] font-bold text-black bg-gray-100 border border-gray-400 text-center leading-tight">
                      {imgObj.caption}
                    </div>
                  )}
                </div>
              );
            })}

            {/* డేట్‌లైన్ (రెడ్ కలర్) + వార్తా పాఠ్యం */}
            <div className="inline">
              <span className="font-bold mr-1" style={{ color: dateLineColor }}>
                {dateLine}
              </span>
              <span>
                {bodyText.replace(/\n+/g, ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleClippingEditor;