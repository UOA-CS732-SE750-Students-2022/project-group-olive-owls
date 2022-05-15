import Box from "@mui/material/Box";
import {List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem} from "@mui/material";
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EventIcon from '@mui/icons-material/Event';
import React from 'react';
import MenuItemList from "./MenuItemList";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";

export default function SideBar({ bubbles }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const navigate = useNavigate();

    return (
        <>
            <Box sx={{height: '100%', maxWidth: 360}}>
                <nav aria-label="main mailbox folders">
                    <List>

                            <ListItem disablePadding>
                                <ListItemButton
                                    onClick={() => navigate("/bubble")}>
                                    <ListItemIcon>
                                        <BubbleChartIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Bubbles" />
                                </ListItemButton>
                            </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => navigate("/EmployeeRecords")}>
                                <ListItemIcon>
                                    <GppMaybeIcon />
                                </ListItemIcon>
                                <ListItemText primary="Employee Records" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => navigate("/records")}>
                                <ListItemIcon>
                                    <MenuBookIcon />
                                </ListItemIcon>
                                <ListItemText primary="Records" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => navigate("/associate")}>
                                <ListItemIcon>
                                    <EventIcon />
                                </ListItemIcon>
                                <ListItemText primary="Associations" />
                            </ListItemButton>
                        </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton
                                    onClick={() => navigate("/uploadimg")}>
                                    <ListItemIcon>
                                        <AddIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Upload Image" />
                                </ListItemButton>
                            </ListItem>
                    </List>
                </nav>
            </Box>
            {/*<Menu*/}
            {/*    id={"bubble-list"}*/}
            {/*    anchorEl={anchorEl}*/}
            {/*    open={open}*/}
            {/*    onClose={handleClose}*/}
            {/*    onClick={handleClose}*/}
            {/*>*/}
            {/*    <MenuItemList bubbles={ bubbles }/>*/}



            {/*</Menu>*/}
        </>
    );
}