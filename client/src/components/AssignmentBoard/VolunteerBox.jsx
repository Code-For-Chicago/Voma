import React, { useContext } from 'react';
import { useDrag } from 'react-dnd';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/material';
import { assignVolunteer } from '../../lib/Requests';

import { AuthContext } from '../../lib/AuthProvider';

const useStyles = makeStyles({
    volunteerName: {
        borderRadius: '4px',
        backgroundColor: 'white',
        cursor: 'pointer',
        padding: '12px',
        width: '100%',
        marginBottom: '16px',
        boxShadow: '0px 1px 1px rgba(0,0,0,0.14), 0px 2px 1px rgba(0,0,0,0.12), 0px 1px 3px rgba(0,0,0,0.2);',
        '&.active': {
            backgroundColor: 'rgba(98, 0, 238, 0.08)',
            border: '1px solid #6200ee',
        }
    },
});

const VolunteerBox = ({ volunteer }) => {
    const AuthUser = useContext(AuthContext);

    const [collected, drag, dragPreview] = useDrag(() => ({
        type: 'volunteer',
        item: { 
            id: `volunteer-${volunteer.id}`,
            volunteer
        },
        end: async (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult) {
                await assignVolunteer(item.volunteer.id, dropResult.project.id);
                AuthUser.refreshBoard(); // Tally total updates made by user to refresh board.
            }
        },
    }));

    const classes = useStyles();

    return collected.isDragging ? (
            <Box ref={dragPreview} className={classes.volunteerName}>
                <Box>{volunteer.name}</Box>
            </Box>
        ) : (
            <Box ref={drag} className={classes.volunteerName} {...collected}>
                <Box>{volunteer.name}</Box>
            </Box>
        )
};

export default VolunteerBox;
