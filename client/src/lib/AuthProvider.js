import { useState, createContext, useContext, useEffect } from "react";
import { Route, Redirect } from 'react-router-dom';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const storedAuth = localStorage.getItem('auth');
  let defaultAuth = { authenticated: false };
  if (storedAuth) {
    defaultAuth = JSON.parse(storedAuth);
  }

  // Actual authentiation is stored in the cookie. Actions are validated serverside. 
  const [auth, setAuth] = useState(defaultAuth);
  const [loginFormError, setLoginFormError] = useState(false);
  const [updateMade, setUpdateMade] = useState({ updates: 0 }); // Triggers re-rendering of /board on updates.

  function updateLoginState() {
    fetch('/api/authenticated')
      .then(response => response.json())
      .then(data => {
        if (data.state) {
          setAuth({ authenticated: true });
        } else setAuth({ authenticated: false });
      })
      .catch((e) => {
        console.error(e);
        setAuth({ authenticated: false });
      });
  }

  function isAuthenticated() {
    return auth.authenticated;
  }
  
  function setAuthentication(authState) {
    localStorage.setItem('auth', JSON.stringify(authState));
    setAuth(authState);
  }

  function refreshBoard() {
    const totalUpdates = updateMade + 1;
    setUpdateMade({ updates: totalUpdates });
  }

  const login = (email, password) => {
    fetch(`/api/login`, {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((data) => {
        if (data.status === 404) {
          setAuthentication({ authenticated: false });
          setLoginFormError(true);

          throw new Error('Unable to find server.');

        } else return data.json();
      })
      .then(response => {
        if (response.success) {
          setAuthentication({ authenticated: true });
          window.location.href = '/board';

        } else {
          console.log(response);
          setAuthentication({ authenticated: false });
          setLoginFormError(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setAuthentication({ authenticated: false });
        setLoginFormError(true); 
      });
  };

  /**
   * Logout.
   * 
   * - Invalidate session in the AuthContext.
   * - Hit the API route for logging out which will destory server session.
   * - Destroy the current session cookie.
   * - Redirect to the login page.
   */
  async function logout() {
    setAuthentication({ authenticated: false });
    await fetch(`/api/logout`) 
      .catch(e => console.error(e));
    document.cookie = 'connect.sid=;Max-Age=0';
    window.location.href = '/login';
  }

  useEffect(() => {
    updateLoginState();
  }, []);

  const funcs = {
    updateLoginState,
    isAuthenticated,
    refreshBoard,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={{ ...funcs, auth, updateMade, loginFormError }}>
      {children}
    </AuthContext.Provider>
  );
}

function LockedRoute({ children, ...rest }) {
  const UserAuth = useContext(AuthContext);

  return (
    <Route {...rest}
      render={({ location }) => UserAuth.isAuthenticated() ? (children) : (<Redirect to={{ pathname: "/login", state: { from: location } }} />)}
    />
  );
}

export { AuthProvider, AuthContext, LockedRoute };