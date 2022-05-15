//Author - Syed Kazmi
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import LoadingGif from '../../Images/loading.gif';
import { Container } from '@mui/material';

export default function RecordsTable({data, loading}) {
  const recordsData = data;
  const recordLoading = loading;
 
  if(recordLoading){
    return (<Container> <img alt="Loading" src={LoadingGif} /> </Container>)
  }
  else if (!recordLoading && recordsData?.length) { //
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Unique ID</TableCell>
            <TableCell align="right">Bubble ID</TableCell>
            <TableCell align="right">Bubble Name&nbsp;</TableCell>
            <TableCell align="right">Active Y/N&nbsp;</TableCell>
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
              <TableCell align="right">{row.bubbleID}</TableCell>
              <TableCell align="right">{row.bubbleName}</TableCell>
              <TableCell align="right">{row.Active}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
          }
          
}
