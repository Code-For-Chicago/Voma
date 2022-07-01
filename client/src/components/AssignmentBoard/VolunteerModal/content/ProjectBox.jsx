import React, { useState } from 'react';
import { ReactComponent as Match } from '../../../../assets/Match.svg';
import { ReactComponent as Mismatch } from '../../../../assets/Mismatch.svg';
import { 
    ProjectBoxContainer, 
    ProjectBoxName, 
    ProjectMatchIndicator,
    ProjectBoxMatchIndicator,
    AssignToProjectContainer
} from '../../../../styles/components/VolunteerModal.style';
import { assignVolunteerToProject } from '../../../../lib/Requests';

const ProjectBox = ({ project, active, setSelectedProject, volunteerSkill, volunteerId }) => {
    const [buttonName, setButtonName] = useState("Assign");
    
    const changeSelection = () => {
        setSelectedProject(project.id);
    }
    const isMatch = project.currentNeeds.indexOf(volunteerSkill) !== -1;

    const assign = async () => {
        setButtonName('...');
        const result = await assignVolunteerToProject(volunteerId, project.id);
        setButtonName(result ? 'Success!' : 'Error :(');
        if (result) {
            // TODO: More elegant way to update board than forcing reload
            window.location.reload();
        }
    }

    // TODO: get rid of extra border on projects adjacent to selected. 
    return (
        <ProjectBoxContainer $selected={active} onClick={changeSelection} tabIndex={0}>
            <ProjectBoxName>{project.name}</ProjectBoxName>
            <ProjectBoxMatchIndicator>
                { isMatch ? 
                    <Match />
                    :
                    <Mismatch />
                }
                <ProjectMatchIndicator $match={isMatch}>{ isMatch ? 'MATCH' : 'MISMATCH '}</ProjectMatchIndicator>
            </ProjectBoxMatchIndicator>
            <AssignToProjectContainer>
                { active && <button onClick={assign} type="button">{buttonName}</button>}
            </AssignToProjectContainer>
        </ProjectBoxContainer>
    )
};

export default ProjectBox;
