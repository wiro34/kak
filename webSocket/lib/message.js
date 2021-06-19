/** @format */

export function roomCreated(roomId) {
  return {
    message: "roomCreated",
    payload: { roomId },
  };
}
