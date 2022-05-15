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
import {accordionActionsClasses, Container} from '@mui/material';

export default function EmployeeRecords({data, loading}) {
  const recordsData = data;
  const recordLoading = loading;

  const active = "Y";

  if(recordLoading){
    return (<Container> <img alt="Loading" src={LoadingGif} /> </Container>)
  }
  else if (!recordLoading && recordsData?.length) { //

    console.log("inSIde employeey table" );
    console.log({data});

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Unique ID</TableCell>
            <TableCell align="right">Employee ID</TableCell>
            <TableCell align="right">First name&nbsp;</TableCell>
            <TableCell align="right">Surname&nbsp;</TableCell>
            <TableCell align="right">Active&nbsp;</TableCell>
            <TableCell align="right"> Join date</TableCell>
            <TableCell align="right"> Date of birth</TableCell>
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
              <TableCell align="right">{row.staffID}</TableCell>
              <TableCell align="right">{row.firstName}</TableCell>
              <TableCell align="right">{row.surname}</TableCell>
              <TableCell align="right">{row.active}</TableCell>
              <TableCell align="right">{row.startDate}</TableCell>
              <TableCell align="right">{row.DOB}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
          }
          
}
