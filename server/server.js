'use strict';

const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const { check, validationResult } = require('express-validator');
const DAOusers = require('./DAOusers');
const DAOfonts = require('./DAOfonts');
const DAOcolors = require('./DAOcolors');
const DAOtemplates = require('./DAOtemplates');
const DAOmemes = require('./DAOmemes');


const baseURL = "/api/v1";

// Init express
const port = 3001;
const app = new express();

// Setup Passport
passport.use(new LocalStrategy(
  function (username, password, done) {
    DAOusers.getUser(username, password).then((user) => {
      if (!user) {
        return done(null, false, "Incorrect username and/or password");
      }
      return done(null, user);
    }).catch((err) => {
      return done(err);
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  DAOusers.getUserById(id)
    .then(user => {
      done(null, user);
    }).catch((err) => {
      done(err);
    });
});

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(session({
  secret: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sollicitudin quam tortor, a dignissim orci tincidunt at. Fusce vel leo vel est volutpat feugiat.",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Custom middlewares
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({ error: "Unauthenticated user" });
}


/** Users APIs **/

// Login
// POST ${baseurl}/sessions
app.post(`${baseURL}/sessions`, function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal database error" });
    }
    if (!user) {
      return res.status(401).json({ error: info });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json(req.user);
    });
  })(req, res, next);
});

// Logout
// DELETE ${baseurl}/sessions/current
app.delete(`${baseURL}/sessions/current`, (req, res) => {
  req.logout();
  res.status(204).end();
});

// Check whether the user is logged in or not
// GET ${baseurl}/sessions/current
app.get(`${baseURL}/sessions/current`, isLoggedIn, (req, res) => {
  res.status(200).json(req.user);
});


/** Fonts APIs **/

