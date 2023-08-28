import React, { useCallback, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import "./DoubleSlider2.css";

const DoubleSlider = ({ min, max, minimumDistance, onChange }) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const [rangeClicked, setRangeClicked] = useState(false);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width and position of the range
  const setRangeWidth = useCallback(() => {
    const rangeWidth = getPercent(maxVal) - getPercent(minVal);
    const rangeLeft = getPercent(minVal);
    if (range.current) {
      range.current.style.left = `${rangeLeft}%`;
      range.current.style.width = `${rangeWidth}%`;
    }
  }, [minVal, maxVal, getPercent]);

  // Check if the minimum distance constraint is satisfied
  const isMinimumDistanceSatisfied = useCallback(() => {
    return maxVal - minVal >= minimumDistance;
  }, [minVal, maxVal, minimumDistance]);

  // Update min and max values
  const updateValues = useCallback(() => {
    setMinVal(minValRef.current);
    setMaxVal(maxValRef.current);
  }, []);

  // Handle range drag
  const handleRangeDrag = useCallback(
    (event) => {
      if (rangeClicked) {
        const containerWidth = event.currentTarget.parentNode.offsetWidth;
        const rangeWidth = range.current.offsetWidth;
        const clickOffset =
          event.clientX - event.currentTarget.getBoundingClientRect().left;

        const rangeLeft = Math.max(
          0,
          Math.min(containerWidth - rangeWidth, clickOffset - rangeWidth / 2)
        );

        const rangeRight = rangeLeft + rangeWidth;

        // console.log(rangeLeft, rangeRight);

        const newMinVal = Math.round(
          (rangeLeft / containerWidth) * (max - min) + min
        );

        const newMaxVal = Math.round(
          (rangeRight / containerWidth) * (max - min) + min
        );

        // console.log(newMinVal, newMaxVal);

        // minValRef.current = newMinVal;
        // maxValRef.current = newMaxVal;
        // setMinVal(minValRef.current);
        // setMaxVal(maxValRef.current);

        // updateValues();

        // setRangeWidth();
      }

      //

      //   if (isMinimumDistanceSatisfied()) {
      //     updateValues();
      //   }

      //   setRangeWidth();
      // }
    },
    [min, max, rangeClicked, isMinimumDistanceSatisfied, updateValues]
  );

  // Handle range click
  const handleRangeClick = useCallback(() => {
    setRangeClicked(true);
  }, []);

  // Handle range release
  const handleRangeRelease = useCallback(() => {
    setRangeClicked(false);
  }, []);

  // Update range width when minVal or maxVal changes
  useEffect(() => {
    setRangeWidth();
  }, [minVal, maxVal, setRangeWidth]);

  // Get min and max values when their state changes
  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal, onChange]);

  return (
    <div className="container">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={(event) => {
          const value = Math.min(
            Number(event.target.value),
            maxVal - minimumDistance
          );
          minValRef.current = value;

          if (isMinimumDistanceSatisfied()) {
            updateValues();
          }

          setRangeWidth();
        }}
        className="thumb thumb--left"
        style={{ zIndex: minVal > max - minimumDistance && "5" }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={(event) => {
          const value = Math.max(
            Number(event.target.value),
            minVal + minimumDistance
          );
          maxValRef.current = value;

          if (isMinimumDistanceSatisfied()) {
            updateValues();
          }

          setRangeWidth();
        }}
        className="thumb thumb--right"
      />

      <div
        className={`slider ${rangeClicked ? "clicked" : ""}`}
        onMouseDown={handleRangeClick}
        onMouseMove={handleRangeDrag}
        onMouseUp={handleRangeRelease}
      >
        <div className="slider__track" />
        <div ref={range} className="slider__range" />
        <div className="slider__left-value">{minVal}</div>
        <div className="slider__right-value">{maxVal}</div>
      </div>
    </div>
  );
};

DoubleSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  minimumDistance: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
};

export default DoubleSlider;
