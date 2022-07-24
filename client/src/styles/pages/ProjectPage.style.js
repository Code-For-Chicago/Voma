import styled from 'styled-components';

export const ProjectSidebarContainer = styled.div`
    background-color: #fff;
    padding: 8px;
    width: 100%;
    height: 100%;
`;

export const ProjectSidebarProject = styled.div`
    padding: 12px 16px;
    color: rgba(0, 0, 0, 0.6);   
    background-color: #fff;
    cursor: pointer;
    ${(props) => props.$selected &&
        `color: #6200EE;
        background-color: #F2E7FE;
        `
    }
`;

export const ProjectInfoContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 20px 64px 100px 64px;
`

export const ProjectInfoSection = styled.div`
    margin: 12px;
    padding: 24px;
    flex: 1;
    background-color: #fff;
    h4, h5 {
        color: rgba(0, 0, 0, 0.87);
    }

    .MuiTypography-overline {
        color: rgba(0, 0, 0, 0.6);
    }

    .MuiTypography-subtitle-1 {
        color: rgba(0, 0, 0, 0.87);
        white-space: break-spaces;
        font-size: 16px;
    }
`;

export const ButtonContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const ProjectInfoField = styled.div`
    margin: 10px 0;
`;

export const ProjectNameInput = styled.input`
    border: none;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 34px;
    color: rgba(0, 0, 0, 0.87);
    height: 36px;
    width: 100%;
    &::placeholder {
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 400;
        font-size: 34px;
        color: rgba(0, 0, 0, 0.87);
    }
`;

export const ProjectRadioButtonContainer = styled.div`
    display: block;
    margin: 8px 0;
    line-height: 24px;
    input {
        margin: 4px;
    }
`;

export const ProjectInfoTextField = styled.textarea`
    padding: 16px 12px 14px 14px;
    width: 100%;
    height: 78px;
    background: rgba(33, 33, 33, 0.08);
    border-radius: 4px 4px 0px 0px;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    display: block;
    border: none;
`;

export const ProjectInfoInput = styled.input`
    height: 54px;
    background: rgba(33, 33, 33, 0.08);
    border-radius: 4px;
    border: none;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    padding: 16px 14px 14px;
    flex: 3;
`;

export const ProjectEditableLinkLabel = styled.input`
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    font-size: .75rem;
    line-height: 16px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(0, 0, 0, 0.6);
    border: none;
`

export const ProjectEditableLinkContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    height: 54px;
`;

export const ProjectAddLinkButtonContainer = styled.div`
    margin-top: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
`;
