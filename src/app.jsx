import React, { useState } from 'react';
import Dashboard from './Dashboard';
import MasterLayoutbuilder from './MasterLayoutbuilder';
import DailyEditor from './DailyEditor';
import SingleClippingEditor from './SingleClippingEditor';

export default function App() {
  // వర్క్‌స్పేస్ వీక్షణలు: 'dashboard', 'builder', 'editor', 'clipping'
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeLayout, setActiveLayout] = useState(null);

  // డాష్‌బోర్డ్ నుండి మాస్టర్ లేఅవుట్ ఎంచుకున్నప్పుడు
  const handleSelectLayout = (layoutData) => {
    setActiveLayout(layoutData);
    setCurrentView('editor');
  };

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      
      {/* 1. డాష్‌బోర్డ్ వీక్షణ */}
      {currentView === 'dashboard' && (
        <Dashboard 
          onSelectLayout={handleSelectLayout}
          onCreateNewLayout={() => setCurrentView('builder')}
          onOpenClippingEditor={() => setCurrentView('clipping')}
        />
      )}

      {/* 2. మాస్టర్ లేఅవుట్ డిజైనర్ వీక్షణ */}
      {currentView === 'builder' && (
        <MasterLayoutbuilder 
          onBackToDashboard={() => setCurrentView('dashboard')}
        />
      )}

      {/* 3. రోజువారీ వార్తా ఎడిటర్ వీక్షణ */}
      {currentView === 'editor' && (
        <DailyEditor 
          masterLayoutData={activeLayout}
          onBackToDashboard={() => setCurrentView('dashboard')}
        />
      )}

      {/* 4. సింగిల్ న్యూస్ క్లిప్పింగ్ మేకర్ వీక్షణ */}
      {currentView === 'clipping' && (
        <SingleClippingEditor 
          onBackToDashboard={() => setCurrentView('dashboard')}
        />
      )}

    </div>
  );
}