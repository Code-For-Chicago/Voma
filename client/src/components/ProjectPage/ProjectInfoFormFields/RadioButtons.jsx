import React from 'react';
import { Typography } from '@mui/material';
import { ProjectRadioButtonContainer } from '../../../styles/pages/ProjectPage.style';

const RadioButtons = ({ options, name, currentValue, onChange }) => options.map((option) => (
        <ProjectRadioButtonContainer key={`${name}-${option.text}`}>
            <label htmlFor={`${name}-${option.text}`}>
                <input 
                    name={name} 
                    type="radio"
                    id={`${name}-${option.text}`} 
                    value={option.value} 
                    checked={currentValue === option.value} 
                    onChange={onChange}
                />
                <Typography variant="subtitle-1">{option.text}</Typography>
            </label>
        </ProjectRadioButtonContainer>));

export default RadioButtons;
