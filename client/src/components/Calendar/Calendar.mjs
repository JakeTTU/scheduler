import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, subMonths, addMonths } from 'date-fns';
import './Calendar.css';
import { TooltipEvent } from '../../components/Tooltip/Tooltip.mjs';
import { useNavigationMenuContext } from '../../context/DataContext.mjs';


const Calendar = (props) => {

  const [currentDate, setCurrentDate] = useState(new Date());
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipDatum, setTooltipDatum] = useState(false);

  const { sharedState, setSharedState } = useNavigationMenuContext();

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const startDate = startOfWeek(startOfMonth(currentDate));
  const endDate = endOfMonth(currentDate);

  const days = [];
  let day = startDate;

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayLabelsMarkup = dayLabels.map((label) => (
    <div key={label} className="day-label">
      {label}
    </div>
  ));

  const events = props.events;
  const eventsInMonth = events && events.filter((event) => {
    return event.end_datetime >= startDate && event.start_datetime <= endDate;
  });

  const handleHover = (event, event_id) => {
    setSharedState({
      ...sharedState, 
      hoveredEventId: event_id,
    });
    const { clientX, clientY } = event;
    setTooltipPosition({ x: clientX, y: clientY });
    setTooltipDatum(props.events.find(d=> d.event_id === event_id))
    setShowTooltip(true);
  }

  const handleHoverEnd = () => {
    setSharedState({
      ...sharedState, 
      hoveredEventId: null,
    });
    setShowTooltip(false);
    setTooltipDatum(false);
  }

  while (day <= endDate) {

    let maxEvents = 0

    for (let t = startOfWeek(day); t < endOfWeek(day); t = addDays(t, 1)){

      const eventsInDay = eventsInMonth.filter((event) => {
        return event.start_datetime <= addDays(t, 1) && event.end_datetime > addDays(t, 0);
      });

      if (eventsInDay.length > maxEvents){
        maxEvents = eventsInDay.length
      }
    }
  
    let daySlots = maxEvents > 0 && Array.from({ length: 7 }, () => Array.from({ length: maxEvents }, () => false));
    let daySlotsTaken = maxEvents > 0 && Array.from({ length: 7 }, () => Array.from({ length: maxEvents }, () => false));

    for (let i = 0; i < 7; i++) {

      const formattedDate = format(day, 'yyyy-MM-dd');

      const eventForDay = eventsInMonth && eventsInMonth.filter((event) => {
        return event.start_datetime <= addDays(day,  1) && event.end_datetime > addDays(day,  0);
      });

      const eventForPrevDay = eventsInMonth && eventsInMonth.filter((event) => {
        return event.start_datetime <= addDays(day, 0) && event.end_datetime > addDays(day, 0);
      }).map(d=> d.event_id);

      const eventsSpanningPrevDay = eventsInMonth && eventsInMonth.filter((event) => {
        return eventForPrevDay.includes(event.event_id)
      })

      if (i !== 0) {
        eventsSpanningPrevDay.forEach(d=> {
          for (let j = 0 ; j < daySlots[i].length; j++){
            if (daySlotsTaken[i-1][j] === d.event_id){
              daySlots[i][j] = (
                <div 
                  key={`${day}-${d.event_id}`} 
                  slot={j} 
                  className={`event-card3 ${sharedState.hoveredEventId ===  d.event_id? 'hover-effect' : ''} ${d.approval_status ===  "pending"? 'pending-event' : ''}`}
                  onMouseOver={(event) => handleHover(event, d.event_id)}
                  onMouseLeave={handleHoverEnd}
                  style={{backgroundColor: props.colors.find( (e)=> e.facility === d.facility).color, color: props.colors.find( (e)=> e.facility === d.facility).color, maxHeight: `${ 85 / (daySlots[i] && daySlots[i].length)}%` }}>
                  <span style={{opacity:'0'}}> - </span>
                </div>)
              daySlotsTaken[i][j] = d.event_id;
              break
            }
          }
        })
      }

      const eventsNotSpanningPrevDay = eventForDay && eventForDay.filter((event) => {
        if (i !== 0){
          return !eventForPrevDay.includes(event.event_id)
        }
        else return event
        
      })

      eventsNotSpanningPrevDay.forEach(d=> {
        for (let j = 0 ; j < daySlots[i].length; j++){
          if (!daySlotsTaken[i][j]){
            daySlots[i][j] = (
              <div 
                key={`${day}-${d.event_id}`} 
                slot={j} 
                className={`event-card3 ${sharedState.hoveredEventId ===  d.event_id? 'hover-effect' : ''} ${d.approval_status ===  "pending"? 'pending-event' : ''}`}
                onMouseOver={(event) => handleHover(event, d.event_id)}
                onMouseLeave={handleHoverEnd}
                style={{borderLeft: '0.5px solid black', backgroundColor: props.colors.find( (e)=> e.facility === d.facility).color, color: props.colors.find( (e)=> e.facility === d.facility).color, maxHeight: `${ 85 / (daySlots[i] && daySlots[i].length)}%`}}>
                <span style={{opacity:'0'}}> - </span>
              </div>)
            daySlotsTaken[i][j] = d.event_id;
            break
          }
        }
      })

      const renderSlots = daySlots[i] && daySlots[i].map((element, index) => element ? element : (
        <div key={`${day}-blank-${index}`} slot={i} className="event-card3" style={{backgroundColor: 'white', opacity:'0', maxHeight: `${ 85 / (daySlots[i] && daySlots[i].length)}%`}}>
          <span> - </span>
        </div>
      ))

      days.push(
        <div
          key={day}
          className={`day${isSameMonth(day, currentDate) ? '' : ' disabled'}`}
          data-date={formattedDate}
        >
          <div className='day-outer'>
            <div className='day-inner'>
              <div className="day-number">{format(day, 'd')}</div>
              {/* {cardsMarkup} */}
              {renderSlots}
            </div>
          </div>
        </div>
      );
      day = addDays(day, 1);
    }

  }

  return (
    <div className="calendar" id="calendar-root">
      <div className="header">
        <div className="button-container">
          <button onClick={handlePreviousMonth} className="button prevMonth">
            &lt;
          </button>
          <h2>{format(currentDate, 'MMMM yyyy')}</h2>
          <button onClick={handleNextMonth} className="button nextMonth">
            &gt;
          </button>
        </div>
      </div>
      <div className="day-labels">{dayLabelsMarkup}</div>
      <div className="days">{days}</div>
      {showTooltip && <TooltipEvent datum={tooltipDatum} position={tooltipPosition} parent={document.getElementById('mainPage')}/>}
    </div>
  );
};

export default Calendar;
