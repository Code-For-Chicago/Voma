import React from 'react';
import { Typography } from '@mui/material';
import { ProjectInfoSection, ProjectInfoField } from '../../styles/pages/ProjectPage.style';

const ProjectInfoBox = ({ fields, header, mainHeader }) => (
        <ProjectInfoSection>
            <Typography variant={mainHeader ? 'h4' : 'h5'} gutterBottom>{header}</Typography>
            {fields.map((field, index) => 
            // eslint-disable-next-line react/no-array-index-key
                (<ProjectInfoField key={`field-${index}`}>
                    <Typography variant="overline">{field.label}</Typography>
                    { field.type === 'link' ? 
                        <Typography paragraph variant="subtitle-1"><a href={field.value}>{field.value}</a></Typography>
                        :
                        <Typography paragraph variant="subtitle-1">{field.value}</Typography>
                    }
                </ProjectInfoField>)
            )}
        </ProjectInfoSection>
    )
export default ProjectInfoBox;
