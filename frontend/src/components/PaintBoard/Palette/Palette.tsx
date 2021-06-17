/** @format */

import { faPaintBrush } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import React, { useCallback, useState } from "react";
import { DEFAULT_STROKE_STYLE, StrokeStyle, UsableBrushes, UsableColors } from "../../../lib/Stroke";
import cls from "./Palette.module.scss";

type Props = {
  changePalette: (palette: StrokeStyle) => void;
};

/**
 * ストロークの色・太さを変更するパレットボード
 */
const Palette = function ({ changePalette }: Props) {
  const [palette, setPalette] = useState<StrokeStyle>(DEFAULT_STROKE_STYLE);
  const changeColor = useCallback(
    (name: string) => {
      const foundColor = UsableColors.find((c) => c.name === name);
      if (foundColor) {
        const newPalette = { ...palette, color: foundColor };
        setPalette(newPalette);
        changePalette(newPalette);
      }
    },
    [changePalette, setPalette, palette]
  );

  const changeBrush = useCallback(
    (brush: string) => {
      const foundBrush = UsableBrushes.find((b) => b.name === brush);
      if (foundBrush) {
        const newPalette = { ...palette, brush: foundBrush };
        setPalette(newPalette);
        changePalette(newPalette);
      }
    },
    [changePalette, setPalette, palette]
  );

  return (
    <div className={cls.paletteContainer}>
      <div className={cls.colorPalette}>
        {UsableColors.map(({ name, code }) => (
          <span key={name} style={{ backgroundColor: code }} onClick={() => changeColor(name)} />
        ))}
        <span className={cls.currentColor} style={{ color: palette.color.code }}>
          <FontAwesomeIcon icon={faPaintBrush} />
        </span>
      </div>

      <div className={cls.brushPalette}>
        {UsableBrushes.map((brush) => (
          <span
            className={clsx({
              [cls[`brush-${brush.name}`]]: true,
              [cls.current]: brush.name === palette.brush.name,
            })}
            onClick={() => changeBrush(brush.name)}
            key={brush.name}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Palette;
