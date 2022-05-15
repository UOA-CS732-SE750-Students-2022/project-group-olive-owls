//Author - Kieran
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
    const [staffIDVal, setStaffID] = React.useState("");
    const [staffNameVal, setStaffFirstName] = React.useState("");
    const [staffLastName, setStaffLastName] = React.useState("");
    const [staffActiveVal, setStaffActive] = React.useState("Y");
    const [staffDateVal, setStaffDateVal] = React.useState("");
    const [dateOfBirthVal, setDateBirth] = React.useState("");

    const handleSubmitDel = async (e) => {
        e.preventDefault();
        //console.log(staffIDVal);
        try {
          const res = await axios.post("http://localhost:8010/deactivatestaff",
          { staffID: staffIDVal },
             {headers: {"Authorization" : "Bearer 1234567890"},
            }
            );

          if (res.status === 200) {
            console.log("User Deleted successfully");
          } else {
            console.log("Some error occured");
          }
        } catch (err) {
          console.log(err);
        }



        //setStaffID("");
        handleCloseDel();
        props.setRender(!props.render);
      };

    const handleSubmitAdd = async (e) => {
        e.preventDefault();
        //console.log(staffIDVal);
        try {
        const res = await axios.post("http://localhost:8010/addstaff",
        {  
            staffID: staffIDVal,
            firstName: staffNameVal,
            surname:staffLastName,
            active: staffActiveVal,
            startDate:staffDateVal,
            DOB:dateOfBirthVal,

        } ,
          {headers: {"Authorization" : "Bearer 1234567890"}}
            );
          if (res.status === 200) {
            console.log("User Added successfully");
          } else {
            console.log("Some error occured");
          }
        } catch (err) {
          console.log(err);
        }
        setStaffFirstName("");
        setStaffActive("");
        setStaffDateVal("");
        handleCloseAdd();
        props.setRender(!props.render);
      };
    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        //console.log(staffIDVal);
        try {
        const res = await axios.post("http://localhost:8010/updstaff",
        {  staffID: staffIDVal,
            firstName: staffNameVal,
            surname:staffLastName,
            active: staffActiveVal,
            startDate:staffDateVal,
            DOB:dateOfBirthVal,
        } ,
          {params: { eventid: staffIDVal },
          headers: {"Authorization" : "Bearer 1234567890"}}
            );
          if (res.status === 200) {
            console.log("User Edited successfully");
          } else {
            console.log("Some error occured");
          }
        } catch (err) {
          console.log(err);
        }
        setStaffID("");
        setStaffFirstName("");
        setStaffActive("");
        setStaffDateVal("");
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
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please Enter the Employee ID and the Information you would like to add into that entry.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="Employee ID"
            value={staffIDVal}
            label="Employee ID"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setStaffID(e.target.value)}
          />
            <TextField
            autoFocus
            margin="dense"
            id="Employee first name"
            value={staffNameVal}
            label="Employee first name"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setStaffFirstName(e.target.value)}
          />
            <TextField
                autoFocus
                margin="dense"
                id="Employee last name"
                value={staffLastName}
                label="Employee last name"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) => setStaffLastName(e.target.value)}
            />
            <TextField
                autoFocus
                margin="dense"
                id="Description"
                value={staffActiveVal}
                label="Active"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) => setStaffActive(e.target.value)}
            />
            <TextField
                autoFocus
                margin="dense"
                id="dateTime"
                value={staffDateVal}
                helperText="start date"
                type="datetime-local"
                fullWidth
                variant="standard"
                onChange={(e) => setStaffDateVal(e.target.value)}
            />
            <TextField
                autoFocus
                margin="dense"
                id="dateTime"
                value={dateOfBirthVal}
                helperText="Date of birth"
                type="datetime-local"
                fullWidth
                variant="standard"
                onChange={(e) => setDateBirth(e.target.value)}
            />

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button onClick={handleSubmitEdit}>Edit Employee</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openAdd} onClose={handleCloseAdd}>
        <DialogTitle>Add Employee</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please Enter the Information you would like to add into the new entry. 
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="employeeName"
            value={staffNameVal}
            label="Employee name"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setStaffFirstName(e.target.value)}
          />
            <TextField
                autoFocus
                margin="dense"
                id="employeeLastName"
                value={staffLastName}
                label="Employee Last Name"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) => setStaffLastName(e.target.value)}
            />
          <TextField
            autoFocus
            margin="dense"
            id="Description"
            value="Y"
            label="Active"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setStaffActive(e.target.value)}
          />
            <TextField
                autoFocus
                margin="dense"
                id="dateTime"
                value={staffDateVal}
                helperText="start date"
                type="datetime-local"
                fullWidth
                variant="standard"
                onChange={(e) => setStaffDateVal(e.target.value)}
            />
            <TextField
                autoFocus
                margin="dense"
                id="dateTime"
                value={dateOfBirthVal}
                helperText="Date of birth"
                type="datetime-local"
                fullWidth
                variant="standard"
                onChange={(e) => setDateBirth(e.target.value)}
            />

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd}>Cancel</Button>
          <Button onClick={handleSubmitAdd}>Add Employee</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDel} onClose={handleCloseDel}>
        <DialogTitle>Delete Employee</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please Enter the EmployeeID of the employee you would like to delete.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="employeeID"
            value={staffIDVal}
            label="Employee ID"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setStaffID(e.target.value)}
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