// Retrieve the list of all the available fonts
// GET ${baseurl}/fonts
app.get(`${baseURL}/fonts`, async (_, res) => {
  try {
    const fonts = await DAOfonts.listFonts();
    res.status(200).json(fonts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal database error" });
  }
});

// Retrieve a font, given its <id>
// GET ${baseurl}/fonts/<id>
app.get(`${baseURL}/fonts/:id([0-9]+)`, async (req, res) => {
  try {
    const font = await DAOfonts.getFont(req.params.id);
    if (!font) {
      res.status(404).json({ error: "Font not found" });
      return;
    }
    res.status(200).json(font);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal database error" });
  }
});


/** Colors APIs **/

// Retrieve the list of all the available colors
// GET ${baseurl}/colors
app.get(`${baseURL}/colors`, async (_, res) => {
  try {
    const colors = await DAOcolors.listColors();
    res.status(200).json(colors);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal database error" });
  }
});

// Retrieve a color, given its <id>
// GET ${baseurl}/colors/<id>
app.get(`${baseURL}/colors/:id([0-9]+)`, async (req, res) => {
  try {
    const color = await DAOcolors.getColor(req.params.id);
    if (!color) {
      res.status(404).json({ error: "Color not found" });
      return;
    }
    res.status(200).json(color);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal database error" });
  }
});


/** Templates APIs **/

// Retrieve the list of all the available templates
// GET ${baseurl}/templates
app.get(`${baseURL}/templates`, async (_, res) => {
  try {
    const templates = await DAOtemplates.listTemplates();
    res.status(200).json(templates);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal database error" });
  }
});

// Retrieve a template, given its <id>
// GET ${baseurl}/templates/<id>
app.get(`${baseURL}/templates/:id([0-9]+)`, async (req, res) => {
  try {
    const template = await DAOtemplates.getTemplate(req.params.id);
    if (!template) {
      res.status(404).json({ error: "Template not found" });
      return;
    }
    res.status(200).json(template);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal database error" });
  }
});


/** Memes APIs **/

// Retrieve the list of all memes (authenticated user) or only public memes (unauthenticated user)
// GET ${baseurl}/memes
app.get(`${baseURL}/memes`, async (req, res) => {
  try {
    let memes = await DAOmemes.listMemes(req.isAuthenticated());
    const usersName = await DAOusers.listNames();
    memes = memes.map((meme) => ({ ...meme, userName: usersName.find((user) => (user.id === meme.userId)).name }));
    res.status(200).json(memes);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal database error" + err });
  }
});

// Retrieve a meme, given its <id>
// GET ${baseurl}/memes/<id>
app.get(`${baseURL}/memes/:id([0-9]+)`, async (req, res) => {
  try {
    let meme = await DAOmemes.getMeme(req.params.id);
    if (!meme) {
      res.status(404).json({ error: "Meme not found" });
      return;
    }
    if (!req.isAuthenticated() && !meme.isPublic) {
      res.status(401).json({ error: "Unauthenticated user" });
      return;
    }
    const usersName = await DAOusers.listNames();
    meme = { ...meme, userName: usersName.find((user) => (user.id === meme.userId)).name }
    res.status(200).json(meme);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal database error" });
  }
});

// Create a new meme, by providing all relevant information (except the "id")
// POST ${baseurl}/memes
app.post(`${baseURL}/memes`, isLoggedIn, [
  check("templateId").isInt({ min: 1 }),
  check("title").isLength({ min: 1 }),
  check("isPublic").isBoolean(),
  check("fontId").isInt({ min: 1 }),
  check("colorId").isInt({ min: 1 }),
  check("text1").isLength({ min: 1 }).optional({ checkFalsy: true }),
  check("text2").isLength({ min: 1 }).optional({ checkFalsy: true }),
  check("text3").isLength({ min: 1 }).optional({ checkFalsy: true })
], async (req, res) => {
  const errors = validationResult(req).formatWith((error) => {
    return `${error.param}: ${error.msg}`;
  });
  if (!errors.isEmpty()) {
    res.status(422).json({ error: errors.array().join("; ") });
    return;
  }

  try {
    const template = await DAOtemplates.getTemplate(req.body.templateId);
    if (!template) {
      res.status(422).json({ error: "Invalid templateId" });
      return;
    }

    const font = await DAOfonts.getFont(req.body.fontId);
    if (!font) {
      res.status(422).json({ error: "Invalid fontId" });
      return;
    }

    const color = await DAOcolors.getColor(req.body.colorId);
    if (!color) {
      res.status(422).json({ error: "Invalid colorId" });
      return;
    }

    if (template.textArea1 && !template.textArea2 && !template.textArea3) {
      if (!req.body.text1) {
        res.status(422).json({ error: "Specified template requires text1" });
        return;
      }
    }
    if (template.textArea1 && template.textArea2 && !template.textArea3) {
      if (!req.body.text1 && !req.body.text2) {
        res.status(422).json({ error: "Specified template requires at least one of text1 or text2" });
        return;
      }
    }
    if (template.textArea1 && template.textArea2 && template.textArea3) {
      if (!req.body.text1 && !req.body.text2 && !req.body.text3) {
        res.status(422).json({ error: "Specified template requires at least one of text1 or text2 or text3" });
        return;
      }
    }

    const meme = {
      templateId: req.body.templateId,
      userId: req.user.id,
      title: req.body.title,
      isPublic: req.body.isPublic,
      fontId: req.body.fontId,
      colorId: req.body.colorId,
      text1: req.body.text1 ? req.body.text1 : null,
      text2: (template.textArea2 && req.body.text2) ? req.body.text2 : null,
      text3: (template.textArea3 && req.body.text3) ? req.body.text3 : null
    };

    const lastId = await DAOmemes.createMeme(meme);
    res.status(201).json({ lastIid: lastId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal database error" });
  }
});

// Delete an existing meme, given its <id>
// DELETE ${baseurl}/memes/<id>
app.delete(`${baseURL}/memes/:id([0-9]+)`, isLoggedIn, async (req, res) => {
  try {
    const changes = await DAOmemes.deleteMeme(req.params.id, req.user.id);
    res.status(200).json({ changes: changes });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal database error" });
  }
});


// Activate the server
app.listen(port, () => console.log(`MemeGenerator server listening at http://localhost:${port}/`));
