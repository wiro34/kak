/** @format */

import React, { useState } from "react";
import "./App.css";
import DrawableCanvas from "./components/DrawableCanvas/DrawableCanvas";
import PaletteBoard from "./components/PaletteBoard/PaletteBoard";
import { DEFAULT_PALETTE, Palette } from "./lib/Palette";

function App() {
  const [palette, setPalette] = useState<Palette>(DEFAULT_PALETTE);

  return (
    <div className="App">
      <h1>aaaa</h1>
      <PaletteBoard changePalette={(p) => setPalette(p)} />
      <DrawableCanvas palette={palette} editable />
    </div>
  );
}

export default App;
