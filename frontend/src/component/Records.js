//Author - Syed Kazmi
import * as React from 'react';
import RecordsTable from '../component/RecordsTable';
import TableMenuBar from '../component/TableMenubar';
import { Container } from '@mui/material';
import { Box } from '@mui/system';
function Records() {

  return (
    <div>
    <Container>
    <h1>Records</h1>
    <Container maxWidth="xs">
    <TableMenuBar />     
    </Container>
    <RecordsTable /> 
    </Container>
    </div>
  )
}

export default Records