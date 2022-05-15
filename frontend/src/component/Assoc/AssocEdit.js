//Author - Syed Kazmi
import Container from "@mui/material/Container";
import * as React from "react";
import AssocMenuBar from "../Assoc/AssocMenubar";
import AssocTable from "../Assoc/AssocTable";
import useGet from "../useGet";

export default function AssocEdit(prop) {

    //gets id from the prop passed in by parameter passing
    const {id} = prop


    const[reRender, setreRender]=React.useState(false);
    const getData = useGet('http://localhost:8010/getassoc',reRender);
    const recordsData = getData.data;
    console.log(recordsData);
    const recordLoading = getData.isLoading;

    return (
        //needs to query the databse anout what the bubble holds and then be able to remove or assing employees to it

    <div>
        <Container sx={{mb:4}}>
            <h1>Association Management</h1>
            <Container sx={{my:4}} maxWidth="xs">
                <AssocMenuBar render={reRender} setRender={setreRender}/>
            </Container>
            <AssocTable data={recordsData} loading={recordLoading}/>
        </Container>
    </div>




    )
}