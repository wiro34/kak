/** @format */

import React, { useCallback, useState } from "react";
import { BLACK, DEFAULT_PALETTE, Palette, UsableColors } from "../../lib/Palette";
import cls from "./Palette.module.scss";

type Props = {
  changePalette: (palette: Palette) => void;
};

const PaletteBoard = function ({ changePalette }: Props) {
  const [palette, setPalette] = useState<Palette>(DEFAULT_PALETTE);
  const changeColor = useCallback(
    (name: string) => {
      const foundColor = UsableColors.find((c) => c.name === name);
      if (foundColor) {
        const newPalette = { ...palette, color: foundColor };
        setPalette(newPalette);
        changePalette(newPalette);
      }
    },
    [changePalette, palette, setPalette]
  );
  return (
    <div>
      <div className={cls.colorPaletteContainer}>
        {UsableColors.map(({ name, code }) => (
          <span style={{ backgroundColor: code }} key={name} onClick={() => changeColor(name)} />
        ))}
      </div>
    </div>
  );
};

export default PaletteBoard;
