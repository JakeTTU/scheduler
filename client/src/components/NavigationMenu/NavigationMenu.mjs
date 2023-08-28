import React, { useState, useEffect, useContext } from 'react';
import PendingEvents from './PendingEvents/PendingEvents.mjs';
import ApprovedEvents from './ApprovedEvents/ApprovedEvents.mjs';
import ContactInfo from './ContactInfo/ContactInfo.mjs';
import RequestReservation from './RequestReservation/RequestReservation.mjs';
import './NavigationMenu.css';
import RequestPage from '../RequestPage/RequestPage.mjs';
import ApprovalPage from '../ApprovalPage/ApprovalPage.mjs'
import { useLocation, useNavigate } from 'react-router-dom';
import Logout from './Logout/Logout.mjs';
import { FilteringButton } from './FilteringButton/FilteringButton.mjs'
import { AdminControls } from './AdminControls/AdminControls.mjs';
import AddUserPage from '../AddUserPage/AddUserPage.mjs';
import { useNavigationMenuContext } from '../../context/DataContext.mjs';

const NavigationMenu = (props) => {

    const history = useNavigate()

    const location = useLocation()
    if (!location.state || (location.state && !location.state.auth)){
        history("/")
    }
    
    const { sharedState, setSharedState } = useNavigationMenuContext();

    const handleRequestPageClose = () => {
        setSharedState({
            ...sharedState, 
            requestPageOpen: false
        });
    };

    const handleApprovalPageClose = () => {
        setSharedState({
            ...sharedState, 
            approvalPageOpen: false
        });
    };

    const handleAddUserPageClose = () => {
        setSharedState({
            ...sharedState, 
            addUserPageOpen: false
        });
    };

    return (
        <div className='navigationMenu'>
            {location.state.auth !== 'read-only' && <RequestReservation />}
            {(location.state.auth === 'admin' || location.state.auth === 'dev') && <AdminControls/>}
            <FilteringButton/>
            <ApprovedEvents data={props.data.approvedEvents}/>
            {(location.state.auth === 'admin' || location.state.auth === 'dev') && <PendingEvents data={props.data.pendingEvents}/>}
            <ContactInfo />
            <RequestPage requestPageOpen={sharedState.requestPageOpen} onClose={handleRequestPageClose} />
            {sharedState.approvalPageOpen && <ApprovalPage approvalPageOpen={sharedState.approvalPageOpen} onClose={handleApprovalPageClose} datum={sharedState.selectedEventData}/> }
            {sharedState.addUserPageOpen && <AddUserPage addUserPageOpen={sharedState.addUserPageOpen} onClose={handleAddUserPageClose}/> }
            <Logout />
        </div>
    );
}

export default NavigationMenu;