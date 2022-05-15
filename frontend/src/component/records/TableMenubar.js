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
    const [openEdit, setOpenEdit] = React.useState(false);
    const [openAdd, setOpenAdd] = React.useState(false);
    const [openDel, setOpenDel] = React.useState(false);
    const [eventIDVal, seteventIDVal] = React.useState("");
    const [eventNameVal, seteventNameVal] = React.useState("");
    const [eventDescVal, seteventDescVal] = React.useState("");
    const [eventLocVal, seteventLocVal] = React.useState("");
    const [eventDateVal, seteventDateVal] = React.useState("");

    const handleSubmitDel = async (e) => {
        e.preventDefault();
        //console.log(eventIDVal);
        try {
          const res = await axios.get("http://localhost:8010/delevent", 
          { params: { eventid: eventIDVal },
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
        seteventIDVal("");
        handleCloseDel();
        props.setRender(!props.render);
      };

    const handleSubmitAdd = async (e) => {
        e.preventDefault();
        //console.log(eventIDVal);
        try {
        const res = await axios.post("http://localhost:8010/addevent", 
        {  
            eventName: eventNameVal,
            Description: eventDescVal,
            Location:eventLocVal,
            dateTime:eventDateVal
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
        seteventNameVal("");
        seteventDescVal("");
        seteventLocVal("");
        seteventDateVal("");
        handleCloseAdd();
        props.setRender(!props.render);
      };
    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        //console.log(eventIDVal);
        try {
        const res = await axios.post("http://localhost:8010/updevent", 
        {  eventid: eventIDVal,
            eventName: eventNameVal,
            Description: eventDescVal,
            Location:eventLocVal,
            dateTime:eventDateVal
        } ,
          {params: { eventid: eventIDVal },
          headers: {"Authorization" : "Bearer 1234567890"}}
            );
          if (res.status === 200) {
            console.log("Record Edited successfully");
          } else {
            console.log("Some error occured");
          }
        } catch (err) {
          console.log(err);
        }
        seteventIDVal("");
        seteventNameVal("");
        seteventDescVal("");
        seteventLocVal("");
        seteventDateVal("");
        handleCloseEdit();
        props.setRender(!props.render);
      };
    


    const handleClickOpenEdit = () => {
        setOpenEdit(true);
      };
    const handleCloseEdit = () => {
        setOpenEdit(false);
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
                    <IconButton color={"inherit"} sx={{ flexGrow: 2 }} onClick={handleClickOpenEdit}>
                        <EditIcon />
                    </IconButton>
                    <IconButton color={"inherit"} sx={{ flexGrow: 2 }} onClick={handleClickOpenAdd}>
                        <AddIcon />
                    </IconButton>
                    <IconButton color={"inherit"} sx={{ flexGrow: 2 }} onClick={handleClickOpenDel}>
                        <DeleteIcon />
                    </IconButton>
                </Toolbar>
            </Container>
    <Dialog open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please Enter the EventID and the Information you would like to add into that entry.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="eventID"
            value={eventIDVal}
            label="Event ID"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => seteventIDVal(e.target.value)}
          />
            <TextField
            autoFocus
            margin="dense"
            id="eventName"
            value={eventNameVal}
            label="Event Name"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => seteventNameVal(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="Description"
            value={eventDescVal}
            label="Event Description"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => seteventDescVal(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="Location"
            value={eventLocVal}
            label="Event Location"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => seteventLocVal(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="dateTime"
            value={eventDateVal}
            label=""
            type="datetime-local"
            fullWidth
            variant="standard"
            onChange={(e) => seteventDateVal(e.target.value)}
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button onClick={handleSubmitEdit}>Edit Event</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openAdd} onClose={handleCloseAdd}>
        <DialogTitle>Add Event</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please Enter the Information you would like to add into the new entry. 
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="eventName"
            value={eventNameVal}
            label="Event Name"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => seteventNameVal(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="Description"
            value={eventDescVal}
            label="Event Description"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => seteventDescVal(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="Location"
            value={eventLocVal}
            label="Event Location"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => seteventLocVal(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="dateTime"
            value={eventDateVal}
            label=""
            type="datetime-local"
            fullWidth
            variant="standard"
            onChange={(e) => seteventDateVal(e.target.value)}
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd}>Cancel</Button>
          <Button onClick={handleSubmitAdd}>Add Event</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDel} onClose={handleCloseDel}>
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please Enter the EventID of the event you would like to delete.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="eventID"
            value={eventIDVal}
            label="Event ID"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => seteventIDVal(e.target.value)}
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