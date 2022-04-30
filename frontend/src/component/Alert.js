import {useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function Alert(openAlert, props) {
    const [open, setOpen] = useState(openAlert);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby={"alert-title"}
                aria-describedby={"alert-description"}
            >
                <DialogTitle id={"alert-title"}>
                    {"COVID BUBBLE ALERT"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id={"alert-description"}>
                        A member of one bubble has tested for COVID.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autofocus>Check Details</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}