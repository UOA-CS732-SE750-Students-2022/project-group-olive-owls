import {AppBar, Toolbar, IconButton} from "@mui/material";
import {List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Container from "@mui/material/Container";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
// import { uuid } from 'uuidv4';
import React from "react";

export default function MenuItemList({ bubbles }) {

    console.log(bubbles)

    return bubbles.map((item) => (

        <MenuItem>
            <BubbleChartIcon /> {item.title}
        </MenuItem>

    ));
}