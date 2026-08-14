// src/services/storage.js

var MASTER_LAYOUTS_KEY = 'sathwika_master_layouts';
var ACTIVE_LAYOUT_KEY = 'sathwika_active_layout';

// ప్రైమరీ డిఫాల్ట్ లేఅవుట్లు
var DEFAULT_LAYOUTS = [
  {
    id: 'a3_main',
    name: 'A3 మెయిన్ ఎడిషన్ (ప్రింట్ పేజీ)',
    paperSize: 'A3',
    columns: 5,
    borderStyle: 'double',
    pageCount: 16
  },
  {
    id: 'a3_tabloid',
    name: 'A3 డిస్ట్రిక్ట్ ట్యాబ్లాయిడ్',
    paperSize: 'A3',
    columns: 4,
    borderStyle: 'single',
    pageCount: 16
  },
  {
    id: 'broadsheet_classic',
    name: 'Broadsheet క్లాసిక్ పేపర్',
    paperSize: 'Broadsheet',
    columns: 8,
    borderStyle: 'double',
    pageCount: 16
  }
];

export function getSavedLayouts() {
  try {
    var data = localStorage.getItem(MASTER_LAYOUTS_KEY);
    if (!data) {
      localStorage.setItem(MASTER_LAYOUTS_KEY, JSON.stringify(DEFAULT_LAYOUTS));
      return DEFAULT_LAYOUTS;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading layouts:', err);
    return DEFAULT_LAYOUTS;
  }
}

export function saveMasterLayout(layoutData) {
  try {
    var existing = getSavedLayouts();
    var foundIndex = -1;
    for (var i = 0; i < existing.length; i++) {
      if (existing[i].id === layoutData.id) {
        foundIndex = i;
        break;
      }
    }
    if (foundIndex >= 0) {
      existing[foundIndex] = layoutData;
    } else {
      existing.push(layoutData);
    }
    localStorage.setItem(MASTER_LAYOUTS_KEY, JSON.stringify(existing));
    return true;
  } catch (err) {
    console.error('Error saving layout:', err);
    return false;
  }
}

export function setActiveLayout(layoutData) {
  try {
    localStorage.setItem(ACTIVE_LAYOUT_KEY, JSON.stringify(layoutData));
  } catch (err) {
    console.error('Error setting active layout:', err);
  }
}

export function getActiveLayout() {
  try {
    var data = localStorage.getItem(ACTIVE_LAYOUT_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return DEFAULT_LAYOUTS[0];
  } catch (err) {
    return DEFAULT_LAYOUTS[0];
  }
}