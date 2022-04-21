require('dotenv').config({ 
    path: `./.env.${process.env.NODE_ENV}`
});
const { models } = require('../index');
const { slackLookupByEmail } = require('../lib/slack');
const Volunteer = models.volunteer;
const Skill = models.skill;
const VolunteerSkills = models.VolunteerSkills;

/**
 * Returns a list of all volunteers.
 * 
 * @param {*} req - Request object. 
 * @param {*} res - Response object.
 */
const getVolunteers = async (req, res) => {
    const volunteers = await models.volunteer.findAll()
        .catch(e => { // Log error for debugging and return failed message.
            console.error(e);
            res.json({
                error: e,
                status: false,
            })
            .end(); return;
        });

    res.json(volunteers)
        .end(); 
};

const getVolunteer = async (req, res) => {
    let error;
    const volunteer = await Volunteer.findByPk(req.params.id, {
      include: models.skill
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

/**
 * Edit a volunteer, accepts volunteer fields. Only updates fields that are listed editable.
 * 
 * @param {*} req 
 * @param {*} res 
 */
const editVolunteer = async (req, res) => {
    const volunteerId = req.params.id;
    const params = req.body;

    let updatedVolunteer = {};

    const editableFields = [ // Limit the fields that can be updated, add as needed.
        'projectId',
    ];

    if (!volunteerId || !params) {
        res.json({
            error: 'Bad information.',
            message: 'Missing volunteer id or update fields',
            status: false,
        })
        .end(); return;
    }

    const volunteer = await models.volunteer.findByPk(volunteerId)
        .catch(e => { // Log error for debugging and return failed message.
            console.error(e);
            res.json({
                error: e,
                message: 'Unable to update volunteer.',
                status: false,
            })
            .end(); return;
        });


    for (let [key, value] of Object.entries(params)) {
        if (editableFields.includes(key)) {
            if (key == 'projectId' && value === 0) {
                value = null;
            }
            updatedVolunteer[key] = value;
        }
    }

    if (!volunteer || !updatedVolunteer) { // No matching volunteer.
        console.error('No matching volunteer or nothing to update.');
        console.log('Submitted Fields:', params);
        res.json({
            error: 'No matching volunteer.',
            message: 'Unable to update volunteer',
            status: false,
        })
        .end(); return;
    }

    await volunteer.update(updatedVolunteer)
        .catch(e => {
            console.error(e);
            res.json({
                error: e,
                message: 'Update failed.',
                status: false,
            })
            .end(); return;
        });

    res.json({
        status: true,
        message: 'Volunteer successfully updated.',
    })
    .end(); return;    
};


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
    removeVolunteer,
    getSlackByEmail
};
