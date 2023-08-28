import React,{useEffect} from "react";
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";
import { Handle, Track, Tick } from "./components.mjs"; // example render components - source below
import moment from "moment";

const sliderStyle = {
    position: "relative",
    width: "100%",
    marginTop: 100
  };
  
  const railStyle = {
    position: "absolute",
    width: "100%",
    height: 8,
    borderRadius: 4,
    cursor: "pointer",
    backgroundColor: "#aaaaaa"
  };
  
  function splitArrayIntoChunksOfLen(arr, len) {
    var chunks = [], i = 0, n = arr.length;
    while (i < n) {
      chunks.push(arr.slice(i, i += len));
    }
    return chunks;
  }
  
  const domain = [0, 24];

const TimeRangeSlider = ({onChange}) => {
    const [state,setState] = React.useState({
        arr:[8, 12],tracks:[]
    })

    useEffect(()=>{
        const twoPairs = splitArrayIntoChunksOfLen(state.arr,2)
        let newTime = twoPairs.map((v)=>{
            return {start:moment(`${v[0]}:00`,'hh:mm a').format('hh:mm a'),
            end:moment(`${v[1]}:00`,'hh:mm a').format('hh:mm a')}
        })
        if(onChange)
            onChange(newTime)
    },[state.arr])

   const checkValue = (a,b)=>{
        let f = false
        const twoPairs = splitArrayIntoChunksOfLen(state.arr,2)
        twoPairs.forEach((v,i)=>{
            if(a===v[0] && b===v[1]){
              f = true
            }
        })
        return f
      }

     const  removeSlide =(removeEl)=>{
        console.log("GetTrackProps")
        const val = removeEl.value
        const twoPairs = splitArrayIntoChunksOfLen(state.arr,2)
         console.log("twoPairs",twoPairs)
         let newArr = twoPairs.filter((v)=>!v.includes(val)).flat()
    
         if(newArr.length!==0){
           setState((s)=>({...s,arr:newArr}))
         }
      }

    const addSlide=(addEl)=>{
        const val = addEl.value
        console.log("Add",val)
         let nextLeft =0
         let nextRight =0
        const twoPairs = splitArrayIntoChunksOfLen(state.arr,2)
        console.log("twoPairs",twoPairs)
        twoPairs.forEach((v)=>{
          if(v[0]===val){
            nextRight = val-1 
            nextLeft = val-2
          }else if(v[1]===val){
            nextLeft = val+1
            nextRight = val+2
          }
        })
        let newArr = twoPairs.filter((v)=>(v.includes(nextRight)||v.includes(nextLeft))).flat()
        console.log('nextLeft, nextRight',nextLeft,nextRight)
        console.log('newArr',newArr)
        if(newArr.length===0 && nextLeft > 0 && nextRight > 0 && nextLeft <= 23 && nextRight <= 24){
          let a = [...state.arr,nextLeft,nextRight].sort((a, b) => a - b)
          console.log("a",a)
          setState((s)=>({...s,arr:a}))
        }
       }

       const mystyle= {
        marginLeft: '0%',
        marginRight: '0%',
        height: '20px',
        width:'100%'
       }

  return (
    <div style={mystyle}>
        <Slider
          mode={2}
          step={1}
          domain={domain}
          rootStyle={sliderStyle}
          onUpdate={(e)=>setState((s)=>({...s,arr:e}))}
          onChange={(e)=>setState((s)=>({...s,arr:e}))}
          onSlideEnd={(e)=>console.log('slideEnd',e)}
          values={state.arr}
        >
          <Rail>
            {({ getRailProps }) => (
              <div style={railStyle} {...getRailProps()} />
            )}
          </Rail>
          <Handles>
            {({ handles, getHandleProps }) => (
              <div className="slider-handles">
                {handles.map((handle) => (
                  <Handle
                    addSlide={()=>addSlide(handle)}
                    removeSlide={()=>removeSlide(handle)}
                    key={handle.id}
                    handle={handle}
                    domain={domain}
                    getHandleProps={getHandleProps}
                  />
                ))}
              </div>
            )}
          </Handles>
          <Tracks onChange={(e)=>{console.log("Tracks")}} left={false} right={false}>
            {({ tracks, getTrackProps }) => {
              console.log("tracks",tracks)
              return (
              <div className="">
                {tracks.map(({ id, source, target },i) => {
                  console.log("index",i)
                  return (
                    checkValue(source.value,target.value)?<Track
                    key={id}
                    source={source}
                    target={target}
                    getTrackProps={getTrackProps}
                  />:null
                )
                })}
              </div>
            )
            }}
          </Tracks>
          <Ticks count={10}>
            {({ ticks }) => (
              <div className="slider-ticks">
                {ticks.map((tick) => (
                  <Tick key={tick.id} tick={tick} count={ticks.length} />
                ))}
              </div>
            )}
          </Ticks>
        </Slider>
    </div>
  )
}

export default TimeRangeSlider