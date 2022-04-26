import * as React from 'react';

import {AppBar, Toolbar, IconButton} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Container from "@mui/material/Container";
import Avatar from '@mui/material/Avatar';

export default function Bubble({ title }) {
    return (
        <div>
            <Avatar alt={ title }/>
        </div>

    );
}