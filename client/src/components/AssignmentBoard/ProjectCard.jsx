import React from 'react';
import { Typography } from '@mui/material';
import { ProjectSidebarProject } from '../../styles/pages/ProjectPage.style';

export default function ProjectBox({ projectId, projectName, onClick, selected }) {
    const getDetails = () => {
        onClick(projectId);
    }

    const getDetailsKeyPress = (e) => {
        const { key } = e;
        if (key === 'Enter') {
            onClick(projectId);
        }
    }
    return (
        <ProjectSidebarProject 
            $selected={selected} 
            onClick={getDetails} 
            tabIndex={0} 
            onKeyDown={getDetailsKeyPress}
        >
            <Typography gutterBottom>
                {projectName}
            </Typography>
        </ProjectSidebarProject>
    )
}

