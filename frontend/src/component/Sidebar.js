import Box from "@mui/material/Box";
import {List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EventIcon from '@mui/icons-material/Event';

export default function SideBar() {
    return (
        <Box sx={{height: '100%', maxWidth: 360}}>
            <nav aria-label="main mailbox folders">
                <List>
                    <ListItem disablePadding>
                        <ListItemButton>
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
    );
}