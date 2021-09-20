const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = () => {
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET,
      },
      (jwtPayload, cb) => {
        return cb(null, jwtPayload);
      }
    )
  );
};
