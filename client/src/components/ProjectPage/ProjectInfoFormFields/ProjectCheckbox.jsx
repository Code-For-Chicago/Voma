import React from 'react';
import { Typography } from '@mui/material';
import { ProjectRadioButtonContainer } from '../../../styles/pages/ProjectPage.style';

const ProjectCheckbox = ({ options, currentValues, name, onChange }) => options.map((option) => (
            <ProjectRadioButtonContainer key={`${name}-${option.value}`}>
                <label htmlFor={`${name}-${option.value}`}>
                    <input 
                        name={name} 
                        onChange={onChange} 
                        type="checkbox" 
                        value={option.value} 
                        checked={currentValues.indexOf(option.value) !== -1} 
                    />
                    <Typography variant="subtitle-1">{option.text}</Typography>
                </label>
            </ProjectRadioButtonContainer>
        ));

export default ProjectCheckbox;
