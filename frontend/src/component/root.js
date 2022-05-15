import * as React from 'react';
import Button from '@mui/material/Button'
import {Box} from '@mui/material'
import {
    Link
  } from "react-router-dom";

import Container from '@mui/material/Container';

//Front page of the application, displays a container with links to the signin and register pages
export default function SignIn() {


    return (
        <div>
            <Container component="main" maxWidth="xs">
                <Box sx={{
                    marginTop: 70,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                    <Link to='/login'>
                        <Button fullWidth variant="contained"  sx={{
                            marginRight: 10,
                          }}>
                            Login
                        </Button>
                    </Link>
                    <Link to='/register'>
                        <Button fullWidth variant="contained" sx={{
                            marginLeft: 10,
                          }}>
                            Register
                        </Button>
                    </Link>
                </Box>
            </Container>
        </div>
    )
}
