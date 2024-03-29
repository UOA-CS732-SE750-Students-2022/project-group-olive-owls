import {AppBar, Toolbar, IconButton} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Container from "@mui/material/Container";
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";
export default function Menubar() {
    const navigate = useNavigate();
    const logoutProcess = () =>{
        localStorage.removeItem("user")
        navigate("/");
    }
    return (
        <AppBar position={"static"}>
            <Container maxWidth={"xs"}>
                <Toolbar>
                <LogoutIcon onClick={logoutProcess}></LogoutIcon>
                </Toolbar>
            </Container>
        </AppBar>
    );
}