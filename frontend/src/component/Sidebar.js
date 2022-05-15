import Box from "@mui/material/Box";
import {List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem} from "@mui/material";
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EventIcon from '@mui/icons-material/Event';
import React from 'react';

export default function SideBar({ bubbles }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Box sx={{height: '100%', maxWidth: 360}}>
                <nav aria-label="main mailbox folders">
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={handleClick}
                                aria-controls={open ? 'account-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                            >
                                <ListItemIcon>
                                    <BubbleChartIcon />
                                </ListItemIcon>
                                <ListItemText primary="Bubbles" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <GppMaybeIcon />
                                </ListItemIcon>
                                <ListItemText primary="Alerts" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <MenuBookIcon />
                                </ListItemIcon>
                                <ListItemText primary="Records" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <EventIcon />
                                </ListItemIcon>
                                <ListItemText primary="Upcoming Events" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </nav>
            </Box>
           <Menu
               id={"bubble-list"}
               anchorEl={anchorEl}
               open={open}
               onClose={handleClose}
               onClick={handleClose}
           >
               <MenuItem>
                   <BubbleChartIcon /> Bubble 1
               </MenuItem>
               <MenuItem>
                   <BubbleChartIcon /> Bubble 2
               </MenuItem>
               <MenuItem>
                   <BubbleChartIcon /> Bubble 3
               </MenuItem>



           </Menu>
        </>
    );
}