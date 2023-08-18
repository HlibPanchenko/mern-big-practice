import axios from 'axios';
import fs from "fs";
import config from "config";

const IMGUR_UPLOAD_URL = 'https://api.imgur.com/3/upload';
const CLIENT_ID = config.get('imgurClientId')

export async function uploadToImgur(filePath:string) {
  try {
    const image = fs.readFileSync(filePath, { encoding: 'base64' });

    const response = await axios.post(
      IMGUR_UPLOAD_URL,
      {
        image: image,
        type: 'base64',
      },
      {
        headers: {
          Authorization: `Client-ID ${CLIENT_ID}`,
        },
      }
    );

    return response.data.data.link;
  } catch (error) {
    console.error('Error uploading to Imgur:', error);
    return null;
  }
}
