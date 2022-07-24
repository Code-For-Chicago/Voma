import React from 'react';
import { ProjectInfoTextField } from '../../../styles/pages/ProjectPage.style';

const ProjectTextField = ({ currentValue, onChange, name }) => (
    <ProjectInfoTextField name={name} value={currentValue || ''} onChange={onChange} />
);

export default ProjectTextField;
