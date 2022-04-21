import { useEffect, useState, useContext } from 'react';
import { Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { deepPurple } from '@mui/material/colors';
import { useDrop } from 'react-dnd';
import { fetchVolunteers, fetchProjects } from '../lib/Requests';
import VolunteerBox from '../components/AssignmentBoard/VolunteerBox';
import ProjectBox from '../components/AssignmentBoard/ProjectBox';

import { AuthContext } from '../lib/AuthProvider';

const useStyles = makeStyles({
    sidebar: {
        overflowY: 'scroll',
        paddingLeft: '16px',
        paddingRight: '24px',
        minHeight: 'calc(100vh - 64px)',
        maxHeight: 'calc(100vh - 64px)',
        maxWidth: '272px',
        marginTop: '-32px',
        backgroundColor: 'rgba(98, 0, 238, 0.08)',
        '& .MuiBox-root': {
            display: 'inline-block',
        },
        '& input': {
            textAlign: 'right',
        }
    },
    board: {
        overflowX: 'scroll',
        paddingRight: '24px',
        marginTop: '-32px',
        width: 'calc(100vw - 272px)',
        maxWidth: 'calc(100vw - 272px)',
        '& > .MuiBox-root': {
            marginLeft: '9px',
        },
        '& > .MuiBox-root ~ .MuiBox-root': {
            marginLeft: '16px',
        }
    },
    projectCard: {
        width: '248px',
        borderRadius: '4px',
        display: 'inline-block',
        padding: '12px',
        whiteSpace: 'normal',
        verticalAlign: 'top',
        backgroundColor: 'rgba(255,255,255,0.38)',
        boxShadow: '0px 1px 1px rgba(0,0,0,0.14), 0px 2px 1px rgba(0,0,0,0.12), 0px 1px 3px rgba(0,0,0,0.2);',
        '& hr': {
            marginBottom: '16px',
            border: '1px solid #6200ee',
        },
        '&.active': {
            border: '1px solid #6200ee',
            backgroundColor: 'rgba(98, 0, 238, 0.08)',
        }
    },
    projectCardButton: {
        borderRadius: '4px',
        cursor: 'pointer',
        padding: '12px',
        marginBottom: '16px',
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Roboto',
        fontSize: '14px',
        letterSpacing: '1.25px',
        fontWeight: '500',
        backgroundColor: deepPurple.A700,
    }
})

export default function AssignmentBoard() {
    const [volunteers, setVolunteers] = useState([]);
    const [projects, setProjects] = useState([]);

    const AuthUser = useContext(AuthContext);

    // Handle Sidebar as a drop area, unsets a project for a volunteer.
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: 'volunteer',
        drop: () => ({ 
            name: `project-0`,
            project: {
                id: 0, // project.id=0 will unset the project.
            }
        }),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        })
    }));

    const classes = useStyles();

    // Filter out just the volunteers currently assigned to this project.
    const getProjectVolunteers = (projectId) => {
        let projectVolunteers = [];
        for (let i=0; i<volunteers.length; i+=1) {
            if (volunteers[i].projectId === projectId) {
                projectVolunteers.push(volunteers[i]);
            }
        }
        return projectVolunteers;
    };

    useEffect(() => { // Run once on component mount and when an update is made.
        async function initializeBoard() {
            let volunteerList = await fetchVolunteers();
            let projectList = await fetchProjects();

            setVolunteers(volunteerList);
            setProjects(projectList);
        }
        initializeBoard();
    }, [AuthUser.updateMade]); // \Run once on component mount and when an update is made.


    return (<>
        <Grid container justifyContent="flex-box">
            <Grid 
                item 
                md={2} 
                ref={drop}
                className={classes.sidebar}>
                <Typography variant="h6" mt="24px" mb="16px">Unassigned Volunteers</Typography>
                {volunteers && 
                Object.entries(volunteers).map(([key, volunteer]) => (
                    !volunteer.projectId && // Display volunteers with no assigned project.
                    <VolunteerBox 
                        key={`volunteer-${volunteer.id}`} 
                        volunteer={volunteer}/>
                ))}
            </Grid>
                
            <Grid item md={10} className={classes.board} sx={{ whiteSpace: 'nowrap' }}>
                {projects && 
                Object.entries(projects).map(([key, project]) => ( // Display projects.
                    <ProjectBox 
                        key={`project-${project.id}`} 
                        volunteers={getProjectVolunteers(project.id)}
                        project={project}
                        classes={classes}/>
                ))}
            </Grid>
        </Grid>
    </>);
}
