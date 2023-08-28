import React, { useState, useEffect } from 'react';
import { MenuEventCard } from '../MenuEventCard/MenuCard.mjs';
import './ApprovedEvents.css';
import { TooltipEvent } from '../../Tooltip/Tooltip.mjs';
import { useNavigationMenuContext } from '../../../context/DataContext.mjs';


const ApprovedEvents = (props) => {

    const { sharedState, setSharedState } = useNavigationMenuContext();

    const [menuOpen, setMenuOpen] = useState(false);
    const [isTransitionComplete, setIsTransitionComplete] = useState(true);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipDatum, setTooltipDatum] = useState(false);

    const handleMenuCollapse = (e) => {
        e.preventDefault()
        setMenuOpen(!menuOpen)
        setIsTransitionComplete(false);
    }

    const handleTransitionEnd = () => {
        setIsTransitionComplete(true);
    };

    const handleMouseOver = (event, eventData) => {
        setSharedState({
            ...sharedState, 
            hoveredEventId: eventData.event_id,
          });
        const { clientX, clientY } = event;
        setTooltipPosition({ x: clientX, y: clientY });
        setTooltipDatum(eventData)
        setShowTooltip(true);
    };
    
    const handleMouseLeave = () => {
        setSharedState({
            ...sharedState, 
            hoveredEventId: null,
          });
        setShowTooltip(false);
        setTooltipDatum(false);
    };

    // const handleClick = () => {

    // }

    const menuApprovedEventMarkup = props.data.sort((a,b) => a.date - b.date).map((d) => (
        <div key={d.event_id} onMouseOver={(event) => handleMouseOver(event, d)} onMouseLeave={handleMouseLeave}>
            <MenuEventCard key={d.event_id} data={d} />
        </div>
        
    ));

    return (
        <div>
            {showTooltip && <TooltipEvent datum={tooltipDatum} position={tooltipPosition} parent={document.getElementById('mainPage')}/>}
            <div className='menu-approved-events-heading'>
                <button className='menu-approved-events-fill-button' onClick={handleMenuCollapse}>Approved Events</button>
            </div>
            
            <div className={`menu-approved-events-content ${!menuOpen ? 'collapsed' : ''} ${isTransitionComplete ? 'transitionComplete' : 'transitioning'}`} onTransitionEnd={handleTransitionEnd}>
                {menuApprovedEventMarkup}
            </div>
        </div>
    );
}

export default ApprovedEvents;