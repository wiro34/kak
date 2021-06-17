/** @format */

import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";

export const middyfy = (handler) => {
  // TODO: 動いてないっぽい？
  return middy(handler).use(jsonBodyParser());
};
