/** @format */

import React, { useCallback, useEffect, useRef, useState } from "react";
import cls from "./Palette.module.scss";

type Palette = {
  color: Color;
  width: "normal" | "bold";
};

type Color = {
  letter: string;
  code: string;
};

const UsableColors: Color[] = [
  { letter: "Br", code: "#000000" },
  { letter: "Gy", code: "#aaaaaa" },
  { letter: "Br", code: "#2196f3" },
  { letter: "Wh", code: "#ffffff" },
  { letter: "Lg", code: "#dddddd" },
  { letter: "Lb", code: "#79ccfd" },
  { letter: "Gr", code: "#4caf50" },
  { letter: "Bw", code: "#795548" },
  { letter: "Or", code: "#ff9800" },
  { letter: "Lg", code: "#8bc34a" },
  { letter: "Rd", code: "#e91e63" },
  { letter: "Yw", code: "#fbe100" },
  { letter: "Bg", code: "#ffd8c5" },
  { letter: "Pk", code: "#ff00eb" },
  { letter: "Pp", code: "#9c27b0" },
];

type Props = {
  palette?: Palette;
};

const Palette = function ({ palette }: Props) {
  return (
    <div>
      <div className={cls.colorPaletteContainer}>
        {UsableColors.map(({ letter, code }) => (
          <span style={{ backgroundColor: code }} />
        ))}
      </div>
    </div>
  );
};

export default Palette;
