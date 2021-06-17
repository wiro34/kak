/** @format */

export type Stroke = {
  style: StrokeStyle;
  path: Coordinate[];
};

export type StrokeCommand = { command: "draw"; stroke: Stroke } | { command: "undo" };

export type Coordinate = {
  x: number;
  y: number;
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

export const UsableColors: Color[] = [
  { name: "Bl", code: "#000000" },
  { name: "Gy", code: "#aaaaaa" },
  { name: "Wh", code: "#ffffff" },
  { name: "Br", code: "#03a9f4" },
  { name: "Gr", code: "#4caf50" },
  { name: "Nv", code: "#3f51b5" },
  { name: "Bw", code: "#795548" },
  { name: "Or", code: "#ff9800" },
  { name: "Rd", code: "#e91e63" },
  { name: "Yw", code: "#fbe100" },
  { name: "Bg", code: "#ffd8c5" },
  { name: "Pp", code: "#9c27b0" },
];

export const DEFAULT_STROKE_STYLE: StrokeStyle = {
  color: UsableColors[0],
  brush: UsableBrushes[0],
};

/**
 * StrokeCommand のリストから Stroke のリストに変換します
 */
export function strokeCommandToStrokeList(strokeCommands: StrokeCommand[]): Stroke[] {
  let strokeList: Stroke[] = [];
  strokeCommands.forEach((sc) => {
    switch (sc.command) {
      case "draw":
        strokeList.push(sc.stroke);
        break;
      case "undo":
        strokeList.pop();
        break;
    }
  });
  return strokeList;
}

/**
 * StrokeCommand を文字列表記にエンコードします
 */
export function stringifyStrokeCommand(strokeCommand: StrokeCommand): string {
  switch (strokeCommand.command) {
    case "draw":
      return [
        "draw",
        strokeCommand.stroke.style.brush.name,
        strokeCommand.stroke.style.color.name,
        strokeCommand.stroke.path.map((p) => `${p.x}^${p.y}`).join(","),
      ].join(",");
    case "undo":
      return "undo";
    default:
      throw new Error(`Failed to stringify StrokeCommand: command=${(strokeCommand as any).command}`);
  }
}

/**
 * StrokeCommand の文字列表記をデコードします
 */
export function parseStrokeCommand(stroke: string): StrokeCommand {
  const data = stroke.split(",");
  const command = data.shift();
  switch (command) {
    case "draw":
      const brush = UsableBrushes.find((b) => b.name === data[0]);
      const color = UsableColors.find((c) => c.name === data[1]);
      if (!brush || !color) {
        throw new Error("");
      }
      return {
        command,
        stroke: {
          style: {
            brush,
            color,
          },
          path: data.splice(2).map((p) => {
            const coords = p.split("^");
            return {
              x: parseInt(coords[0], 10),
              y: parseInt(coords[1], 10),
            };
          }),
        },
      };
    case "undo":
      return { command };
    default:
      throw new Error(`Failed to parse StrokeCommand: command=${command}`);
  }
}
