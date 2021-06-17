export type StrokeStyle = {
  color: Color;
  width: "normal" | "bold";
};

export type Color = {
  name: string;
  code: string;
};

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
  color: BLACK,
  width: "normal",
};
