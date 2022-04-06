import React, { useState, createContext, useEffect } from "react";

const VolunteerContext = createContext(null);

function VolunteerProvider({ children }) {
  // Use localstorage for the moment until we get Sessions figured out.
  const storedProfile = localStorage.getItem('volunteer');
  const storedRegistrationStep = localStorage.getItem('registrationStep');
  
  let defaultProfile = {
      isAuthenticated: false,
      notRegistered: false,
      email: '',
      skill: '',
      pronouns: '',
  };
  let defaultRegistrationStep = -1;

  if (storedProfile) { // If profile is in localstorage, use that.
    defaultProfile = JSON.parse(storedProfile);
  }

  if (storedRegistrationStep) {
    defaultRegistrationStep = parseInt(storedRegistrationStep, 10); // Force integer type.
  }
  
  const [profile, setProfile] = useState(defaultProfile);
  const [registrationStep, setRegistrationStep] = useState(defaultRegistrationStep);
  const [registrationErrorMessage, setRegistrationErrorMessage] = useState('');

  const updateInfo = (info) => {
    const p = profile;
    Object.keys(info).forEach((key) => {
      p[key] = info[key];
    });
    setProfile(p);
  };

  /**
   * Check if this email is signed up for the CFC Slack workspace.
   * 
   * @param {string} volunteerEmail 
   */
  const slackExists = (email) => {
    fetch(`http://localhost:5000/api/volunteer/slack/exists`, {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then((data) => {
      if (data.status === 404) {
        console.log(data);
        throw new Error('404: Route not found.');
      } else return data.json();
    })
    .then((response) => {
      let profileUpdate = {};

      if (response.exists) {  // User found.
        profileUpdate = {
          isAuthenticated: true,
          email,
          notRegistered: false, 
          suid: response.suid,
          name: response.name,
        };
        setProfile(profileUpdate);
        setRegistrationStep(1);

      } else {
        profileUpdate = {
          isAuthenticated: false,
          notRegistered: true,
          email: '',
          skill: '',
          pronouns: '',
        };
        setProfile(profileUpdate); 
        setRegistrationStep(1)
      }

    })
    .catch((err) => {
      console.log(err);

      // For now, fake successful return of profile.
      console.log('Faking successful signin for now, for development.');

      const profileUpdate = {
        isAuthenticated: true,
        email,
        notRegistered: false,
        suid: 'FAKE_API_USER',
        name: 'Fake User',
      };
      setProfile(profileUpdate);
      setRegistrationStep(1);
    });
  };

  const registerVolunteer = () => {
    fetch(`http://localhost:5000/api/volunteer`, {
      method: 'POST',
      body: JSON.stringify({
        name: profile.name,
        email: profile.email,
        slackUserId: profile.suid,
        pronouns: profile.pronouns,
        skill: profile.skill,
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then((data) => {
      if (data.status === 404) {        
        setRegistrationErrorMessage('Oops, something went wrong. Please reach out on Slack for help registering.');
        window.scrollY = 0;
        throw new Error('404: Route not found.');
      } else return data.json();
    })
    .then(response => {
      if (response.success) {
        setRegistrationStep(4);
      } else {
        console.log(response);
        setRegistrationErrorMessage('Oops, something went wrong. Please reach out on Slack for help registering.');
        window.scrollY = 0;
      }
    })
    .catch((err) => {
      console.log(err);
    });
  };

  useEffect(() => {
    localStorage.setItem('registrationStep', registrationStep);
  }, [registrationStep]);

  useEffect(() => {
    localStorage.setItem('volunteer', JSON.stringify(profile));
  }, [profile]);
  
  const funcs = { 
    setProfile,
    slackExists, 
    setRegistrationStep,
    updateInfo,
    registerVolunteer,
  };

  return (
    <VolunteerContext.Provider value={{ ...profile, registrationStep, registrationErrorMessage, ...funcs}}>
        {children}
    </VolunteerContext.Provider>
  );
}

export { VolunteerProvider, VolunteerContext };

