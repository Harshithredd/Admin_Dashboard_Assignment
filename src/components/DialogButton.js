import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import UploadIcon from '@mui/icons-material/Upload';
import { useDispatch, useSelector } from 'react-redux';
import { createdUser, fetchUsers, openDialog } from '../actions';
import UserForm from './UserForm';
import { validate } from '@material-ui/pickers';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { config } from '../App';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root':{
    backgroundColor : "#414040 ",
    color:"white"
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(1),
    
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiPaper-root ':{
    width :"100%",
  },
  '& .MuiFormControl-root':{
    margin : theme.spacing(1),
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'grey',
    },
  },
  '& .MuiFormLabel-root':{
    color:"whitesmoke",
  },
  '& .MuiSelect-outlined ':{
    color:"whitesmoke",
  },
  '& .MuiFormHelperText-root':{
    color:"#1976d2",
  },
  
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};


export default function DialogButton({upload,update,id}) {
//console.log(upload,update)
const FORM_NAME = upload ? upload : update;
//console.log("FORM_NAME",FORM_NAME)
const {enqueueSnackbar} = useSnackbar();
let dispatch = useDispatch();
let dialogState = useSelector((state)=>{
        return state.dialogReducer
    }
 );
let open = dialogState.open;
//console.log(open,dialogState)

let userState = useSelector((state)=>{
    return state.userUploadReducer
}
);
let user = userState.user;
let userCreated = userState.createdUser;
//console.log(userCreated);

let handleClose = ()=>{
    dispatch(openDialog(false))
}
const handleClickOpen = () => {
    dispatch(openDialog(true))
};

const createUpdateUser = () =>{
    if(upload){
        postUserUpload();
    }
    else if(update){
        updateUser();
    }
}
const updateUser = async()=>{
    try{
        let userId = id;
        const res= await axios.patch(`${config.endpoint}/user/${userId}`,user);
        console.log(res);
        enqueueSnackbar("User created successfully", { variant: "success" });
        dispatch(openDialog(false));
        dispatch(createdUser(res.data.data));
    }catch(e){
        console.log(e);
        if (e.response) {
            enqueueSnackbar(e.response.data.message, { variant: "error" });
          } else {
            enqueueSnackbar(
              " Check that the backend is running, reachable and returns valid JSON.",
              {
                variant: "error",
              }
            );
          }
          return null;
    }
}
const postUserUpload = async ()=>{
    if(!validateData(user)) return ;
    try{
        const res= await axios.post(`${config.endpoint}/user/create`,user);
        console.log(res);
        enqueueSnackbar("User created successfully", { variant: "success" });
        dispatch(openDialog(false));
        dispatch(createdUser(res.data.data));
    }catch(e){
        console.log(e);
        if (e.response) {
            enqueueSnackbar(e.response.data.message, { variant: "error" });
          } else {
            enqueueSnackbar(
              " Check that the backend is running, reachable and returns valid JSON.",
              {
                variant: "error",
              }
            );
          }
          return null;
    }
}
const validateData= (formData)=>{
        const {firstName,lastName,phoneNumber,age} = formData;
        if(firstName === "" || lastName==="" || phoneNumber === "" || age === ""){
            enqueueSnackbar("fields cannot be empty", { variant: "Warning" });
            return false;
        }
        if(phoneNumber.length <10 || phoneNumber.length>10){
            enqueueSnackbar("Enter Vaild Phone Number", { variant: "Warning" });
            return false;
        }
        if(age <1 || age>100){
            enqueueSnackbar("Enter Vaild Age", { variant: "Warning" });
            return false;
        }
        return true;
    }

return (
    <div style={{display:"inline-block",marginRight:"10px"}}>
      <Button variant="contained" onClick={handleClickOpen} 
       style={{
                backgroundColor: "#F5EFE6",
                color :"#181d31",
            }}>
        {upload && <UploadIcon/>}
        {FORM_NAME}
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          {FORM_NAME} User
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <UserForm />
        </DialogContent>
        <DialogActions>
          <Button autoFocus  variant="contained" onClick={()=>createUpdateUser()}>
            {FORM_NAME} User
          </Button>
          <Button autoFocus varient="outlined" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
