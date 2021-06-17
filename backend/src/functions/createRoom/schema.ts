/** @format */

type Schema = {
  message: "createRoom";
  payload: {
    roomId: string;
    nickname: string;
  };
};

export default Schema;
