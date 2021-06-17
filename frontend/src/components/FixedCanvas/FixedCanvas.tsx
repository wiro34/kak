/** @format */

import React, { forwardRef, ForwardRefExoticComponent, PropsWithRef } from "react";
import clsx from "clsx";
import cls from "./FixedCanvas.module.scss";

export type ElementFrec<T extends keyof JSX.IntrinsicElements> = ForwardRefExoticComponent<
  PropsWithRef<JSX.IntrinsicElements[T]>
>;

/**
 * canvas 要素を含む div 要素はなぜか高さが微妙にずれる ( chrome だけ？ ) ので
 * 高さを調整したコンポーネントとして定義
 */
const FixedCanvas: ElementFrec<"canvas"> = forwardRef((props, ref) => {
  return (
    <div style={{ width: `${props.width}px`, height: `${props.height}px` }}>
      <canvas {...props} width="640" height="480" ref={ref} className={clsx(props.className, cls.canvas)} />
    </div>
  );
});

export default FixedCanvas;
