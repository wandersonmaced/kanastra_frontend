import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import * as Components from './components';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <Components.Navbar></Components.Navbar>
    <BrowserRouter basename="">
      <Routes>
        <Route path="/" element={<Components.NoMatch/>}/>
        <Route path="/formUpload" element={<Components.FileUploadForm/>}/>
        <Route path="/listOfDebts" element={<Components.ListOfCsvData/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);

