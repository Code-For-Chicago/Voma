import React from 'react';
import { Typography } from '@mui/material';
import { ProjectSidebarContainer } from '../../styles/pages/ProjectPage.style';


const ProjectSidebar = ({ children }) => (
        <ProjectSidebarContainer>
           <Typography variant="h6" mt="24px" mb="16px">Projects</Typography>
            { children }
        </ProjectSidebarContainer>
    );

export default ProjectSidebar;
