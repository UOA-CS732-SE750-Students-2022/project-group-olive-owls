
import * as React from 'react';
import RecordsTable from '../component/RecordsTable';
import MenuBar from '../component/Menubar';
import { Container } from '@mui/material';
import { Box } from '@mui/system';
function Records() {

  return (
    <div>
    <Container>
    <h1>Records</h1>
    <Container maxWidth="xs">
    <MenuBar />     
    </Container>
    <RecordsTable /> 
    </Container>
    </div>
  )
}

export default Records