import React from 'react';
import { schemeTableau10 } from "d3-scale-chromatic";
import './EventCard.css';

const Rectangle = ({ width='100px', height, datum }) => {

  const colorScheme = schemeTableau10

  const colorKey = Object.keys(facilities).map( function (f, index) {
    return {facility: f, color: colorScheme[index]}
  })
  
  const style = {
    backgroundColor: colorKey.find(f=> f.facility == [datum.content.facility]).color
  };

  return <div className="event-card" style={style}>{datum.content.form1 === 'false' ? datum.content.time_in : datum.content.form1}</div>;
};

export default Rectangle;