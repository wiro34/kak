/** @format */

import React, { useState } from "react";
import "./App.css";
import DrawableCanvas from "./components/DrawableCanvas/DrawableCanvas";
import PaletteBoard from "./components/PaletteBoard/PaletteBoard";
import { DEFAULT_STROKE_STYLE, StrokeStyle } from "./lib/StrokeStyle";

function App() {
  const [strokeStyle, setStrokeStyle] =
    useState<StrokeStyle>(DEFAULT_STROKE_STYLE);

  return (
    <div className="App">
      <h1>aaaa</h1>
      <PaletteBoard changePalette={(p) => setStrokeStyle(p)} />
      <DrawableCanvas strokeStyle={strokeStyle} editable />
    </div>
  );
}

export default App;
