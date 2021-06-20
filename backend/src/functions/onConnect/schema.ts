/** @format */

type Schema = {
  message: "createRoom";
  payload: {
    name: string;
    roomId: string;
  };
};

export default Schema;
