//Author - Syed Kazmi
import * as React from 'react';
import {AppBar, Toolbar, IconButton} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete'
import Container from "@mui/material/Container";
import axios from 'axios';


import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
export default function AssocMenubar(props) {
    const [openAdd, setOpenAdd] = React.useState(false);
    const [openDel, setOpenDel] = React.useState(false);
    const [bubbleidVal, setbubbleidVal] = React.useState("");
    const [staffidVal, setstaffidVal] = React.useState("");

    const handleSubmitDel = async (e) => {
        e.preventDefault();
        //console.log(eventIDVal);
        try {
          const res = await axios.post("http://localhost:8010/delassoc", 
          {  
              bubbleid: bubbleidVal,
              staffid: staffidVal
          } ,
            {headers: {"Authorization" : "Bearer 1234567890"}}
              );
         
          if (res.status === 200) {
            console.log("Record Deleted successfully");
          } else {
            console.log("Some error occured");
          }
        } catch (err) {
          console.log(err);
        }
        handleCloseDel();
        props.setRender(!props.render);
      };

    const handleSubmitAdd = async (e) => {
        e.preventDefault();
        //console.log(eventIDVal);
        try {
        const res = await axios.post("http://localhost:8010/addassoc", 
        {  
            bubbleid: bubbleidVal,
            staffid: staffidVal
        } ,
          {headers: {"Authorization" : "Bearer 1234567890"}}
            );
          if (res.status === 200) {
            console.log("Record Added successfully");
          } else {
            console.log("Some error occured");
          }
        } catch (err) {
          console.log(err);
        }
        setbubbleidVal("");
        setstaffidVal("");
        handleCloseAdd();
        props.setRender(!props.render);
      };

  
      const handleClickOpenAdd = () => {
        setOpenAdd(true);
      };
    const handleCloseAdd = () => {
        setOpenAdd(false);
      };
      const handleClickOpenDel = () => {
        setOpenDel(true);
      };
    const handleCloseDel = () => {
        setOpenDel(false);
      };
    return (
        <AppBar position={"static"}>
            <Container maxWidth={"xs"}>
                <Toolbar>
                    <IconButton color={"inherit"} sx={{ flexGrow: 2 }} onClick={handleClickOpenAdd}>
                        <AddIcon />
                    </IconButton>
                    <IconButton color={"inherit"} sx={{ flexGrow: 2 }} onClick={handleClickOpenDel}>
                        <DeleteIcon />
                    </IconButton>
                </Toolbar>
            </Container>
      <Dialog open={openAdd} onClose={handleCloseAdd}>
        <DialogTitle>Add Association</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please Enter the Bubble ID and Staff ID you would like to create an association for. 
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="bubbleid"
            value={bubbleidVal}
            label="Bubble ID Number"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setbubbleidVal(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="StaffId"
            value={staffidVal}
            label="Staff ID Number"
            type="number"
            fullWidth
            variant="standard"
            onChange={(e) => setstaffidVal(e.target.value)}
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd}>Cancel</Button>
          <Button onClick={handleSubmitAdd}>Add Association</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDel} onClose={handleCloseDel}>
        <DialogTitle>Delete Association</DialogTitle>
        <DialogContent>
          <DialogContentText>
          Please Enter the Bubble ID and Staff ID you would like to remove an association for.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="bubbleid"
            value={bubbleidVal}
            label="Bubble ID Number"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setbubbleidVal(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="StaffId"
            value={staffidVal}
            label="Staff ID Number"
            type="number"
            fullWidth
            variant="standard"
            onChange={(e) => setstaffidVal(e.target.value)}
          />
            
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDel}>Cancel</Button>
          <Button onClick={handleSubmitDel}>Delete</Button>
        </DialogActions>
      </Dialog>
        </AppBar>
        
    );
}