import React from 'react';
import Modal from 'react-modal';
import axios from "axios"
import "./RequestPage.css"
import { useState } from "react"
import { useLocation } from 'react-router-dom';
import { useEventContext, useFacilityContext } from '../../context/DataContext.mjs';
import { SERVERHOST, SERVERPORT } from '../../ServerConnection.mjs';

const appRoot = document.getElementById('root');
Modal.setAppElement(appRoot);

const RequestPage = ({ requestPageOpen, onClose }) => {

    const { eventData, setEventData } = useEventContext();
    const { facilityData } = useFacilityContext();

    const [facilityInupt, setFacilityInupt] = useState(false);
    const [facilityEquipmentInput, setFacilityEquipmentInput] = useState(false);
    const [timeInDataHours, setTimeInDataHours] = useState("00");
    const [timeInDataMinutes, setTimeInDataMinutes] = useState("00");
    const [timeInDataMinutesChanged, setTimeInDataMinutesChanged] = useState(false);
    const [timeInDataHourChanged, setTimeInDataHourChanged] = useState(false);
    const [timeOutDataHours, setTimeOutDataHours] = useState("00");
    const [timeOutDataMinutes, setTimeOutDataMinutes] = useState("00");
    const [timeOutDataMinutesChanged, setTimeOutDataMinutesChanged] = useState(false);
    const [timeOutDataHourChanged, setTimeOutDataHourChanged] = useState(false);
    const [form1Data, setForm1Data] = useState('none');
    const [form2Data, setForm2Data] = useState(false);
    const [selectedDate1, setSelectedDate1] = useState('');
    const [selectedDate2, setSelectedDate2] = useState('');
    const [multiDayIsChecked, setMultiDayIsChecked] = useState(false);
    const [selectedOption, setSelectedOption] = useState('default');

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
      facility: facilityInupt.toString(),
      equipment: facilityEquipmentInput.toString(),
      form1:form1Data.toString(),
      form2:form2Data.toString(),
      // ISOString defaults to UTC must handle time zones on data read
      start_datetime: dateIn.toISOString(),
      end_datetime: dateOut.toISOString(),
      approval_status: 'pending'
    }

    const eventUIObj = {
      event_id: Date.now(),
      user_id:location.state.user_id.toString(),
      date: dateOnlyString.toString(),
      facility: facilityInupt.toString(),
      equipment: facilityEquipmentInput.toString(),
      form1:form1Data.toString(),
      form2:form2Data.toString(),
      start_datetime: dateIn,
      end_datetime: dateOut,
      approval_status: 'pending'
    }



    setEventData([...eventData, eventUIObj]);
    postEvent(eventDbObj);
      clearAllInputs()
      onClose()
  }

  const clearAllInputs = () => {
    setFacilityInupt(false); setFacilityEquipmentInput(false); setForm1Data(false); setForm2Data(false); 
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
          type="date"
          id="popup-dateInput2"
          min={selectedDate1}
          value={selectedDate2}
          onChange={handleDate2Change}
        />
    </div>
  );

  const facilityEquipmentMarkup = facilityInupt && (
    <div id="popup-facility-equipment-div">
      <label htmlFor="popup-facility" className='popup-label-text' id="popup-facility-equipment-label">Facility Equipment:</label>
        <select className={facilityEquipmentInput === false ? "select-error" : ""} value={selectedOption} id="popup-facility-equipment" onChange={(e) => { setFacilityEquipmentInput(e.target.value); setSelectedOption(e.target.key) }}>
          <option value="default" disabled>Select equipment</option>
          {facilityData[facilityInupt].map((option, index) => (
            <option key={index} value={option}>{option[0].toUpperCase() + option.slice(1)}</option>
          ))}
        </select>
    </div>
  )

  return (
    <Modal
        isOpen={requestPageOpen}
        onRequestClose={onClose}
        contentLabel="requestPage"
        className="requestPage"
    >
      <span id="popup-heading">Reservation Request Form</span>

      <div id="popup-facility-div">
      <label htmlFor="popup-facility" className='popup-label-text' id="popup-facility-label">Facility Location:</label>
        <select className={facilityInupt === false ? "select-error" : ""} defaultValue="" name="facility" id="popup-facility" onChange={(e) => { setFacilityInupt(e.target.value); setFacilityEquipmentInput(false); setSelectedOption('default')}}>
          <option value="" disabled>Select facility</option>
          {Object.keys(facilityData).map((option, index) => (
            <option key={index} value={option}>{option[0].toUpperCase() + option.slice(1)}</option>
          ))}
        </select>
      </div>

      {facilityEquipmentMarkup}

      <label htmlFor="popup-dateInput1" id="popup-dateInput1-label">{multiDayIsChecked? 'Start Date:' : 'Date:'}</label>
      <input
        type="date"
        id="popup-dateInput1"
        value={selectedDate1}
        onChange={handleDate1Change}
      />
      {multiDayIsChecked? dateInput2Markup: null}
      <div id="popup-multiDayCheckbox-div">
        <label htmlFor="multiDayCheckbox" id="popup-multiDayCheckbox-label">Multi-day:</label>
        <input
          type="checkbox"
          id="popup-multiDayCheckbox"
          checked={multiDayIsChecked}
          onChange={handleCheckboxChange}
        />
      </div>
      
      
      <div id='popup-time-in'>
      <span id='popup-time-in-label'>Time-In:</span>
        <select className={timeInDataHourChanged === false ? "select-error" : ""} defaultValue="" id="popup-time-in-hours" onChange={(e) => { setTimeInDataHours(e.target.value); setTimeInDataHourChanged(true) }}>
          {hours.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
        </select>
        <span id='popup-time-out-colon'>:</span>
        <select className={timeInDataMinutesChanged === false ? "select-error" : ""} defaultValue="" id="popup-time-in-minutes" onChange={(e) => { setTimeInDataMinutes(e.target.value); setTimeInDataMinutesChanged(true) }}>
          <option value="" disabled hidden>00</option>
          <option value="00">00</option>
          <option value="15">15</option>
          <option value="30">30</option>
          <option value="45">45</option>
        </select>
      </div>
      <div id='popup-time-out'>
      <span id='popup-time-out-label'>Time-Out:</span>
        <select className={timeOutDataHourChanged === false ? "select-error" : ""} defaultValue="" id="popup-time-out-hours" onChange={(e) => { setTimeOutDataHours(e.target.value); setTimeOutDataHourChanged(true) }}>
          {hours.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
        </select>
        <span id='popup-time-out-colon'>:</span>
        <select className={timeOutDataMinutesChanged === false ? "select-error" : ""} defaultValue="" id="popup-time-out-minutes" onChange={(e) => { setTimeOutDataMinutes(e.target.value); setTimeOutDataMinutesChanged(true) }}>
          <option value="" disabled hidden>00</option>
          <option value="00">00</option>
          <option value="15">15</option>
          <option value="30">30</option>
          <option value="45">45</option>
        </select>
      </div>
      
      <input id="popup-form1" onChange={(e) => { setForm1Data(e.target.value) }} placeholder="Project Name"  />
      <input id="popup-form2" onChange={(e) => { setForm2Data(e.target.value) }} placeholder="form2"  />
      <button id="popup-submit" onClick={submit}>Submit</button>
      <button id='popup-cancel'onClick={handleClose}>Cancel</button>
    </Modal>
  );
};

export default RequestPage;
