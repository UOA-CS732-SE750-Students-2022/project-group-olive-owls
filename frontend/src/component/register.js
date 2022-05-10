//Author - Syed Kazmi
import * as React from 'react';

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {
  Link
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useNavigate
} from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from 'axios';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


export default function Register() {
  let navigate = useNavigate();
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [openFail, setOpenFail] = React.useState(false);
const handleCloseSuccess = () => {
  setOpenSuccess(false);
  };
  const handleRedirectToLogin = () => {
    navigate('/login');
    };
const handleCloseFail = () => {
  setOpenFail(false);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // console.log({
    //   email: data.get('email'),
    //   password: data.get('password'),
    // });
    try {
      const res = await axios.post("http://localhost:8010/adduser",
      {  username: data.get('email'),
          password: data.get('password')
      }
          );
        if (res.status === 200) {
          console.log("User Created successfully");
          setOpenSuccess(true);
        } else {
          console.log("Some error occured");
          console.log(res.data);
          setOpenFail(true);
        }
      } catch (err) {
        console.log(err);
        setOpenFail(true);
      }

  };

  return (
    
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  type="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                
              </Grid>
            </Grid>
          </Box>
          
        </Box>
      <Dialog open={openSuccess} onClose={handleCloseSuccess}>
        <DialogTitle>Successfully Registered</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are now successfully registered, please login.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccess}>Close</Button>
          <Button onClick={handleRedirectToLogin}>Login</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openFail} onClose={handleCloseFail}>
        <DialogTitle>Registration not successfull</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Something went wrong, please try registering again
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFail}>Close</Button>
        </DialogActions>
      </Dialog>
      </Container>
    
  );
}