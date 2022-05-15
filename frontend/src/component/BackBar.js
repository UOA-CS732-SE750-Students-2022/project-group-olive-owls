import {AppBar, Toolbar, IconButton} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
export default function BackBar() {
    const navigate = useNavigate();
    return (
        <AppBar position={"static"}>
                <Toolbar>
                <HomeIcon onClick={() => navigate("/home")}></HomeIcon>
                </Toolbar>
        </AppBar>
    );
}