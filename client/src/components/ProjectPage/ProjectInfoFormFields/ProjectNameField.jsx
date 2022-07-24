import React from 'react';
import { ProjectNameInput } from '../../../styles/pages/ProjectPage.style'

const ProjectNameField = ({ name, onChange }) => (
    <ProjectNameInput 
        id="project-name" 
        name="projectName" 
        value={name} 
        onChange={onChange} 
    />
);

export default ProjectNameField;
