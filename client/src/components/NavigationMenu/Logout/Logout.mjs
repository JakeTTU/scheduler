import React, { useState, useEffect, useContext } from 'react';
// import { NavigationMenuContext } from '../../../context/NavigationMenuContext.mjs';
import './Logout.css'
import { useLocation, useNavigate } from 'react-router-dom';

const Logout = () => {

    // const { sharedState, setSharedState } = useContext(NavigationMenuContext);
    const history = useNavigate()

    const handleClick = (e) => {
        e.preventDefault();
        history("/", {auth: false, state:false})
    }

    return (
        <div>
            <div className='menu-logout-heading'>
                <button className='menu-logout-fill-button' onClick={handleClick}>Logout</button>
            </div>
        </div>
    );
}
export default Logout;