require('dotenv').config({
  path: `./.env.${process.env.NODE_ENV}`
});
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const axios = require('axios');
const path = require('path');
const volunteerController = require('./db/controllers/volunteers.controller');
const projectController = require('./db/controllers/projects.controller');
const skillsController = require('./db/controllers/skills.controller');
const userController = require('./db/controllers/users.controller');
const adminController = require('./db/controllers/admins.controller');

const app = express();
app.use(cors({ origin: true })); // todo: Limit open cors to client routes.

app.use(express.urlencoded());
app.use(express.json());

const secure_cookies = ([
  'production', // List of node environments to enable SSL cookies.
  'stage'
].includes( app.get('env') ));

// todo: enable secure cookie for production.
app.use(session({
  secret: process.env.SESSION_SECRET || 'insecure',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: secure_cookies } 
}));

/**
 * Remove "trust proxy" for environments that don't need/have one set up. This 
 * is required to set cookies in a proxied setup.
 */
app.set('trust proxy', 1); // Proxy envs.. 


/**
 * Validates a user is logged in before serving the route. Returns failed 
 * message if the request doesn't have the authentication required.
 * 
 * @param {*} req  - Request object.
 * @param {*} res  - Response object.
 * @param {*} next - Move to next processing function.
 */
const verifyAuth = (req, res, next) => {
  if (req.session?.isAuthenticated) {
    next();

  } else {
    res.json({
      error: true,
      authenticated: false
    })
    .end();
  }
}

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client/build')));

/* ____________ Begin API Endpoints ____________ */

// Put all API endpoints under '/api'

app.post('/api/user/find', userController.findUser);

/*========= VOLUNTEER ROUTES =========*/
app.get('/api/volunteers', verifyAuth, volunteerController.getVolunteers);
app.post('/api/volunteer', volunteerController.addVolunteer);
app.get('/api/volunteer/:id', verifyAuth, volunteerController.getVolunteer);
app.put('/api/volunteer/:id', verifyAuth, volunteerController.editVolunteer);
app.delete('/api/volunteer/:id', verifyAuth, volunteerController.removeVolunteer);

/*========= SLACK ROUTES =========*/
app.post('/api/volunteer/slack', volunteerController.getSlackByEmail);

/*========= SKILL ROUTES =========*/
app.get('/api/skills', skillsController.getSkills);
app.get('/api/skill/:id', skillsController.getSkill);
app.post('/api/skill', verifyAuth, skillsController.addSkill)
app.put('/api/skill/:id', verifyAuth, skillsController.editSkill)
app.delete('/api/skill/:id', verifyAuth, skillsController.removeSkill)

/*========= PROJECT ROUTES =========*/
app.get('/api/projects', verifyAuth, projectController.getProjects);
app.post('/api/project', verifyAuth, projectController.addProject);
app.get('/api/project/:id', verifyAuth, projectController.getProject);
app.put('/api/project/:id', verifyAuth, projectController.editProject);
app.delete('/api/project/:id', verifyAuth, projectController.removeProject);

/*========= ADMIN ROUTES =========*/
app.post('/api/admin', verifyAuth, adminController.addAdmin);
app.get('/api/admin/:id', verifyAuth, adminController.getAdmin);

/*========= AUTHENTICATION ROUTES =========*/
app.post('/api/login', adminController.login);
app.get('/api/logout', adminController.logout);
app.get('/api/authenticated', adminController.loginState);

// 404 error
app.use(function(req, res, next) {
  return res.status(404).send({ message: 'Route'+req.url+' Not found.' });
});

// 500 error
app.use(function(err, req, res, next) {
  return res.status(500).send({ error: err });
});

/* ____________ End API Endpoints ____________ */

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Voma server listening on ${port}`);