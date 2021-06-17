/** @format */

type Schema = {
  message: "joinRoom";
  payload: {
    nickname: string;
    roomId: string;
  };
};

export default Schema;
