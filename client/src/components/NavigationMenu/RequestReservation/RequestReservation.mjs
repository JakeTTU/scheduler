import React, { useState, useEffect, useContext } from 'react';
// import { NavigationMenuContext } from '../../../context/NavigationMenuContext.mjs';
import { useNavigationMenuContext } from '../../../context/DataContext.mjs';
import './RequestReservation.css'

const RequestReservation = () => {

    const { sharedState, setSharedState } = useNavigationMenuContext();

    const handleClick = (e) => {
        e.preventDefault();
        setSharedState({
            ...sharedState, 
            requestPageOpen: !sharedState.requestPageOpen
        });
    }

    return (
        <div>
            <div className='menu-request-reservation-heading'>
                <button className='menu-request-reservation-fill-button' onClick={handleClick}>Request Reservation</button>
            </div>
        </div>
    );
}
export default RequestReservation;