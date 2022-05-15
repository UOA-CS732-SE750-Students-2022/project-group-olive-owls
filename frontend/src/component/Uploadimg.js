//Author - Guanxiang Zhao

import React, { Fragment ,useState} from 'react';
import ReactDOM from 'react-dom';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import axios from 'axios';

const Input = styled('input')({
    display: 'none',
});


export default function Uploadimg() {
    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Choose File');
    const [uploadedFile, setUploadedFile] = useState({});
    
    const onChange = e => {
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    };

    const onSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        try{
            const res = await axios.post('http://localhost:8010/upload', formData, {
                headers: {
                    'Content-Type' : 'mulipart/form-data'
                }
            });

            const { fileName, filePath} = res.data;

            setUploadedFile({ fileName, filePath});
        } catch(err) {
            if(err.response.status == 500) {
                console.log('There is a problem -- server');
            } else {
                console.log(err.response.data.msg);
            }
        }
    };


    return (
        <Container component="main" maxWidth="sm">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', background:'#ADD8E6', padding:25, borderRadius:5}} >
                { uploadedFile ? (<Box>
                    <img style={{ width:'100%'}} src={uploadedFile.filePath} alt=''/>
                    </Box>) : null}


                <Box sx={{marginTop: 2, position: 'relative', bottom:-160}}>
                    <h3 style={{margin:25, width:400}}>Please upload your file</h3>
                    <form onSubmit={onSubmit} >
                        <div className="custom-file">
                            <label htmlFor="contained-button-file">
                                <Input accept="image/*" id="contained-button-file" multiple type="file" onChange= {onChange}/>
                                <Button variant="contained" component="span" sx={{width: 200, backgroundColor: "#41a1d1"}}>
                                    {filename}
                                </Button>
                            </label>
                            <Button type="submit"  variant="contained" sx={{ml:1}}>Upload</Button>
                        </div>

                    </form>
                </Box>
                
            </Box>

        </Container>
    );
};