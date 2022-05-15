//Author - Syed Kazmi
import * as React from 'react';

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {
  Link, useNavigate
} from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from 'axios';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";

//Sign in page
export default function SignIn() {
  let navigate = useNavigate();
  const [openFail, setOpenFail] = React.useState(false);
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
      const res = await axios.post("http://localhost:8010/authenticate",
      {  username: data.get('email'),
          password: data.get('password')
      }
          );
        if (res.status === 200) {
          if (res.data.authtoken) {
            localStorage.setItem("user", JSON.stringify(res.data));
            console.log("User Signed in successfully");
            navigate('/home');
          }
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
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >Sign In
            </Button>
            <Grid container>
              <Grid item xs>
               
              </Grid>
              <Grid item>
                
              </Grid>
            </Grid>
          </Box>

        </Box>
      <Dialog open={openFail} onClose={handleCloseFail}>
        <DialogTitle>Registration not successfull</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Something went wrong, please try signing again
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFail}>Close</Button>
        </DialogActions>
      </Dialog>
      </Container>
    
  );
}