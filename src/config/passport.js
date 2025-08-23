import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

if (!passport._strategies?.google) {
  console.log("👉 Google Callback URL:", process.env.GOOGLE_CALLBACK_URL);
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL ||
          "http://localhost:5001/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            console.warn("Google login failed: no email in profile");
            return done(null, false, { message: "No email found in Google account" });
          }

          let user = await User.findOne({ email });

          if (!user) {
            user = await User.create({
              name: profile.displayName,
              email,
              googleId: profile.id,
              isVerified: true, // Google users trusted by default
            });
          }

          return done(null, user);
        } catch (err) {
          console.error("Google OAuth error:", err.message);
          return done(err, null);
        }
      }
    )
  );
}

export default passport;
