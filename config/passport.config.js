import passport from "passport";
import GitHubStrategy from "passport-github2";
import local from "passport-local";
import usersModel from "../dao/dbManagers/models/users.model.js";
import { createHash, isValidPassowrd } from "../utils.js";

// local es autenticación con usuario y contraseña
const LocalStrategy = local.Strategy;

export const initializePassport = () => {
  // Implementación del mecanismo de autenticacion con github
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.40d942bf70c1cd43",
        clientSecret: "c29ac1ca0a57308d922bddf7a845bf96f41aade1",
        callbackURL: "http://localhost:8080/api/sessions/github-callback",
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          const user = await usersModel.findOne({ email });

          if (!user) {
            // Crear la cuenta o usuario desde 0
            const newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: 18,
              email,
              password: "",
              role: "user",
            };
            const result = await usersModel.create(newUser);
            return done(null, result);
          } else {
            return done(null, user);
          }
        } catch (error) {
          console.log(error);
          return done("Incorrect credentials");
        }
      }
    )
  );

  // Implementación del mecanismo de autenticacion con password y contraseña
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true, // Permite acceder al objeto req como cualquier otro middleware
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, age } = req.body;

          const user = await usersModel.findOne({ email: username });
          if (user) {
            return done(null, false);
          }
          const hashedPassword = createHash(password);
          const userToSave = {
            first_name,
            last_name,
            email: username,
            age,
            password: hashedPassword,
            role: "user",
          };
          const result = await usersModel.create(userToSave);
          return done(null, result); // --> req.user = {first_name, last_name ...}
        } catch (error) {
          return done("Incorrect credentials");
        }
      }
    )
  );
  // Implementación de nuestro login
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          if (
            username.trim() === "adminCoder@coder.com" &&
            password === "adminCod3r123"
          ) {
            const user = {
              _id: 1,
              first_name: `Admin Coder`,
              email: username,
              role: "admin",
            };
            return done(null, user);
          }
          const user = await usersModel.findOne({ email: username });
          const validPassword = isValidPassowrd(password, user.password);

          if (!user || !validPassword) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done("Incorrect credentials");
        }
      }
    )
  );

  // Serialización y deserialización
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    if (id == 1)
      return done(null, {
        first_name: `Admin Coder`,
        email: "adminCoder@coder.com",
        role: "admin",
      });
    const user = await usersModel.findById(id);
    done(null, user);
  });
};
