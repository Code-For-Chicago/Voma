require('dotenv').config({ 
    path: `./.env.${process.env.NODE_ENV}`
});
const { models } = require('../index');
const { slackLookupByEmail } = require('../lib/slack/slack');
const Volunteer = models.volunteer;
const Skill = models.skill;
const VolunteerSkills = models.VolunteerSkills;
const Project = models.project;

const getVolunteers = async (req, res) => {
    let error;
    const volunteers = await models.volunteer.findAll({ include: Project, include: models.skill })
                             .catch(err => error = err);

    if (error) {
        return res.status(400).json({ error });
    }

    res.json(volunteers);
};

const getVolunteer = async (req, res) => {
    let error;
    const volunteer = await Volunteer.findByPk(req.params.id, {
      include: models.skill,
      include: Project
    })
                            .catch(err => error = err);

    if (error) {
        return res.status(400).json({ error });
    }

    if (volunteer) {
        res.json(volunteer);
    } else {
        res.status(404).json({ result: `Volunteer ${req.params.id} does not exist.`});
    }
};


/**
 * Route to add a volunteer.
 * POST /api/volunteer
 * 
 * @param {*} req - Client request object.
 * @param {*} res - Request response object.
 */
const addVolunteer = async (req, res) => {
    const {
        name,
        email,
        slackUserId,
        pronouns,
        skills
    } = req.body;

    const [volunteerRec] = await Volunteer.findOrCreate({
        where: { email: email },
        defaults: {
            name,
            email,
            slackUserId,
            pronouns,
        }
    })
    .catch(err => {
        console.log(err);
        return res.json({
            success: false,
            message: 'Unable to add volunteer to database.',
            error: err
        });
    });

    if (skills) { 
        const [skillRec] = await Skill.findOrCreate({
            where: { name: skills },
            defaults: {
                name: skills,
            }
        })
        .catch(err => {
            console.log(err);
            return res.json({
                success: false,
                message: 'Unable to add skill to database.',
                error: err
            });
        });

        await VolunteerSkills.findOrCreate({
            where: { skillId: skillRec.id },
            defaults: {
                volunteerId: volunteerRec.id,
                skillId: skillRec.id,
            }
        })
        .catch(err => {
            console.log(err);
            return res.json({
                success: false,
                message: 'Unable to add associate skill to volunteer in database.',
                error: err
            });
        });
    }

    res.json({ success: true });
};

const editVolunteer = async (req, res) => {
    const {
        name,
        email,
        slackUserId,
        pronouns,
        employer,
        student,
        jobTitle,
        onboardingAttendedAt,
        oneOnOneAttendedAt,
        projectId,
        skillId
    } = req.body;

    let findError, updateError;

    const volunteer = await models.volunteer.findByPk(req.params.id)
                            .catch(err => findError = err);

    if (findError) {
        return res.status(400).json({ error: findError });
    }
    if (!volunteer) {
        return res.status(404).json({ error: `Volunteer ${req.params.id} does not exist`});
    }

    if (skillId) {
        await VolunteerSkills.findOrCreate({
            where: { skillId },
            defaults: {
                volunteerId: volunteer.id,
                skillId,
            }
        })
        .catch(err => {
            console.log(err);
            return res.json({
                success: false,
                message: 'Unable to add associate skill to volunteer in database.',
                error: err
            });
        });
    };

    await volunteer.update({
        name,
        email,
        slackUserId,
        pronouns,
        employer,
        student,
        jobTitle,
        onboardingAttendedAt,
        oneOnOneAttendedAt,
        projectId
    })
    .catch(err => updateError = err);

    if (updateError) {
        res.status(400).json({ error: updateError });
    }

    res.status(200).json({ result: `Volunteer ${req.params.id} has been updated.`});
};

const assignVolunteerToProject = async (req, res) => {
    const { volunteerId, projectId } = req.body;
    let findError, assignError;
    // validate both volunteer and project are valid
    const volunteer = await models.volunteer.findByPk(volunteerId)
        .catch(err => findError = err);

    const project = await models.project.findByPk(projectId)
        .catch(err => findError = err);

    // If they both exist, associated them 
    if (volunteer && project) {
        await volunteer.setProject(project)
            .catch(err => assignError = err);
    }

    if (!volunteer) {
        return res.status(404).json({ error: `Volunteer ${volunteerId} could not be found.`});
    }

    if (!project) {
        return res.status(404).json({ error: `Project ${projectId} could not be found.`});
    }

    if (assignError || findError) {
        return res.status(400).json({ error: assignError });
    }

    return res.status(200).json({ result: `Volunteer ${volunteerId} has been added to project ${projectId}`});
        
}

const removeVolunteer = async (req, res) => {
    let findError, deleteError;

    const volunteer = await models.volunteer.findByPk(req.params.id)
                            .catch(err => findError = err);

    if (findError) {
        return res.status(400).json({ error: findError });
    }

    if (volunteer) {

        await volunteer.destroy()
        .catch(err => deleteError = err);

        if (deleteError) {
            return res.status(400).json({ error: deleteError });
        }

        res.status(200).json({ result: `Volunteer ${req.params.id} has been removed.`});
    } else {
        res.status(404).json({ result: `Volunteer ${req.params.id} does not exist.`});
    }
};

/**
 * Route checking if a volunteer has signed up for the Code for Chicago Slack channel.
 * POST /api/volunteer/slack/exists
 * 
 * @param {*} req - Client request object.
 * @param {*} res - Request response object.
 */
const getSlackByEmail = async (req, res) => {
    const email = req.body?.email

    if (!email) {
        return res.json({
            exists: false,
            error: 'Email required.',
        });
    }

    try {
        const result = await slackLookupByEmail(email);

        if (result?.data?.user) { // User found.
            const profile = result.data.user;
            const volunteer = {
                suid: profile.id                || '', // Slack User ID.
                name: profile.real_name         || '', // Real Name.
//                img:  profile.profile.image_192 || '', // Slack Profile Image.
                exists: true,
            }
            return res.json(volunteer);

        } else if (result.data.error) {
            return res.json({
                exists: false,
                error: result.data.error,
            });

        } else {
            return res.json({
                exists: false,
                error: 'Slack API response invalid.',
                response: JSON.stringify(result), // For debugging on the front end.
            });
        }

    } catch (err) {
        return res.json({
            exists: false,
            error: err
        });
    }
}


module.exports = {
    getVolunteers,
    getVolunteer,
    addVolunteer,
    editVolunteer,
    assignVolunteerToProject,
    removeVolunteer,
    getSlackByEmail
};
