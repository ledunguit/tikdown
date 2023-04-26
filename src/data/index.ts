import { VideoSearchParams } from "@/types";
import { HttpClient } from "./http-client";
import { API_ENDPOINT } from "./endpoint";

class Client {
  videos = {
    get: (params: VideoSearchParams) => {
      return HttpClient.get(API_ENDPOINT.GET_VIDEOS, params);
    },
  };
}

const client = new Client();

export default client;
