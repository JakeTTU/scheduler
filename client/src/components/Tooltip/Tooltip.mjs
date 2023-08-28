import React from 'react';
import ReactDOM from 'react-dom';
import './Tooltip.css';
import { useFacilityContext, useFacilityColorContext } from '../../context/DataContext.mjs';

const TooltipEvent = ({ datum, position, parent }) => {

    const { facilityColors } = useFacilityColorContext();

    const tooltipStyle = {
        position: 'absolute',
        top: position.y+10,
        left: position.x+10,
        backgroundColor: facilityColors.map(d=>d.facility).includes(datum.facility) ? facilityColors.find(f=> f.facility === datum.facility).color : 'white',
    };

    return ReactDOM.createPortal(
        <div className="tooltip" style={tooltipStyle}>
            <p>Created by: {datum.user_id}</p>
            <p>Facility: {datum.facility}</p>
            <p>Equipment: {datum.equipment}</p>
            <p>Time In: {datum.start_datetime.toLocaleString(undefined, { hour12: false })}</p>
            <p>Time Out: {datum.end_datetime.toLocaleString(undefined, { hour12: false })}</p>
            <p>Project: {datum.form1}</p>
            <p>Approval Status: {datum.approval_status}</p>
        </div>,
        parent
    );
};

const TooltipContact = ({ datum, position, parent }) => {

    const { facilityData } = useFacilityContext();
    const { facilityColors } = useFacilityColorContext();

    const tooltipStyle = {
        position: 'absolute',
        top: position.y+10,
        left: position.x+10,
        backgroundColor: facilityColors.map(d=>d.facility).includes(datum.facility) ? facilityColors.find(f=> f.facility === datum.facility).color : 'white',
        color: facilityColors.map(d=>d.facility).includes(datum.facility) ? 'white' : 'black',
        border: '1px solid #ccc'
    };

    return ReactDOM.createPortal(
        <div className="tooltip" style={tooltipStyle}>
            <p>Name: {`${datum.first_name} ${datum.last_name}`}</p>
            <p>Organization: {datum.organization}</p>
            <p>Facility: {datum.facility}</p>
            <p>Email: {datum.email}</p>
        </div>,
        parent
    );
};

export {TooltipEvent, TooltipContact};
