import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useLocation, Link } from 'react-router-dom';
import LoginToggleButton from './LoginToggleButton';
import { AuthContext } from '../lib/AuthProvider';

const useStyles = makeStyles({
  headerLinkContainer: {
    justifySelf: 'flex-start',
    flex: 1,
    display: 'flex',
  },
  appLogo: {
    padding: '15px',
    marginRight: '35px',
  },
  navLinks: {
    margin: 'auto',
  },
  headerLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '15px',
    '&.inactive': {
      color: '#AD7FB5',
    },
    '&.active': {
      borderBottom: '2px solid #FFFFFF',
    },
  },
});

export default function Header() {
  const UserAuth = useContext(AuthContext);
  const location = useLocation();
  const registering = { form: false };
  let volPage = false;
  let projectPage = false;

  switch (location.pathname) {
    case '/':
    case '/register':
      registering.form = true;
      break;
    case '/board':
      volPage = true;
      break;
    case '/projects':
      projectPage = true;
      break;
    default:
      break;
  }

  const classes = useStyles();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <div className={classes.headerLinkContainer}>
            <Typography variant="h6" noWrap component="div" class={classes.appLogo}>
              {registering.form ? 'Code for Chicago' : 'Voma'}
            </Typography>
            {UserAuth.isAuthenticated() && (
              <div className={classes.navLinks}>
                <Link
                  className={
                    volPage ? `active ${classes.headerLink}` : `inactive ${classes.headerLink}`
                  }
                  to="/board"
                >
                  VOLUNTEERS
                </Link>
                <Link
                  className={
                    projectPage ? `active ${classes.headerLink}` : `inactive ${classes.headerLink}`
                  }
                  to="/projects"
                >
                  PROJECTS
                </Link>
              </div>
            )}
          </div>
          {registering.form && 'Social Button Here'}

          {!registering.form && <LoginToggleButton />}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
