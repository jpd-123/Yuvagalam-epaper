import React, { useState } from 'react';
import Dashboard from './Dashboard';
import MasterLayoutbuilder from './MasterLayoutbuilder'; // మీ మాస్టర్ లేఅవుట్ కాంపోనెంట్ పేరు
import SingleClippingEditor from './SingleClippingEditor'; // మీ క్లిప్పింగ్ కాంపోనెంట్ పేరు

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'master', 'clipping'
  const [selectedLayout, setSelectedLayout] = useState(null);

  return (
    <div>
      {currentView === 'dashboard' && (
        <Dashboard 
          onCreateNewLayout={() => setCurrentView('master')}
          onOpenClippingEditor={() => setCurrentView('clipping')}
          onSelectLayout={(layout) => {
            setSelectedLayout(layout);
            setCurrentView('master');
          }}
        />
      )}

      {currentView === 'master' && (
        <MasterLayoutbuilder 
          onBackToDashboard={() => setCurrentView('dashboard')}
          selectedLayout={selectedLayout}
        />
      )}

      {currentView === 'clipping' && (
        <SingleClippingEditor 
          onBackToDashboard={() => setCurrentView('dashboard')}
        />
      )}
    </div>
  );
}
