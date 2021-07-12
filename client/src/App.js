import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Container, Alert } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import LoginForm from './components/LoginForm';
import MemesList from './components/MemesList';
import MemeForm from './components/MemeForm';
import APIusers from './api/APIusers';
import APImemes from './api/APImemes';
import APItemplates from './api/APItemplates';
import APIfonts from './api/APIfonts';
import APIcolors from './api/APIcolors';

function App() {
  const [memes, setMemes] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [fonts, setFonts] = useState([]);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await APIusers.getUserInfo();
        setUser(user);

        setLoggedIn(true);
      } catch (err) {
      }
    };

    checkUser();
  }, []);

  useEffect(() => {
    const getTemplatesFontsColors = async () => {
      try {
        const templates = await APItemplates.getTemplates();
        setTemplates(templates);
        const fonts = await APIfonts.getFonts();
        setFonts(fonts);
        const colors = await APIcolors.getColors();
        setColors(colors);

        setDirty(true);
      } catch (err) {
        handleErrors(err);
      }
    };

    getTemplatesFontsColors();
  }, []);

  useEffect(() => {
    const getMemes = async () => {
      try {
        setLoading(true);

        const memes = await APImemes.getMemes();
        setMemes(memes);

        setLoading(false);
        setDirty(false);
      } catch (err) {
        handleErrors(err);
      }
    };

    if (dirty) {
      getMemes();
    }
  }, [dirty]);

  const handleErrors = (err) => {
    if (err.error) {
      setMessage({ msg: err.error, type: "danger" });
    }
  }

  const addMeme = async (meme) => {
    setMemes(oldMemes => [...oldMemes, { ...meme, id: -1, statusVariant: "success"}]);

    try {
      await APImemes.addMeme(meme);

      setDirty(true);
    } catch (err) {
      handleErrors(err);
    }
  };

  const deleteMeme = async (meme) => {
    setMemes(oldMemes => {
      return oldMemes.map(m => {
        if (m.id === meme.id) {
          return { ...meme, statusVariant: "danger" };
        } else {
          return m;
        }
      });
    });

    try {
      await APImemes.deleteMeme(meme);

      setDirty(true);
    } catch (err) {
      handleErrors(err);
    }
  };

  const doLogin = async (credentials) => {
    try {
      const user = await APIusers.login(credentials);
      setUser(user);

      setLoggedIn(true);
      setDirty(true);
    } catch (err) {
      handleErrors(err);
    }
  };

  const doLogout = async () => {
    try {
      await APIusers.logout();
      setUser({});
      setLoggedIn(false);
      setMemes([]);
      setDirty(true);
    } catch (err) {
      handleErrors(err);
    }
  };

  return (
    <>
      {/* Router */}
      <Router>
        <Container fluid>
          {/* Navbar */}
          <NavBar loggedIn={loggedIn} name={user.name} doLogout={doLogout} />
          {/* Error Alert */}
          {message && <Alert className="fixed-bottom col-6 mx-auto" variant={message.type} onClose={() => setMessage("")} dismissible>{message.msg}</Alert>}
          {/* Switch */}
          <Switch>
            {/* Login Route */}
            <Route exact path="/login" render={() =>
              <>
                {loggedIn ? <Redirect to="/" /> : <LoginForm doLogin={doLogin} />}
              </>
            } />
            {/* Add Meme Route */}
            <Route exact path="/add" render={() =>
              <>
                {!loggedIn ? <Redirect to="/login" /> : <MemeForm templates={templates} fonts={fonts} colors={colors} addMeme={addMeme} user={user} />}
              </>
            } />
            {/* Default (List Memes) Route */}
            <Route exact path="/" render={() =>
              <>
                <MemesList memes={memes} templates={templates} fonts={fonts} colors={colors} deleteMeme={deleteMeme} loading={loading} loggedIn={loggedIn} user={user} />
              </>
            } />
          </Switch>
        </Container>
      </Router>
    </>
  );
}

export default App;
