import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import useGet from '../component/useGet';
import { Container } from '@mui/material';

export default function BasicTable() {
  const getData = useGet('http://localhost:8010/getevent');
  const recordsData = getData.data;
  const recordLoading = getData.isLoading;
  React.useEffect(() => {
  }, []);
  if(recordLoading){
    return (<Container>IS LOADING</Container>)
  }
  else if (!recordLoading && recordsData?.length) { //
    
  

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Unique ID</TableCell>
            <TableCell align="right">Event ID</TableCell>
            <TableCell align="right">Event Name&nbsp;</TableCell>
            <TableCell align="right">Description&nbsp;</TableCell>
            <TableCell align="right">Location&nbsp;</TableCell>
            <TableCell>Date and Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {recordsData.map((row) => (
            <TableRow
              key={row._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row._id}
              </TableCell>
              <TableCell align="right">{row.eventID}</TableCell>
              <TableCell align="right">{row.eventName}</TableCell>
              <TableCell align="right">{row.Description}</TableCell>
              <TableCell align="right">{row.Location}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
          }
          
}
