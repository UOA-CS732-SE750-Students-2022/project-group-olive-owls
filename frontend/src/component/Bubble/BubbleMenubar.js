//Author - Syed Kazmi
import * as React from 'react';
import {AppBar, Toolbar, IconButton} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
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
export default function TableMenubar(props) {
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openDel, setOpenDel] = React.useState(false);
  const [bubbleidVal, setbubbleidVal] = React.useState("");
  const [bubblenameVal, setbubblenameVal] = React.useState("");
  const [activeVal, setactiveVal] = React.useState("");


  const handleSubmitDel = async (e) => {
      e.preventDefault();
      //console.log(eventIDVal);
      try {
        const res = await axios.get("http://localhost:8010/delbubble", 
        { params: { bubbleID: bubbleidVal },
             headers: {"Authorization" : "Bearer 1234567890"}}
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
      const res = await axios.post("http://localhost:8010/addbubble", 
      {  
        bubbleName:bubblenameVal,
        Active:activeVal,
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
      <DialogTitle>Add Bubble</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Would you like to create a New Bubble 
        </DialogContentText>
        <TextField
            autoFocus
            margin="dense"
            id="bubbleid"
            value={bubblenameVal}
            label="Name of Bubble"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setbubblenameVal(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="StaffId"
            value={activeVal}
            label="Is bubble Active Y/N"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setactiveVal(e.target.value)}
          />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseAdd}>Cancel</Button>
        <Button onClick={handleSubmitAdd}>Create Bubble</Button>
      </DialogActions>
    </Dialog>

    <Dialog open={openDel} onClose={handleCloseDel}>
      <DialogTitle>Delete Bubble</DialogTitle>
      <DialogContent>
        <DialogContentText>
        Please Enter the Bubble ID for the bubble you would like to date
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="bubbleid"
          value={bubbleidVal}
          label="Bubble ID Number"
          type="number"
          fullWidth
          variant="standard"
          onChange={(e) => setbubbleidVal(e.target.value)}
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