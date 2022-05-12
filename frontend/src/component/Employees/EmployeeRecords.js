//Author - kieran

import * as React from "react";
import useGet from "../useGet";
import {Container} from "@mui/material";
import EmployeeMenuBar from "./EmployeeMenubar";
import EmployeeTable from "./EmployeeTable";

function EmployeeRecords() {
    const[reRender, setreRender]=React.useState(false);

    // Change the useGet to retrieve employee/staff data
    const getData = useGet('http://localhost:8010/getevent',reRender);
    const recordsData = getData.data;
    const recordLoading = getData.isLoading;
    return (
        <div>
            <Container sx={{mb:4}}>
                <h1>Employees</h1>
                <Container sx={{my:4}} maxWidth="xs">
                    <EmployeeMenuBar render={reRender} setRender={setreRender}/>
                </Container>
                <EmployeeTable data={recordsData} loading={recordLoading}/>
            </Container>
        </div>
    )
}

export default EmployeeRecords