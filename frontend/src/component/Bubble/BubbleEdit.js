import Container from "@mui/material/Container";
import {Box} from "@mui/material";
import {Link} from "react-router-dom";
import Button from "@mui/material/Button";
import * as React from "react";
import TableMenuBar from "../Bubble/BubbleMenubar";
import RecordsTable from "../Bubble/BubbleTable";
import useGet from "../useGet";
import BackBar from '../BackBar';
export default function BubbleEdit(prop) {

    //gets id from the prop passed in by parameter passing
    const {id} = prop


    const[reRender, setreRender]=React.useState(false);
    const getData = useGet('http://localhost:8010/getbubble',reRender);
    const recordsData = getData.data;
    console.log(recordsData);
    const recordLoading = getData.isLoading;

    return (
        //needs to query the databse anout what the bubble holds and then be able to remove or assing employees to it

    <div>
        <Container sx={{mb:4}}>
        <BackBar></BackBar>
            <h1>Bubble Management</h1>
            <Container sx={{my:4}} maxWidth="xs">
                <TableMenuBar render={reRender} setRender={setreRender}/>
            </Container>
            <RecordsTable data={recordsData} loading={recordLoading}/>
        </Container>
    </div>




    )
}