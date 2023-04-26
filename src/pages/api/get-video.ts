import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  url: string;
  id: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const headers = new Headers();
  headers.append(
    "User-Agent",
    "TikTok 26.2.0 rv:262018 (iPhone; iOS 14.4.2; en_US) Cronet"
  );

  const awemeID = req.query?.aweme_id;

  const request = await fetch(
    `https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/?aweme_id=${awemeID}`,
    {
      headers: headers,
      method: "GET",
    }
  );

  const body = await request.text();
  try {
    var response = JSON.parse(body);
  } catch (err) {
    res.status(500).json({
      url: "",
      id: awemeID,
      error: "Server error",
    });
  }
  const urlMedia = response.aweme_list[0].video.play_addr.url_list[0];

  const responseData = {
    url: urlMedia,
    id: awemeID,
  };

  res.status(200).json(responseData);
}
