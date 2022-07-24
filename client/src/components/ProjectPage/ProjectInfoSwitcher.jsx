import React from 'react';
import { Button } from '@mui/material';
import { ProjectInfoSection, ButtonContainer } from '../../styles/pages/ProjectPage.style';

const ProjectInfoSwitcher = ({ editing, showEditForm, saveProject }) => (
        <ProjectInfoSection>
            <ButtonContainer>
                <Button 
                    variant="text" 
                    disabled={editing} 
                    type="button" 
                    onClick={showEditForm}>
                        Edit
                </Button>
                <Button 
                    variant="text" 
                    disabled={!editing} 
                    type="button" 
                    onClick={saveProject}>
                        Save
                </Button>
            </ButtonContainer>
        </ProjectInfoSection>
    );

export default ProjectInfoSwitcher;
