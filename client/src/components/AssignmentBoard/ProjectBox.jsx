import React, { useState, useContext, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { Box, Typography } from '@mui/material';
import VolunteerBox from './VolunteerBox';

import { AuthContext } from '../../lib/AuthProvider';

export default function ProjectBoard({ volunteers, project, classes }) {
    const [isActive, setIsActive] = useState(false);

    const AuthUser = useContext(AuthContext);

    // Handle project box as a drop area, assigns volunteer to this project.
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: 'volunteer',
        drop: () => ({ 
            name: `project-${project.id}`,
            project
        }),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        })
    }));

    return (
        <Box 
            className={isOver ? `${classes.projectCard} active` : classes.projectCard} 
            ref={drop}
            mt="8px" 
            mb="16px">

            <Typography variant="h6" mb="16px">{project.name}</Typography>

            {isOver &&
            <Box className={classes.projectCardButton}>
                <Box>INSERT VOLUNTEER</Box>
            </Box>}

            <hr />

            {Object.entries(volunteers).map(([key, volunteer]) => (
                <VolunteerBox
                    key={`volunteer-${volunteer.id}`}
                    volunteer={volunteer} />
            ))}

        </Box>
    );
}
