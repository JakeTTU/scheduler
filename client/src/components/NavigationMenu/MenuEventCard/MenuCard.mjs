import React, { useState, useEffect, useContext} from 'react';
import { useFacilityContext, useFacilityColorContext, useNavigationMenuContext } from '../../../context/DataContext.mjs';
import './MenuEventCard.css';

const MenuEventCard = (props) => {

  const { sharedState, setSharedState } = useNavigationMenuContext();

  const { facilityData } = useFacilityContext();
  const { facilityColors } = useFacilityColorContext();

  const style = {
    fontFamily: "Arial, sans-serif",
    border: "1px solid #ccc",
    padding: "5px",
    borderRadius: "5px",
    margin: "0 auto",
    marginTop: "5px",
    marginBottom: "5px",
    marginLeft: "20px",
    marginRight: "20px",
    backgroundColor: facilityColors.find(f=> f.facility == [props.data.facility]).color,
    color:"#fff",
  };

  return (
    <div style={style} className="menu-event-container">
      <span>{props.data.date}</span>
    </div>
  );
}

const MenuContactCard = (props) => {

  const { facilityColors } = useFacilityColorContext();

  const handleClick = (event) => {
    event.preventDefault();
    const subject = '[Facility Scheduling App]';
    const body = '[Email initiated from Scheduling Application]';
    const mailtoLink = `mailto:${props.data.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const style = {
    fontFamily: "Arial, sans-serif",
    border: "1px solid #ccc",
    padding: "5px",
    borderRadius: "5px",
    margin: "0 auto",
    marginTop: "5px",
    marginBottom: "5px",
    marginLeft: "20px",
    marginRight: "20px",
    backgroundColor: facilityColors.map(d=>d.facility).includes(props.data.facility) ? facilityColors.find(f=> f.facility == [props.data.facility]).color : 'white',
    color: facilityColors.map(d=>d.facility).includes(props.data.facility) ? 'white' : 'black',
  };

  return (
    <div style={style} className="menu-event-container" onClick={handleClick}>
      <span>{`${props.data.first_name} ${props.data.last_name}`}</span>
    </div>
  );
}

export { MenuEventCard, MenuContactCard }