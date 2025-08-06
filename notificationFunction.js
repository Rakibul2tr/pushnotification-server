const axios = require("axios");
require("dotenv").config();

const { google } = require("googleapis");
// 🔐 Path to your service account JSON file
const serviceAccountJSON = process.env.GOOGLE_APPLICATION_CREDENTIALS
  ? JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS)
  : require("./firebase-service-account.json");
const MESSAGING_SCOPE = "https://www.googleapis.com/auth/firebase.messaging";
const PROJECT_ID = process.env.FCM_PROJECT_ID;

// 🔑 Get Access Token from Service Account
async function getAccessToken() {
  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccountJSON,
    scopes: [MESSAGING_SCOPE],
  });

  const client = await auth.getClient();
  const token = await client.getAccessToken();
//   console.log('token',token);
  return token.token;
}
 async function sendNotification({ token, title, body }) {
  const accessToken = await getAccessToken();

  const message = {
    message: {
      token: token,
      notification: {
        title: title,
        body: body,
      },
      android: {
        priority: "high",
        notification: {
          sound: "default",
        },
      },
    },
  };

  await axios
    .post(
      `https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send`,
      message,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      console.log("✅ Notification sent", res.data);
    })
    .catch((err) => {
      console.error("❌ Notification error", err.response.data);
    });
}
module.exports = { sendNotification };