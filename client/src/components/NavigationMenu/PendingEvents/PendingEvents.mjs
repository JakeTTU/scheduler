import React, { useState, useContext } from 'react';
import './PendingEvents.css';
import { MenuEventCard } from '../MenuEventCard/MenuCard.mjs';
import { TooltipEvent } from '../../Tooltip/Tooltip.mjs';
import { useNavigationMenuContext } from '../../../context/DataContext.mjs';

const PendingEvents = (props) => {

    const [menuOpen, setMenuOpen] = useState(false);
    const [isTransitionComplete, setIsTransitionComplete] = useState(true);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipDatum, setTooltipDatum] = useState(false);

    const { sharedState, setSharedState } = useNavigationMenuContext();

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

    const handleClick = (event, d) => {
        event.preventDefault();
        setSharedState({
            ...sharedState, 
            approvalPageOpen: !sharedState.approvalPageOpen,
            selectedEventData: d
        });
    }

    const menuPendingEventMarkup = props.data.map((d) => (
        <div key={d.event_id} onMouseOver={(event) => handleMouseOver(event, d)} onMouseLeave={handleMouseLeave} onClick={(event) => handleClick(event, d)}>
            <MenuEventCard key={d.event_id} data={d} />
        </div>
        
    ));

    return (
        <div>
            {showTooltip && <TooltipEvent datum={tooltipDatum} position={tooltipPosition} parent={document.getElementById('mainPage')}/>}
            <div className='menu-pending-events-heading'>
                <button className='menu-pending-events-fill-button' onClick={handleMenuCollapse}>Pending Events</button>
            </div>
            <div className={`menu-pending-events-content ${!menuOpen ? 'collapsed' : ''} ${isTransitionComplete ? 'transitionComplete' : 'transitioning'}`} onTransitionEnd={handleTransitionEnd}>
                {menuPendingEventMarkup}
            </div>
        </div>
    );
}

export default PendingEvents;