import React from 'react';
import Modal from 'react-modal';
import axios from "axios"
import "./AddUserPage.css"
import { useState } from "react"
import { useLocation } from 'react-router-dom';
import { SERVERHOST, SERVERPORT } from '../../ServerConnection.mjs';

const appRoot = document.getElementById('root');
Modal.setAppElement(appRoot);

const AddUserPage = ({ addUserPageOpen, onClose }) => {

  const [userEmail, setUserEmail] = useState(null);
  const [userPassword1, setUserPassword1] = useState(null);
  const [userPassword2, setUserPassword2] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userRoleOption, setUserRoleOption] = useState('default');
  const [showPassword, setShowPassword] = useState(false);

  const validUserRoles = ['user', 'admin', 'read-only', 'dev']

  const clearAllInputs = () => {
    setUserEmail(null); setUserPassword1(null); setUserPassword2(null); setUserRole(null); setUserRoleOption('default'); setShowPassword(false)
  }

  const getHash = (str, algo = "SHA-256") => {
    let strBuf = new TextEncoder().encode(str);
    return crypto.subtle.digest(algo, strBuf)
      .then(hash => {
        window.hash = hash;
        let result = '';
        const view = new DataView(hash);
        for (let i = 0; i < hash.byteLength; i += 4) {
          result += ('00000000' + view.getUint32(i).toString(16)).slice(-8);
        }
        return result;
      });
  } 

  const location = useLocation()

  const handleClose = (event) => {
    event.preventDefault();
    clearAllInputs()
    onClose()
  };

  const handleShowPassword = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };
  

  async function handleSubmit(e){

    
    e.preventDefault();

    if (userPassword1 !== userPassword2){
      alert('Password entires do not match.\nPlease try again.')
      return 
    }

    if (!(userEmail && userPassword1 && userPassword2 && userRole)){
      alert('Missing required information')
    }

    const newUserObj = {
      user_email: userEmail.toLowerCase(),
      user_role: userRole.toLowerCase(),
      user_passord: userPassword1,
      
    }

    postNewUser(newUserObj);
    clearAllInputs();
    onClose();
  }

  async function postNewUser(newUserObj){
    try{
      await axios.post(`http://${SERVERHOST}:${SERVERPORT}/user/createUser`,{newUserObj})
      .then(res=>{
        console.log(res)
        if(res.status===201){
          console.log('user added')
        }
        else{
          console.error(res)
        }
      })
      .catch(e=>{
        console.error(e);
      })
    }
    catch(e){
      console.error(e);
    }
  }

  return (
    <Modal
        isOpen={addUserPageOpen}
        onApprovalClose={onClose}
        contentLabel="addUserPage"
        className="addUserPage"
    >
      <span id="popup-heading">ADD USER ACCOUNT</span>

      <div className="popup-input-div">
        <label htmlFor="popup-user-email" className='popup-label-text'>User Email:</label>
        <input className="popup-form" id="popup-user-email" onChange={(e) => { setUserEmail(e.target.value) }} placeholder="Email" />
      </div>

      <div className="popup-input-div">
        <label htmlFor="popup-user-password1" className='popup-label-text'>User Password:</label>
        <input type={showPassword ? null : "password"} className="popup-form" id="popup-user-password1" onChange={(e) => { getHash(e.target.value).then(d=> {setUserPassword1(d)}) }} placeholder="Password" />
        <button id="popup-show-password" onClick={handleShowPassword}>Show</button>
      </div>
      <div className="popup-input-div">
        <label htmlFor="popup-user-password2" className='popup-label-text'>User Password:</label>
        <input type={showPassword ? null : "password"} className="popup-form" id="popup-user-password2" onChange={(e) => { getHash(e.target.value).then(d=> {setUserPassword2(d)}) }} placeholder="Confirm Password" />
      </div>

      <div id="popup-user-role-div">
      <label htmlFor="popup-user-role" className='popup-label-text' id="popup-user-role-label">User Role:</label>
        <select className={userRole === null ? "select-error" : ""} value={userRoleOption} name="userRole" id="popup-user-role" onChange={(e) => { setUserRole(e.target.value); setUserRoleOption(e.target.key)}}>
          <option value="default" disabled>Select Role</option>
          {validUserRoles.map((role, index) => (
            <option key={index} value={role}>{role[0].toUpperCase() + role.slice(1)}</option>
          ))}
        </select>
      </div>
      <button id="popup-submit" onClick={handleSubmit}>Submit</button>
      <button id='popup-cancel'onClick={handleClose}>Cancel</button> 
    </Modal>
  );
};

export default AddUserPage;
