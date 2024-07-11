// imports
import express from "express";
import cors from "cors";
import passport from "passport";
import LocalStrategy from "passport-local";
import session from "express-session";
import morgan from "morgan";
import UserDao from "./dao/dao-users.mjs";
import ResourceDao from "./dao/dao-resources.mjs";

const userDao = new UserDao();
const resourceDao = new ResourceDao();


// init express
const app = express();
const port = 3001;
const AUTH_ROUNDS = 3;


// middlewares activation
const corsOpt = {
  origin: `http://localhost:5173`,
  credentials: true
}

app.use(cors(corsOpt));
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));

app.use(session({
  secret: "This is a secret string!",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.authenticate("session"));


// passport local strategy configuration
passport.use(new LocalStrategy(async function verify(username, password, callback) {
  const user = await userDao.getUserByCredentials(username, password);
  if (!user) {
    return callback(null, false, "Errore! Username e/o password errati.");
  }

  return callback(null, user);
}));

// passport serialization and deserialization
passport.serializeUser((user, callback) => {
  callback(null, user);
});

passport.deserializeUser((user, callback) => {
  return callback(null, user);
});

// middleware for login verification
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Not authorized" });
}


/* SERVER API */
// Route for retrieving the meme images to show during a match (1 or 3 rounds)
app.get("/api/images/random", (req, res) => {
  if (req.query.quantity === AUTH_ROUNDS && !req.isAuthenticated()) {
    res.status(400).json({ error: "Not authorized" });
  } 
  resourceDao.getImages(req.query.quantity)
  .then((resources) => res.json(resources))
  .catch((err) => res.status(500).json(err));
});

// Route for retrieving the meme captions to show during a single round
app.get("/api/images/:id/captions/random", (req, res) => {
  resourceDao.getCaptions(req.params.id)
  .then((resources) => res.json(resources))
  .catch((err) => res.status(500).json(err));
});

// Route for storing the data related to the played match once concluded
app.post("/api/users/:id/history", isLoggedIn, (req, res) => {
  console.log(req.body);
  resourceDao.storeMatchData(req.body)
  .then(() => res.status(200).end())
  .catch((err) => res.status(500).json(err));
});

// Route for retrieving the matches history related to a specific user
app.get("/api/users/:id/history", isLoggedIn, (req, res) => {
  resourceDao.getMatchData(req.params.id)
  .then((resources) => res.json(resources))
  .catch((err) => res.status(500).json(err));
});

// Login route
app.post("/api/sessions", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).send(info);
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(201).json(req.user);
    });
  })(req, res, next);
});

// Logout route
app.delete("/api/sessions/current", (req, res) => {
  req.logout(() => {
    res.end();
  });
});


// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});