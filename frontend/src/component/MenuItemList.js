import {AppBar, Toolbar, IconButton} from "@mui/material";
import {List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Container from "@mui/material/Container";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import React from "react";

export default function MenuItemList({ bubbles }) {
    return bubbles.map((item, index) => (

        <MenuItem>
            <BubbleChartIcon /> {item}
        </MenuItem>

    ));
}