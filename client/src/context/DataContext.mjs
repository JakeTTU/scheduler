import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from "axios";
import moment from "moment-timezone"
import { schemeTableau10 } from "d3-scale-chromatic";
import { SERVERHOST, SERVERPORT } from '../ServerConnection.mjs';

const NavigationMenuContext = createContext();
const DataLoadedContext = createContext();
const EventContext = createContext();
const FacilityContext = createContext();
const FacilityColorContext = createContext();
const EventStatusFilterContext = createContext();
const FacilityEquipmentFilterContext = createContext();


const useNavigationMenuContext = () => {
  return useContext(NavigationMenuContext)
}

const useDataLoadedContext = () => {
  return useContext(DataLoadedContext)
}

const useEventContext = () => {
  return useContext(EventContext)
}

const useEventStatusFilterContext = () => {
  return useContext(EventStatusFilterContext)
}

const useFacilityContext = () => {
  return useContext(FacilityContext)
}
const useFacilityColorContext = () => {
  return useContext(FacilityColorContext)
}
const useFacilityEquipmentFilterContext = () => {
  return useContext(FacilityEquipmentFilterContext)
}

const DataContextProvider = ({ children }) => {

  const [sharedState, setSharedState] = useState({ requestPageOpen:false, approvalPageOpen:false, addUserPageOpen:false, hoveredEventId:null, contacts:null});

  const [dataContextsLoaded, setDataContextsLoaded] = useState(false);
  const [eventData, setEventData] = useState([]);
  const [eventStatusFilter, setEventStatusFilter] = useState({'approved': true, 'pending': false});
  const [facilityData, setFacilityData] = useState({});
  const [facilityEquipmentFilter, setFacilityEquipmentFilter] = useState({});
  const [facilityColors, setFacilityColors] = useState({});

  useEffect(() => {

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const parsedDate = (isoString, timezone) => {return moment.tz(isoString, timezone).toDate();}
  
    const formatEventData = (events) => {
      const newArray = events.map((event) => {
          return { ...event, start_datetime: parsedDate(event.start_datetime, timezone), end_datetime:parsedDate(event.end_datetime, timezone) };
      });
      return newArray
    } 

    try{
        axios.get(`http://${SERVERHOST}:${SERVERPORT}/events/loadEvents`)
        .then(res=>{
            if(res.status===200){
                setEventData(formatEventData(res.data))
            }
        })
        .catch(e=>{
            console.error(e);
        })
    }
    catch(e){
        console.error(e);
    }
  }, [])

  useEffect(() => {
    try{
        axios.get(`http://${SERVERHOST}:${SERVERPORT}/facilities/loadFacilities`)
        .then(res=>{
            if(res.status===200){
                const rawFacilityData = res.data
                const formattedFacilityData = [...new Set(rawFacilityData.map((d) => d.location))].reduce((result, item) => {
                    result[item] = [...new Set(rawFacilityData.filter(d=> d.location === item).map(d=> d.equipment))];
                    return result;
                }, {});
                setFacilityData(formattedFacilityData)
            }
        })
        .catch(e=>{
            console.error(e);
        })
    }
    catch(e){
        console.error(e);
    }
  }, [])

  useEffect(()=>{
    const obj = {};
    for (const [key, values] of Object.entries(facilityData)) {
      obj[key] = {};
        for (const val of values) {
          obj[key][val] = true;
        }
    }
    setFacilityEquipmentFilter(obj);
  },[facilityData])


  useEffect(()=>{
    const colorScheme = schemeTableau10
    setFacilityColors(Object.keys(facilityData).map( function (f, index) {
        return {facility: f, color: colorScheme[index]}
    }))
  }, [facilityData])

  useEffect(() =>{
    try{
      axios.get(`http://${SERVERHOST}:${SERVERPORT}/contacts/loadContacts`)
      .then(res=>{
          if(res.status===200){
              setSharedState({
                ...sharedState, 
                contacts: res.data
              });
          }
      })
      .catch(e=>{
          console.error(e);
      })
    }
    catch(e){
        console.error(e);
    }
  },[])

  useEffect(()=>{
    const isEmptyObj = (obj) => {
      return Object.keys(obj).length === 0;
    };
  
    const isEmptyArr = (Arr) => {
        return Arr.length === 0;
    };

    setDataContextsLoaded(!isEmptyArr(eventData) && !isEmptyObj(facilityData) && !isEmptyObj(facilityColors) && !isEmptyObj(facilityEquipmentFilter))
  }, [facilityData, facilityColors, eventData, facilityEquipmentFilter])

  return (
    <NavigationMenuContext.Provider value={{ sharedState, setSharedState }}>
      <DataLoadedContext.Provider value={ {dataContextsLoaded} }>
        <EventContext.Provider value={{ eventData, setEventData }}>
          <EventStatusFilterContext.Provider value={{ eventStatusFilter, setEventStatusFilter }}>
            <FacilityContext.Provider value={{ facilityData }}>
              <FacilityEquipmentFilterContext.Provider value={{ facilityEquipmentFilter, setFacilityEquipmentFilter }}>
                <FacilityColorContext.Provider value={{ facilityColors }}>
                  {dataContextsLoaded && children}
                </FacilityColorContext.Provider>
              </FacilityEquipmentFilterContext.Provider>
            </FacilityContext.Provider>
          </EventStatusFilterContext.Provider>
        </EventContext.Provider>
      </DataLoadedContext.Provider>
    </NavigationMenuContext.Provider>
  );
};

export { DataContextProvider, useEventContext, useEventStatusFilterContext, useFacilityContext, useFacilityEquipmentFilterContext, useFacilityColorContext, useDataLoadedContext, useNavigationMenuContext };