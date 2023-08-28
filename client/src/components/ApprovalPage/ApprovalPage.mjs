import React from 'react';
import Modal from 'react-modal';
import axios from "axios"
import "./ApprovalPage.css"
import { useState, useContext} from "react"
import { useLocation } from 'react-router-dom';
import { useFacilityContext, useEventContext, useNavigationMenuContext } from '../../context/DataContext.mjs';
import { SERVERHOST, SERVERPORT } from '../../ServerConnection.mjs';

import moment from "moment-timezone"

const appRoot = document.getElementById('root');
Modal.setAppElement(appRoot);

const ApprovalPage = ({ approvalPageOpen, onClose, datum }) => {

  // const { eventData, setEventData } = useContext(EventContext);
  const { eventData, setEventData } = useEventContext();

  const { sharedState, setSharedState } = useNavigationMenuContext();
  const { facilityData } = useFacilityContext()
  // const facilities = sharedState.facilities

  const timezone = "America/Indianapolis"
  const parsedDate = (isoString, timezone) => moment.tz(isoString, timezone).toDate();

  const same = (parsedDate(datum.start_datetime, timezone).toLocaleDateString() === parsedDate(datum.end_datetime, timezone).toLocaleDateString())

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
  
    return `${year}-${month}-${day}`;
  }

  function formatHour(date){
    return String(date.getHours()).padStart(2, "0")
  }
  function formatMinute(date){
    return String(date.getMinutes()).padStart(2, "0")
  }

  // console.log(formatHour(parsedDate(datum.start_datetime, timezone)))

    const [eventFacility, seteventFacility] = useState(datum.facility);
    const [facilitySelectedOption, setFacilitySelectedOption] = useState(datum.facility)
    const [facilityEquipmentData, setFacilityEquipmentData] = useState(datum.equipment);
    const [equipmentSelectedOption, setEquipmentSelectedOption] = useState(datum.equipment);
    const [timeInDataHours, setTimeInDataHours] = useState(formatHour(parsedDate(datum.start_datetime, timezone)));
    const [timeInDataHoursOption, setTimeInDataHoursOption] = useState(formatHour(parsedDate(datum.start_datetime, timezone)));
    const [timeInDataMinutes, setTimeInDataMinutes] = useState(formatMinute(parsedDate(datum.start_datetime, timezone)));
    const [timeInDataMinutesOption, setTimeInDataMinutesOption] = useState(formatMinute(parsedDate(datum.start_datetime, timezone)));
    const [timeInDataMinutesChanged, setTimeInDataMinutesChanged] = useState(false);
    const [timeInDataHourChanged, setTimeInDataHourChanged] = useState(false);
    const [timeOutDataHours, setTimeOutDataHours] = useState(formatHour(parsedDate(datum.end_datetime, timezone)));
    const [timeOutDataHoursOption, setTimeOutDataHoursOption] = useState(formatHour(parsedDate(datum.end_datetime, timezone)));
    const [timeOutDataMinutes, setTimeOutDataMinutes] = useState(formatMinute(parsedDate(datum.end_datetime, timezone)));
    const [timeOutDataMinutesOption, setTimeOutDataMinutesOption] = useState(formatMinute(parsedDate(datum.end_datetime, timezone)));
    const [timeOutDataMinutesChanged, setTimeOutDataMinutesChanged] = useState(false);
    const [timeOutDataHourChanged, setTimeOutDataHourChanged] = useState(false);
    const [form1Data, setForm1Data] = useState(String(datum.form1));
    const [form2Data, setForm2Data] = useState(String(datum.form2));
    const [selectedDate1, setSelectedDate1] = useState(formatDate(parsedDate(datum.start_datetime, timezone)));
    const [selectedDate2, setSelectedDate2] = useState(formatDate(parsedDate(datum.end_datetime, timezone)));
    const [multiDayIsChecked, setMultiDayIsChecked] = useState(!same);  
    const [editingDisabled, setEditingDisabled] = useState(true);  

    const location = useLocation()

    async function postEvent(eventDbObj){
      try{
        await axios.post(`http://${SERVERHOST}:${SERVERPORT}/events/createEvent`,{eventDbObj})
        .then(res=>{
          console.log(res)
          if(res.status===201){
              // emailEvent(eventDbObj)
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

    // async function emailEvent(eventDbObj){
    //   try{
    //     await axios.post(`http://${SERVERHOST}:${SERVERPORT}/events/emailEvent`,{eventDbObj})
    //     .then(res=>{
    //         if(res.status===200){
    //             // console.log('email sent')
    //         }
    //         else{
    //           console.error(res)
    //       }
    //     })
    //     .catch(e=>{
    //         console.error(e);
    //     })
    //   }
    //   catch(e){
    //       console.error(e);
    //   }
    // }

  async function postApproval(obj){
    console.log(obj)
    try{
      const result = await axios.post(`http://${SERVERHOST}:${SERVERPORT}/events/approveEvent`,{obj})
      if (result.status==201){
        return true
      }
      else {return false}
    }
    catch(e){
        console.error(e);
        return false
    }
  }

  const updateEventData = (id) => {
    setEventData((prevData) =>
      prevData.map((item) =>
        item.event_id === id
          ? { ...item, approval_status: "approved" } 
          : item
      )
    );
  }

  async function edit(e){
    e.preventDefault();
    setEditingDisabled(!editingDisabled)
  }

  async function approve(e){
    e.preventDefault();
    const obj = {approval_status:"approved", event_id: datum.event_id};
    const success = await postApproval(obj)
    if (success){
      updateEventData(obj.event_id)
      onClose()
    }
  }

  async function submit(e){
    
    e.preventDefault();

    const dateIn = new Date(selectedDate1)
    dateIn.setDate(dateIn.getDate() + 1)
    dateIn.setHours(timeInDataHours)
    dateIn.setMinutes(timeInDataMinutes)
    console.log(dateIn)

    const dateOut = multiDayIsChecked ? new Date(selectedDate2) : new Date(selectedDate1)
    dateOut.setDate(dateOut.getDate() + 1)
    dateOut.setHours(timeOutDataHours)
    dateOut.setMinutes(timeOutDataMinutes)
    console.log(dateOut)

    if (dateOut < dateIn){
      alert('Time-In must be after Time-Out')
    }

    const dateString = dateIn.toISOString();
    const dateOnlyString = dateString.substring(0, dateString.indexOf('T'));

    const eventDbObj = {
      event_id: Date.now(),
      user_id:location.state.user_id.toString(),
      date: dateOnlyString.toString(),
      facility: eventFacility.toString(),
      equipment: facilityEquipmentData.toString(),
      form1:form1Data.toString(),
      form2:form2Data.toString(),
      // ISOString defaults to UTC must handle time zones on data read
      start_datetime: dateIn.toISOString(),
      end_datetime: dateOut.toISOString(),
      approval_status: 'pending'
    }

    console.log(eventDbObj)

    postEvent(eventDbObj)
    clearAllInputs()
    onClose()
  }

  const clearAllInputs = () => {
    seteventFacility(false); setFacilityEquipmentData(false); setForm1Data(false); setForm2Data(false); 
    setTimeInDataHours("00");  setTimeInDataMinutes("00"); setTimeInDataHourChanged(false); setTimeInDataMinutesChanged(false);
    setTimeOutDataHours("00");  setTimeOutDataMinutes("00"); setTimeOutDataHourChanged(false); setTimeOutDataMinutesChanged(false);
    setSelectedDate1(''); setSelectedDate2(''); setMultiDayIsChecked(false)
  }

  const handleClose = (event) => {
    event.preventDefault();
    clearAllInputs()
    onClose()
  };

  const handleDate1Change = (event) => {
    setSelectedDate1(event.target.value);
  };
  const handleDate2Change = (event) => {
    setSelectedDate2(event.target.value);
  };
  const handleCheckboxChange = (event) => {
    setMultiDayIsChecked(event.target.checked);
  };

  var hours = [];
  for (var i = 0; i <= 23; i++) {
    hours.push(i.toString().padStart(2, '0'));
  }

  const dateInput2Markup = (
    <div>
      <label htmlFor="dateInput2" id="popup-dateInput2-label">End Date:</label>
        <input
          disabled={editingDisabled}
          type="date"
          id="popup-dateInput2"
          min={selectedDate1}
          value={selectedDate2}
          onChange={handleDate2Change}
        />
    </div>
  );

  const facilityEquipmentMarkup = eventFacility && (
    <div id="popup-facility-equipment-div">
      <label htmlFor="popup-facility" className='popup-label-text' id="popup-facility-equipment-label">Facility Equipment:</label>
        <select disabled={editingDisabled} className={facilityEquipmentData === false ? "select-error" : ""} value={equipmentSelectedOption} id="popup-facility-equipment" onChange={(e) => { setFacilityEquipmentData(e.target.value); setEquipmentSelectedOption(e.target.key) }}>
          <option value="default" disabled>Select equipment</option>
          {facilityData[eventFacility].map((option, index) => (
            <option key={index} value={option}>{option[0].toUpperCase() + option.slice(1)}</option>
          ))}
        </select>
    </div>
  )

  return (
    <Modal
        isOpen={approvalPageOpen}
        onApprovalClose={onClose}
        contentLabel="approvalPage"
        className="approvalPage"
    >
      <span id="popup-heading">APPROVAL</span>

      <div id="popup-facility-div">
      <label htmlFor="popup-facility" className='popup-label-text' id="popup-facility-label">Facility Location:</label>
        
        <select disabled={editingDisabled} className={eventFacility === false ? "select-error" : ""} value={facilitySelectedOption} name="facility" id="popup-facility" onChange={(e) => { seteventFacility(e.target.value); setFacilitySelectedOption(e.target.key); setFacilityEquipmentData(false); setEquipmentSelectedOption('default')}}>
          <option value="default" disabled>Select facility</option>
          {Object.keys(facilityData).map((option, index) => (
            <option key={index} value={option}>{option[0].toUpperCase() + option.slice(1)}</option>
          ))}
        </select>
      </div>

      {facilityEquipmentMarkup}

      <label htmlFor="popup-dateInput1" id="popup-dateInput1-label">{multiDayIsChecked? 'Start Date:' : 'Date:'}</label>
      <input
        disabled={editingDisabled}
        type="date"
        id="popup-dateInput1"
        value={selectedDate1}
        onChange={handleDate1Change}
      />
      {multiDayIsChecked? dateInput2Markup: null}
      <div id="popup-multiDayCheckbox-div">
        <label htmlFor="multiDayCheckbox" id="popup-multiDayCheckbox-label">Multi-day:</label>
        <input
          disabled={editingDisabled}
          type="checkbox"
          id="popup-multiDayCheckbox"
          checked={multiDayIsChecked}
          onChange={handleCheckboxChange}
        />
      </div>
      
      
      <div id='popup-time-in'>
      <span id='popup-time-in-label'>Time-In:</span>
        <select disabled={editingDisabled} value={timeInDataHoursOption} id="popup-time-in-hours" onChange={(e) => { setTimeInDataHours(e.target.value); setTimeInDataHourChanged(true); setTimeInDataHoursOption(e.target.key)}}>
          {hours.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
        </select>
        <span id='popup-time-out-colon'>:</span>
        <select disabled={editingDisabled} value={timeInDataMinutesOption} id="popup-time-in-minutes" onChange={(e) => { setTimeInDataMinutes(e.target.value); setTimeInDataMinutesChanged(true); setTimeInDataMinutesOption(e.target.key) }}>
          {/* <option value="" disabled hidden>00</option> */}
          <option value="00">00</option>
          <option value="15">15</option>
          <option value="30">30</option>
          <option value="45">45</option>
        </select>
      </div>
      <div id='popup-time-out'>
      <span id='popup-time-out-label'>Time-Out:</span>
        <select disabled={editingDisabled} value={timeOutDataHoursOption} id="popup-time-out-hours" onChange={(e) => { setTimeOutDataHours(e.target.value); setTimeOutDataHourChanged(true); setTimeOutDataHoursOption(e.target.key)}}>
          {hours.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
        </select>
        <span id='popup-time-out-colon'>:</span>
        <select disabled={editingDisabled} value={timeOutDataMinutesOption} id="popup-time-out-minutes" onChange={(e) => { setTimeOutDataMinutes(e.target.value); setTimeOutDataMinutesChanged(true); setTimeOutDataMinutesOption(e.target.key) }}>
          {/* <option value="" disabled hidden>00</option> */}
          <option value="00">00</option>
          <option value="15">15</option>
          <option value="30">30</option>
          <option value="45">45</option>
        </select>
      </div>
      
      <input disabled={editingDisabled} id="popup-form1" onChange={(e) => { setForm1Data(e.target.value) }} value={form1Data}  />
      <input disabled={editingDisabled} id="popup-form2" onChange={(e) => { setForm2Data(e.target.value) }} value={form2Data} />
      {/* <button id="popup-submit" onClick={submit}>Submit</button> */}
      <button id="popup-submit" onClick={approve}>Approve</button>
      <button id="popup-submit" onClick={edit}>Edit</button>
      <button id='popup-cancel'onClick={handleClose}>Cancel</button>
    </Modal>
  );
};

export default ApprovalPage;
