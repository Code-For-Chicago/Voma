/**
 * Fetch all volunteers from the API.
 * 
 * GET /api/volunteers
 * 
 * @returns {Array} Array of volunteer objects or empty array on error.
 */
const fetchVolunteers = async () => {
    const volunteerList = await fetch('/api/volunteers')
        .then(response => response.json())
        .catch(e => {
            console.error(e);
            return [];
        });

    // console.log('fetchVolunteers', volunteerList); // debug

    return volunteerList;
};

/**
 * Fetch all project from the API.
 * 
 * @returns {Array} Array of project objects or empty array on error.
 */
const fetchProjects = async () => {
    const projectList = await fetch('/api/projects')
        .then(response => response.json())
        .catch(e => {
            console.error(e);
            return [];
        });
    
    // console.log('fetchProjects', projectList); // debug

    return projectList;
}

/**
 * Assign a volunteer to a project.
 * 
 * @param {*} volunteerId - ID # of the volunteer.
 * @param {*} projectId - ID # of the project.
 * 
 * @returns {bool} true on success. 
 */
const assignVolunteer = async (volunteerId, projectId) => {
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId }),
    };
    const result = await fetch(`/api/volunteer/${volunteerId}`, options)
        .then(response => response.json())
        .catch(e => {
            console.error(e);
            return {};
        });

    // console.log('assignVolunteer', result); // debug

    return result;
}

export {
    fetchVolunteers,
    fetchProjects,
    assignVolunteer,
};