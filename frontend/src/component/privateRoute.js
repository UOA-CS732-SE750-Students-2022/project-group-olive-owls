//Author - Syed Kazmi
import React from 'react';
import { Route, useNavigate } from 'react-router-dom';
import useVerify from './../component/useVerify';
import LoadingGif from '../Images/loading.gif';
import { Container } from '@mui/material';
import axios from 'axios';
//export default function PrivateRoute({ children }) {
 const PrivateRoute = ({ children }) => {
   let navigate = useNavigate();

   const curUser = JSON.parse(localStorage.getItem('user'));
   if(!curUser){
      navigate('/login');
   }
   const[reRender, setreRender]=React.useState(false);
   const [authentic, setAuthentic] = React.useState(false);
   const [isLoading, setLoading] = React.useState(false);
   //console.log(validUser)
   React.useEffect(() => {
      async function fetchData() {
          setLoading(true);
          setAuthentic(false);
          console.log("Getting data ")
          try{
            const response = await axios.post("http://localhost:8010/verifytoken", { authtoken: curUser.authtoken}, { headers: {"Authorization" : `Bearer 1234567890`} });
          if(response.status == 200){
              console.log("Response with success code")
              console.log(response.status)
              setAuthentic(true);
          }
          
          setLoading(false);
          console.log("Finished fetching")
          
          }catch(err){
            setLoading(false);
            navigate('/login');
          }
          

      }
      fetchData();
  }, [reRender]);

   //const { component: Component, ...rest } = props;
   //console.log(isLoading)
   if(isLoading) {
      return (<Container> <img alt="Loading" src={LoadingGif} /> </Container>)
   }
   else{
      if(authentic){
         return children
         }
   }
}
export default PrivateRoute