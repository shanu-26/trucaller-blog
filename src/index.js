import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import List from './components/List';
import Detail from './components/Detail';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<List />} />
        <Route path="/:slug" element={<Detail />} />
      </Routes>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
