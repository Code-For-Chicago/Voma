import React, { useState, useEffect } from 'react';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
    ProjectInfoInput, 
    ProjectEditableLinkContainer, 
    ProjectEditableLinkLabel, 
} from '../../../styles/pages/ProjectPage.style';

const ProjectLink = ({ link, deleteLink, linkListener }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [linkRequired, setLinkRequired] = useState(false);
    const [linkTitle, setLinkTitle] = useState("");
    const [linkUrl, setLinkUrl] = useState("");

    useEffect(() => {
        if (link) {
            setLinkRequired(link.required);
            setLinkTitle(link.title);
            setLinkUrl(link.url);
        }
    }, [link])

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const updateTitle = (e) => {
        setLinkTitle(e.currentTarget.value);
        const updatedLink = {
            id: link.id,
            title: e.currentTarget.value,
            url: link.url,
            required: link.required
        }
        linkListener(updatedLink);
    }

    const updateUrl = (e) => {
        setLinkUrl(e.currentTarget.value);
        const updatedLink = {
            id: link.id,
            title: link.title,
            url: e.currentTarget.value,
            required: link.required
        }
        linkListener(updatedLink);
    }

    const updateRequired = () => {
        const updatedLink = {
            id: link.id,
            title: link.title,
            url: link.url,
            required: !linkRequired,
        }
        setLinkRequired(!linkRequired);
        linkListener(updatedLink);
    }

    const removeLink = () => {
        deleteLink(link.id);
        handleClose();
    }
  
return (
    <>
        <ProjectEditableLinkLabel 
            onChange={updateTitle} 
            name={linkTitle} 
            value={linkTitle} 
            placeholder="Link Title" 
        />
        <ProjectEditableLinkContainer>
            <Switch checked={linkRequired} onClick={updateRequired} />
            <ProjectInfoInput 
                name={linkTitle} value={linkUrl || ''} 
                onChange={updateUrl} 
                placeholder="Link URL" 
            />
            <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={removeLink}>
                    Delete
                </MenuItem>
            </Menu>
        </ProjectEditableLinkContainer>
    </>
    );
};

export default ProjectLink;
