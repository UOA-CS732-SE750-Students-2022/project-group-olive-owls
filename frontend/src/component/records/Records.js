//Author - Syed Kazmi
import * as React from 'react';
import RecordsTable from './RecordsTable';
import TableMenuBar from './TableMenubar';
import { Container } from '@mui/material';
import useGet from '../useGet';

function Records() {
  const[reRender, setreRender]=React.useState(false);
  const getData = useGet('http://localhost:8010/getevent',reRender);
  const recordsData = getData.data;
  const recordLoading = getData.isLoading;
  return (
    <div>
    <Container sx={{mb:4}}>
    <h1>Records</h1>
    <Container sx={{my:4}} maxWidth="xs">
    <TableMenuBar render={reRender} setRender={setreRender}/>     
    </Container>
    <RecordsTable data={recordsData} loading={recordLoading}/> 
    </Container>
    </div>
  )
}

export default Records