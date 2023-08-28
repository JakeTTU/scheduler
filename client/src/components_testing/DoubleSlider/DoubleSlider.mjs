import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

class DoubleSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      minValue: props.minValue,
      maxValue: props.maxValue,
      minDifference: props.minDifference,
      released: true, // Track whether the click is released
    };
  }

  handleSliderChange = ([minValue, maxValue]) => {
    const { minDifference, released } = this.state;
  
    if (maxValue - minValue >= minDifference && minValue <= maxValue) {
      this.setState({ minValue, maxValue });
    } else if (maxValue - minValue < minDifference) {
      // Adjust the min value if the difference is less than the minimum
      this.setState({ released: true });
    } else if (!released) {
      // Ignore the change if released and prevent swapping
      this.setState({ released: true, minValue: this.state.minValue, maxValue: this.state.maxValue });
    }
  };
  

  handleSliderRelease = () => {
    this.setState({ released: true });
  };

  handleSliderMouseDown = () => {
    this.setState({ released: false });
  };

  handleSliderClick = (e) => {
    console.log(e)
        const { classList } = e.target;
        if (classList.contains('rc-slider-track') || classList.contains('rc-slider-track-1')) {
          console.log('Slider track 1 clicked');
        }
      };

  render() {
    const { minValue, maxValue, released } = this.state;

    const sliderStyle = {
      width: '20vw', // Adjust the width here
      margin: '0 auto', // Optional: Center the slider horizontally
    };

    return (
      <div style={sliderStyle}>
        <Slider
          range
          min={this.props.min}
          max={this.props.max}
          value={[minValue, maxValue]}
          onChange={this.handleSliderChange}
          onAfterChange={released ? null : this.handleSliderRelease} // Check if the click is released
          onClick={this.handleSliderClick}
        //   onMouseDown={this.handleSliderMouseDown} // Track mouse down event
        />
        <div>
          <span>Min: {minValue}</span>
          <span>Max: {maxValue}</span>
        </div>
      </div>
    );
  }
}

export default DoubleSlider;
