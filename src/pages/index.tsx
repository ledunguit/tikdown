import Image from "next/image";
import { Inter } from "next/font/google";
import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { API_ENDPOINT } from "@/data/endpoint";
import client from "@/data";
import { AxiosError } from "axios";
import { saveAs } from "file-saver";

const inter = Inter({ subsets: ["vietnamese"] });

export default function Home() {
  const [link, setLink] = useState("");
  const [awemeId, setAwemeId] = useState("");

  const convertLinkToVideoID = (link: string): string => {
    const matching = link.includes("/video/");

    if (!matching) {
      return "";
    }

    const idVideo = link.substring(link.indexOf("/video/") + 7, link.length);

    return idVideo.length > 19
      ? idVideo.substring(0, idVideo.indexOf("?"))
      : idVideo;
  };

  const headers = new Headers();
  headers.append(
    "User-Agent",
    "TikTok 26.2.0 rv:262018 (iPhone iOS 14.4.2 en_US) Cronet"
  );

  useEffect(() => {
    setAwemeId(convertLinkToVideoID(link));
  }, [link]);

  const { data, isLoading, isError, error, isSuccess, isRefetching } = useQuery<
    any,
    AxiosError
  >(
    [API_ENDPOINT.GET_VIDEOS, link],
    () => client.videos.get({ aweme_id: awemeId }),
    {
      enabled: !!awemeId,
    }
  );

  const queryClient = useQueryClient();

  const handleOnChangeLink = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };

  const handleClickGetVideo = () => {
    if (!awemeId) {
    } else {
      queryClient.refetchQueries([API_ENDPOINT.GET_VIDEOS, link]);
    }
  };

  const saveFile = (url: string) => {
    saveAs(url);
  };

  return (
    <main
      className={`flex min-h-screen bg-slate-900 flex-col items-center p-5 sm:p-10 md:p-15 lg:p-20 xl:p-24 ${inter.className}`}
    >
      <Image
        className="mb-4"
        src={"/icons/tiktok-logo.svg"}
        alt="tiktok-logo"
        width={100}
        height={100}
      ></Image>
      <h1 className="w-full p-1 py-3 text-xl text-center text-white rounded-md drop-shadow-lg shadow-black mb-2">
        Tikdown made with <span className="text-red-700">♥</span> by Lê Đăng
        Dũng
      </h1>

      <div className="w-full flex-grow text-white rounded-md p-2">
        <div className="p-2 w-full flex justify-center items-center">
          <label className="font-bold me-2" htmlFor="videoUrl">
            Video URL:
          </label>
          <input
            className="outline-none flex-grow rounded-md text-white bg-slate-700 p-2"
            type="text"
            value={link}
            onChange={handleOnChangeLink}
            placeholder="https://www.tiktok.com/@xxx.xxx/video/xxxxxxxxxxxxxxxxxxx"
          />
        </div>
        <div className="w-full text-center mt-2">
          <button
            className="bg-teal-600 py-2 px-4 rounded-full"
            onClick={handleClickGetVideo}
          >
            Get video
          </button>
        </div>

        <div className="w-full my-4">
          {isError && (
            <div className="text-black bg-yellow-400 rounded-md shadow-sm p-2 text-center">
              {error?.message}
            </div>
          )}
          {(isLoading || isRefetching) && (
            <div className="text-black bg-yellow-400 rounded-md shadow-sm p-2 text-center">
              Loading...
            </div>
          )}
          {isSuccess && !isRefetching && (
            <div className="p-2 rounded-md text-center">
              <h6 className="text-base font-bold bg-green-500 rounded-md p-2 mb-2">
                Thành công! Nhấn button dưới để download
              </h6>

              <button
                className="bg-teal-600 py-2 px-4 rounded-full"
                onClick={() => saveFile(data.url)}
              >
                Download
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
