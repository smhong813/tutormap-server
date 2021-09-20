const express = require("express");
const passport = require("passport");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const User = require("../schemas/user");
const { OAuth2Client } = require("google-auth-library");
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
  console.log("tokenId:", req.body.tokenId);
  const ticket = await client.verifyIdToken({
    idToken: req.body.tokenId,
    audience: GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  console.log("payload:", payload);

  let user =
    (await User.findOne({ email: payload.email })) ||
    (await User.create({
      displayName: payload.name,
      email: payload.email,
      profileImageUrl: payload.picture,
      provider: "google",
      providerId: payload.sub,
    }));
  if (user) {
    user = user.toObject();
    delete user.provider;
    delete user.providerId;
    delete user.createdAt;
    delete user.__v;
    console.log("user:", user);

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: 60 * 60 });
    return res.json({
      email: user.email,
      displayName: user.displayName,
      profileImageUrl: user.profileImageUrl,
      accessToken: token,
    });
  }
});

module.exports = router;
