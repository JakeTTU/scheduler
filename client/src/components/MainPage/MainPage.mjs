import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEventContext, useFacilityColorContext, useDataLoadedContext, useEventStatusFilterContext, useFacilityEquipmentFilterContext, useNavigationMenuContext } from "../../context/DataContext.mjs";
import NavigationMenu from '../NavigationMenu/NavigationMenu.mjs';
import Calendar from '../Calendar/Calendar.mjs';
import './MainPage.css';

const MainPage = () => {

    const { eventData, setEventData } = useEventContext();
    const { facilityColors } = useFacilityColorContext();
    const { dataContextsLoaded } = useDataLoadedContext();
    const { facilityEquipmentFilter } = useFacilityEquipmentFilterContext();
    const { eventStatusFilter } = useEventStatusFilterContext();

    const history = useNavigate()

    const location = useLocation()
    if (!location.state || (location.state && !location.state.auth)){
      history("/")
    }

    const [displayedEvents, setDisplayedEvents] = useState([])
    const [pendingEvents, setPendingEvents] = useState([])
    const [approvedEvents, setApprovedEvents] = useState([])
    const [contactInfo, setcontactInfo] = useState([])

    // useEffect(() => {
    //   setPendingEvents(eventData.filter(d=> facilityFilter[d.facility] && d.approval_status === 'pending').sort((a,b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0)));
    //   setApprovedEvents(eventData.filter(d=> facilityFilter[d.facility] && d.approval_status === 'approved').sort((a,b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0)));
    // }, [ facilityFilter, eventStatusFilter, eventData ]);

    useEffect(() => {
      setPendingEvents(eventData.filter(d=> facilityEquipmentFilter[d.facility][d.equipment] && d.approval_status === 'pending').sort((a,b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0)));
      setApprovedEvents(eventData.filter(d=> facilityEquipmentFilter[d.facility][d.equipment] && d.approval_status === 'approved').sort((a,b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0)));
    }, [ facilityEquipmentFilter, eventStatusFilter, eventData ]);

    // useEffect(()=>{
    //   setDisplayedEvents(eventData.filter((d) => facilityFilter[d.facility] && (eventStatusFilter[d.approval_status] || (location.state.user_id === d.user_id && (!['admin', 'dev'].includes(location.state.auth))))))
    // }, [ facilityFilter, eventStatusFilter, eventData ])

    useEffect(()=>{
      setDisplayedEvents(eventData.filter((d) => facilityEquipmentFilter[d.facility][d.equipment] && (eventStatusFilter[d.approval_status] || (location.state.user_id === d.user_id && (!['admin', 'dev'].includes(location.state.auth))))))
    }, [ facilityEquipmentFilter, eventStatusFilter, eventData ])

    const navigationMenuProps = {pendingEvents: pendingEvents, approvedEvents: approvedEvents, contactInfo: contactInfo};

    return(
      <div id='mainPage'>
        <div className='navigationMenuContainer'>
          {dataContextsLoaded &&
            <NavigationMenu data={navigationMenuProps} />
          }
        </div>
        <div>
          {dataContextsLoaded && 
          <Calendar events={displayedEvents} colors={facilityColors}/>
          }
        </div>
      </div>
    );
}

export default MainPage;
