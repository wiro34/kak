/** @format */

export type Coordinate = {
  x: number;
  y: number;
};

export type Stroke = {
  strokeStyle: StrokeStyle;
  path: Coordinate[];
};

export type StrokeStyle = {
  color: Color;
  brush: Brush;
};

export type Color = {
  name: string;
  code: string;
};

export type Brush = {
  name: string;
  width: number;
};

export const UsableBrushes = [
  { name: "thin", width: 2 },
  { name: "normal", width: 6 },
  { name: "bold", width: 10 },
  { name: "large", width: 20 },
];

export const BLACK: Color = { name: "Bl", code: "#000000" };

export const UsableColors: Color[] = [
  BLACK,
  { name: "Gy", code: "#aaaaaa" },
  { name: "Br", code: "#2196f3" },
  { name: "Wh", code: "#ffffff" },
  { name: "Lb", code: "#79ccfd" },
  { name: "Gr", code: "#4caf50" },
  { name: "Bw", code: "#795548" },
  { name: "Or", code: "#ff9800" },
  { name: "Lg", code: "#8bc34a" },
  { name: "Rd", code: "#e91e63" },
  { name: "Yw", code: "#fbe100" },
  { name: "Bg", code: "#ffd8c5" },
  { name: "Pk", code: "#ff00eb" },
  { name: "Pp", code: "#9c27b0" },
];

export const DEFAULT_STROKE_STYLE: StrokeStyle = {
  color: UsableColors[0],
  brush: UsableBrushes[0],
};
