
import React, { useState, createContext, useContext } from "react";
import { Route, Redirect } from 'react-router-dom';

const VolunteerContext = createContext(null);

function VolunteerProvider({ children }) {
  // Use localstorage for the moment until we get Sessions figured out.
  const storedProfile = localStorage.getItem('volunteer');
  let defaultProfile = {};
  if (storedProfile) { // If profile is in localstorage, use that.
    defaultProfile = JSON.parse(storedProfile);
  } else {
    defaultProfile = {
      isAuthenticated: false,
      notRegistered: false,
      email: '',
    };
  }
  
  const [profile, setProfile] = useState(defaultProfile);

  const signIn = (volunteerEmail) => {
    fetch('/api/volunteer/validate/slack', {
      method: 'POST',
      body: JSON.stringify({ volunteerEmail }),
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then((data) => {
      if (data.status === 404) {
        throw new Error('404: Route not found.');
      } else return data.json();
    })
    .then((response) => {

      const updatedProfile = {
        isAuthenticated: true,
        email: volunteerEmail,
        notRegistered: !response.exists, 
      };
      setProfile(updatedProfile);

      if (response.exists) {  // User found.
        const slackProfile = {
          suid: response.suid,
          name: response.name,
          img:  response.img,
        };

        setProfile(profile => ({
          ...profile,
          ...slackProfile
        }));
      }

      // Use localstorage for the moment until we get Sessions figured out.
      localStorage.setItem('volunteer', JSON.stringify(profile));
    })
    .catch((err) => {
      console.log(err);

      // For now, fake successful return of profile.
      console.log('Faking successful signin for now, for development.');
      const updatedProfile = {
        isAuthenticated: true,
        email: volunteerEmail,
        notRegistered: false,
        suid: 'FAKE_API_USER',
        name: 'Fake User',
        img:  'https://.../T6WU86LJZ-U01TD0E2MC5-4a4a68c96004-512'
      };
      setProfile(updatedProfile);
      // Use localstorage for the moment until we get Sessions figured out.
      localStorage.setItem('volunteer', JSON.stringify(updatedProfile));

    });
  };

  const signOut = () => {
    setProfile({
      isAuthenticated: false,
      notRegistered: false,
      email: '',
    });
    // Use localstorage for the moment until we get Sessions figured out.
    localStorage.removeItem('volunteer');
  }
  
  const value = { 
    profile, 
    setProfile,
    signIn, 
    signOut,
  };

  return (
    <VolunteerContext.Provider value={value}>
        {children}
    </VolunteerContext.Provider>
  );
}

function LockedRoute({ children, ...rest }) {
  const authContext = useContext(VolunteerContext);

  return (
    <Route {...rest}
      render={({ location }) => authContext.profile.isAuthenticated ? ( children ) : (
          <Redirect to={{ pathname: "/", state: { from: location } }} />
        )
      }
    />
  );
}

export { VolunteerProvider, VolunteerContext, LockedRoute };
