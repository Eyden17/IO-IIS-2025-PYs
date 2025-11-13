import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./Page/Home/menu";
import Algoritmo_3 from "./Page/Algoritmo/Algoritmo_3";
;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/algoritmo_3" element={<Algoritmo_3 />} />
      </Routes>
    </Router>
  );
}

export default App;
