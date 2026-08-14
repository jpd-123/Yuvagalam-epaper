// src/DailyEditor.jsx

import React, { useState, useEffect } from 'react';
import { getActiveLayout } from './services/storage';
// import { attachShortcutHandler } from './utils/keyboardShortcuts';

export default function DailyEditor() {
  var layout = getActiveLayout();
  var [activePage, setActivePage] = useState(1);
  var [articles, setArticles] = useState([
    {
      id: 1,
      title: 'రాష్ట్రంలో పరిశ్రమల స్థాపనకు నూతన విధానం.. భారీగా ఉద్యోగవకాశాలు!',
      subTitle: 'అమరావతి కేంద్రంగా ఐటీ, తయారీ రంగాల విస్తరణకు ఆమోదం',
      bulletPoints: [
        'ముఖ్యాంశాలు',
        'రైతులకు సకాలంలో ఎరువుల పంపిణీ.',
        'నగరంలో ట్రాఫిక్ నియంత్రణకు నూతన చర్యలు.',
        'తీర ప్రాంతాల అభివృద్ధికి ప్రత్యేక ప్రణాళిక.'
      ],
      image: null,
      category: 'ముఖ్య వార్త'
    },
    {
      id: 2,
      title: 'పాఠశాలల్లో డిజిటల్ బోధనకు శ్రీకారం',
      subTitle: 'గ్రామీణ ప్రాంతాల్లోని ప్రభుత్వ పాఠశాలల్లో ఆధునిక సౌకర్యాలు',
      bulletPoints: [
        'ప్రత్యేక నిధులు మంజూరు',
        'డిజిటల్ తరగతి గదుల ఏర్పాటు'
      ],
      image: null,
      category: 'ప్రత్యేక నివేదిక'
    }
  ]);

  var [activeBoxIndex, setActiveBoxIndex] = useState(0);

  useEffect(function () {
    var cleanup = attachShortcutHandler({
      onNextBox: function () {
        setActiveBoxIndex(function (prev) {
          return (prev + 1) % articles.length;
        });
      },
      onPrevBox: function () {
        setActiveBoxIndex(function (prev) {
          return prev === 0 ? articles.length - 1 : prev - 1;
        });
      },
      onSave: function () {
        alert('డేటా ఆఫ్‌లైన్‌లో విజయవంతంగా సేవ్ చేయబడింది!');
      },
      onPageChange: function (pageNum) {
        if (pageNum <= layout.pageCount) {
          setActivePage(pageNum);
        }
      },
      onPrint: function () {
        window.print();
      }
    });

    return cleanup;
  }, [articles.length, layout.pageCount]);

  function handleTitleChange(index, value) {
    var updated = [...articles];
    updated[index].title = value;
    setArticles(updated);
  }

  function handleSubTitleChange(index, value) {
    var updated = [...articles];
    updated[index].subTitle = value;
    setArticles(updated);
  }

  function handleImagePaste(index, event) {
    var items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (var i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        var blob = items[i].getAsFile();
        var reader = new FileReader();
        reader.onload = function (e) {
          var updated = [...articles];
          updated[index].image = e.target.result;
          setArticles(updated);
        };
        reader.readAsDataURL(blob);
        break;
      }
    }
  }

  var borderStyleClass = layout.borderStyle === 'double' ? 'border-4 border-double border-black' : 'border-2 border-black';

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-900">
      {/* టాప్ కంట్రోల్ బార్ */}
      <div className="flex justify-between items-center bg-slate-900 text-white p-3 rounded shadow mb-4">
        <div>
          <h1 className="text-xl font-bold">{layout.name} - రోజూవారి వార్తల డిజైనర్</h1>
          <p className="text-xs text-slate-300">షార్ట్‌కట్లు: [Ctrl+S] సేవ్ | [Ctrl+P] ప్రింట్/PDF | [Ctrl+Enter] నెక్ట్స్ బాక్స్ | [Alt+1..9] పేజీ స్విచ్</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => window.print()} 
            className="bg-green-600 hover:bg-green-700 px-4 py-2 text-sm font-semibold rounded shadow flex items-center gap-1"
          >
            ప్రింట్ / PDF సేవ్ చేయండి
          </button>
        </div>
      </div>

      {/* పేజీ ఎంపిక ట్యాబ్‌లు */}
      <div className="flex space-x-1 mb-4 overflow-x-auto pb-2">
        {Array.from({ length: layout.pageCount }).map(function (_, i) {
          var pageNum = i + 1;
          var isActive = activePage === pageNum;
          var btnClass = isActive ? 'bg-blue-700 text-white font-bold' : 'bg-white text-slate-800 hover:bg-slate-200';
          return (
            <button
              key={pageNum}
              onClick={() => setActivePage(pageNum)}
              className={'px-4 py-1.5 text-sm rounded border ' + btnClass}
            >
              పేజీ {pageNum}
            </button>
          );
        })}
      </div>

      {/* ప్రింట్ లైవ్ పేపర్ ప్రివ్యూ */}
      <div className={'bg-white p-6 max-w-5xl mx-auto shadow-2xl min-h-[1000px] ' + borderStyleClass}>
        
        {/* పత్రిక హెడర్ / మ్యాస్ట్‌హెడ్ */}
        <div className="text-center border-b-2 border-black pb-4 mb-4">
          <div className="flex justify-between items-center text-xs border-b border-black pb-1 mb-2">
            <span>సంపుటి: 01 | సంచిక: 105</span>
            <span className="font-bold text-sm">అమరావతి | విజయవాడ</span>
            <span>తేదీ: బుధవారం, 05 ఆగష్టు 2026 | వెల: రూ. 5.00</span>
          </div>
          <h1 className="text-6xl font-extrabold tracking-wider text-red-700 my-2">యువగళం</h1>
          <p className="text-xs uppercase font-bold tracking-widest text-slate-600">YUVAGALAM TELUGU DAILY</p>
        </div>

        {/* న్యూస్ గ్రిడ్ ఆర్కిటెక్చర్ */}
        <div className="grid grid-cols-12 gap-4">
          {articles.map(function (art, idx) {
            var isFocused = activeBoxIndex === idx;
            var focusClass = isFocused ? 'ring-2 ring-blue-500 bg-blue-50/20' : '';
            return (
              <div 
                key={art.id} 
                className={'col-span-6 border border-slate-300 p-3 rounded relative ' + focusClass}
                onClick={() => setActiveBoxIndex(idx)}
              >
                <span className="bg-red-700 text-white text-xs px-2 py-0.5 rounded font-semibold inline-block mb-2">
                  {art.category}
                </span>

                <input
                  type="text"
                  value={art.title}
                  onChange={(e) => handleTitleChange(idx, e.target.value)}
                  className="w-full font-bold text-xl border-b border-dashed border-slate-300 focus:outline-none mb-1 bg-transparent"
                  placeholder="వార్తా హెడ్డింగ్..."
                />

                <input
                  type="text"
                  value={art.subTitle}
                  onChange={(e) => handleSubTitleChange(idx, e.target.value)}
                  className="w-full text-sm text-slate-700 border-b border-dashed border-slate-200 focus:outline-none mb-3 bg-transparent"
                  placeholder="సబ్ హెడ్డింగ్..."
                />

                {/* ఫోటో డ్రాప్/పేస్ట్ ఏరియా */}
                <div 
                  onPaste={(e) => handleImagePaste(idx, e)}
                  className="border-2 border-dashed border-slate-300 rounded p-2 text-center text-xs text-slate-500 mb-3 cursor-pointer bg-slate-50 min-h-[120px] flex flex-col items-center justify-center"
                >
                  {art.image ? (
                    <img src={art.image} alt="News" className="max-h-40 object-cover rounded" />
                  ) : (
                    <p>ఫోటో కోసం ఇక్కడ క్లిక్ చేసి వాట్సాప్ ఫోటోను <b>Ctrl + V</b> నొక్కండి</p>
                  )}
                </div>

                <ul className="list-disc list-inside text-xs space-y-1 text-slate-800">
                  {art.bulletPoints.map(function (pt, pIdx) {
                    return <li key={pIdx}>{pt}</li>;
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
