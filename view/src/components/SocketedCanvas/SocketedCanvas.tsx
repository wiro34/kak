/** @format */

import React, { useCallback, useEffect, useRef, useState } from "react";
import Sockette from "sockette";
import cls from "./DrawableCanvas.module.scss";
import { BLACK, StrokeStyle } from "../../lib/Stroke";

type Coordinate = {
  x: number;
  y: number;
};

type Props = {
  strokeStyle: StrokeStyle;
  editable?: boolean;
};

const DrawableCanvas = function ({ strokeStyle, editable }: Props) {
  // const canvasRef = useRef<HTMLCanvasElement>(null);
  // const [drawing, setDrawing] = useState(false);
  // const [leaveInDrawing, setLeaveInDrawing] = useState(false);
  // const [lastPoint, setLastPoint] = useState<Coordinate | undefined>(undefined);
  // const [socket, setSocket] = useState<Sockette | undefined>(undefined);

  // const startDraw = useCallback((event: MouseEvent) => {
  //   const coordinates = getCoordinates(event);
  //   if (coordinates) {
  //     setDrawing(true);
  //     setLastPoint(coordinates);
  //   }
  // }, []);
  // const doDrawing = useCallback(
  //   (event: MouseEvent) => {
  //     if (drawing) {
  //       const coordinates = getCoordinates(event);
  //       if (coordinates && lastPoint) {
  //         // console.log("move", lastPoint, coordinates);
  //         if (socket) {
  //           socket.json({
  //             message: "sendMessage",
  //             roomId: "test",
  //             data: { strokeStyle, lastPoint, coordinates },
  //           });
  //         }
  //         drawLine(strokeStyle, lastPoint, coordinates);
  //       }
  //       setLastPoint(coordinates);
  //     }
  //   },
  //   [drawing, lastPoint, strokeStyle, socket]
  // );
  // const stopDraw = useCallback((event: MouseEvent) => {
  //   setDrawing(false);
  // }, []);
  // const enterDraw = useCallback(
  //   (event: MouseEvent) => {
  //     if (leaveInDrawing) {
  //       setLastPoint(getCoordinates(event));
  //       setDrawing(true);
  //       setLeaveInDrawing(false);
  //     }
  //   },
  //   [leaveInDrawing, setLeaveInDrawing, setDrawing]
  // );
  // const leaveDraw = useCallback(
  //   (event: MouseEvent) => {
  //     if (drawing) {
  //       setLeaveInDrawing(true);
  //       setDrawing(false);
  //     }
  //   },
  //   [drawing, setLeaveInDrawing, setDrawing]
  // );

  // const onReceivedMessage = (event: any) => {
  //   console.log(event);
  //   const data = JSON.parse(event.data);
  //   console.log(data);
  //   drawLine(data.palette, data.lastPoint, data.coordinates);
  // };

  // useEffect(() => {
  //   if (!canvasRef.current) {
  //     return;
  //   }
  //   const canvas: HTMLCanvasElement = canvasRef.current;
  //   canvas.addEventListener("mousedown", startDraw);
  //   canvas.addEventListener("mousemove", doDrawing);
  //   canvas.addEventListener("mouseup", stopDraw);
  //   canvas.addEventListener("mouseenter", enterDraw);
  //   canvas.addEventListener("mouseleave", leaveDraw);
  //   return () => {
  //     canvas.removeEventListener("mousedown", startDraw);
  //     canvas.removeEventListener("mousemove", doDrawing);
  //     canvas.removeEventListener("mouseup", stopDraw);
  //     canvas.removeEventListener("mouseenter", enterDraw);
  //     canvas.removeEventListener("mouseleave", leaveDraw);
  //   };
  // }, [startDraw, doDrawing, stopDraw, enterDraw, leaveDraw]);

  // useEffect(() => {
  //   const socket = newConnection("test", onReceivedMessage);
  //   setSocket(socket);
  //   return () => {
  //     if (socket) {
  //       socket.close();
  //     }
  //   };
  // }, []);

  // const drawLine = (
  //   palette: Palette,
  //   originalMousePosition: Coordinate,
  //   newMousePosition: Coordinate
  // ) => {
  //   if (!canvasRef.current) {
  //     return;
  //   }
  //   const canvas: HTMLCanvasElement = canvasRef.current;
  //   const context = canvas.getContext("2d");
  //   if (context) {
  //     context.strokeStyle = palette.color.code;
  //     context.lineJoin = "round";
  //     context.lineWidth = 5;

  //     context.beginPath();
  //     context.moveTo(originalMousePosition.x, originalMousePosition.y);
  //     context.lineTo(newMousePosition.x, newMousePosition.y);
  //     context.closePath();

  //     context.stroke();
  //   }
  // };
  // const getCoordinates = (event: MouseEvent): Coordinate | undefined => {
  //   if (!canvasRef.current) {
  //     return;
  //   }

  //   const canvas: HTMLCanvasElement = canvasRef.current;
  //   return {
  //     x: event.pageX - canvas.offsetLeft,
  //     y: event.pageY - canvas.offsetTop,
  //   };
  // };

  // if (!socket) {
  //   return (
  //     <div>
  //       <h2>Loading...</h2>
  //     </div>
  //   );
  // }

  // return (
  //   <div>
  //     <canvas
  //       width="640"
  //       height="480"
  //       ref={canvasRef}
  //       className={cls.canvas}
  //     ></canvas>
  //   </div>
  // );
  return null;
};

export default DrawableCanvas;
