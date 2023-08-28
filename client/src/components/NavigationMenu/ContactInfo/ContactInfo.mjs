import React, { useState, useEffect } from 'react';
import { useNavigationMenuContext } from '../../../context/DataContext.mjs';
import { MenuContactCard } from '../MenuEventCard/MenuCard.mjs';
import { TooltipContact } from '../../Tooltip/Tooltip.mjs';
import './ContactInfo.css';


const ContactInfo = () => {

    const { sharedState } = useNavigationMenuContext();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isTransitionComplete, setIsTransitionComplete] = useState(true);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipDatum, setTooltipDatum] = useState(false);

    // console.log(sharedState.contacts)

    const handleMenuCollapse = (e) => {
        e.preventDefault()
        setMenuOpen(!menuOpen)
        setIsTransitionComplete(false);
    }

    const handleTransitionEnd = () => {
        setIsTransitionComplete(true);
    };

    const handleMouseOver = (event, eventData) => {
        const { clientX, clientY } = event;
        setTooltipPosition({ x: clientX, y: clientY });
        setTooltipDatum(eventData)
        setShowTooltip(true);
    };
    
    const handleMouseLeave = () => {
        setShowTooltip(false);
        setTooltipDatum(false);
    };

    const contactCardMarkup = sharedState.contacts && sharedState.contacts.map((contact, index) => (
        <div key={index} onMouseOver={(event) => handleMouseOver(event, contact)} onMouseLeave={handleMouseLeave}>
            <MenuContactCard key={index} data={contact} />
        </div>
    ));

    return (
        <div>
            {showTooltip && <TooltipContact datum={tooltipDatum} position={tooltipPosition} parent={document.getElementById('mainPage')}/>}
            <div className='menu-contact-info-heading'>
                <button className='menu-contact-info-fill-button' onClick={handleMenuCollapse}>Contact Info</button>
            </div>
            
            <div className={`menu-contact-info-content ${!menuOpen ? 'collapsed' : ''} ${isTransitionComplete ? 'transitionComplete' : 'transitioning'}`} onTransitionEnd={handleTransitionEnd}>
                {contactCardMarkup}
            </div>
        </div>
    );
}

export default ContactInfo;