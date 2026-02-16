import pkg from "agora-access-token";

const { RtcTokenBuilder, RtcRole } = pkg;

export const generateAgoraToken = async (req, res) => {
  try {
    const { channelName } = req.query;

    if (!channelName) {
      return res.status(400).json({ message: "channelName is required" });
    }

    const appID = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    if (!appID || !appCertificate) {
      return res
        .status(500)
        .json({ message: "Agora App ID or Certificate missing in .env" });
    }

    // user id (can be random or logged user id)
    const uid = Math.floor(Math.random() * 100000);

    // expire time (1 hour)
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const role = RtcRole.PUBLISHER;

    const token = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );

    res.status(200).json({
      token,
      uid,
      channelName,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
