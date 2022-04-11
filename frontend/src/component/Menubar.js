import {AppBar, Toolbar, IconButton} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Container from "@mui/material/Container";

export default function Menubar() {
    return (
        <AppBar position={"static"}>
            <Container maxWidth={"xs"}>
                <Toolbar>
                    <IconButton color={"inherit"} sx={{ flexGrow: 2 }}>
                        <EditIcon />
                    </IconButton>
                    <IconButton color={"inherit"} sx={{ flexGrow: 2 }}>
                        <AddIcon />
                    </IconButton>
                </Toolbar>
            </Container>
        </AppBar>
    );
}