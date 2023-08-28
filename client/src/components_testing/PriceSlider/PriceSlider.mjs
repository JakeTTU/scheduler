import React, { useState } from 'react';
import Slider from 'react-slider';
import './PS-style.css';

const PriceSlider = () => {
  const [values, setValues] = useState([0, 100]);
  const [minRange, setMinRange] = useState(20); // Set your desired minimum range

  const handleChange = (newValues) => {
    const [startValue, endValue] = newValues;
    const range = endValue - startValue;

    // Check if the range is less than the minimum range
    if (range < minRange) {
      // Adjust the values to enforce the minimum range
      const adjustedStartValue = endValue - minRange;
      const adjustedEndValue = startValue + minRange;
      setValues([adjustedStartValue, adjustedEndValue]);
    } else {
      setValues(newValues);
    }
  };

  return (
    <div className="price-slider">
      <h2>Price Range</h2>
      <p>Use the slider to select a price range:</p>
      <Slider
        className="slider"
        value={values}
        onChange={handleChange}
        min={0}
        max={100}
      />
      {/* Rest of the code */}
    </div>
  );
};

export default PriceSlider;
