import React, { useState, useEffect } from 'react';
import './FilteringButton.css';
import { useEventContext, useFacilityContext, useFacilityFilterContext, useFacilityEquipmentFilterContext } from '../../../context/DataContext.mjs';

const FilteringButton = () => {

    const [menuOpen, setMenuOpen] = useState(false);
    const [isTransitionComplete, setIsTransitionComplete] = useState(true);
    // const [allSelected, setAllSelected] = useState(true);
    const [itemsChecked, setItemsChecked] = useState({'all':true});

    const { facilityData } = useFacilityContext();
    // const { setFacilityFilter } = useFacilityFilterContext();
    const { facilityEquipmentFilter, setFacilityEquipmentFilter } = useFacilityEquipmentFilterContext();
    // const { eventData, setEventData } = useEventContext();

    const [equipmentDropdownOpen, setEquipmentDropdownOpen] = useState(Object.fromEntries(Object.keys(facilityData).map(key => [key, false])));
    const [childHover, setChildHover] = useState(false)
    const [equipmentChecked, setEquipmentChecked] = useState({})

    // useEffect(()=>{

    //     const modifiedObject = {};

    //     for (const [key, values] of Object.entries(facilityData)) {
    //         modifiedObject[key] = {};
    //         for (const val of values) {
    //             modifiedObject[key][val] = true;
    //         }
    //     }

    //     setEquipmentChecked(modifiedObject);

    // },[facilityData])

    const handleMenuCollapse = (e) => {
        e.preventDefault()
        setMenuOpen(!menuOpen)
        setIsTransitionComplete(false);
    }

    const handleChildOver = () => {
        setChildHover(true)
    }

    const handleChildLeave = () => {
        setChildHover(false)
    }

    const handleChildDropdownClick = (e, d) => {
        e.preventDefault()
        const obj = {... equipmentDropdownOpen}
        obj[d] = !obj[d]
        setEquipmentDropdownOpen(obj)
    }

    const handleTransitionEnd = () => {
        setIsTransitionComplete(true);
    };

    // const handleCheckboxChange = (event) => {
    //     setAllSelected(event.target.checked);
    // };

    const handleCheckboxEquChange = (event, d, e) => {

        const obj = { ...facilityEquipmentFilter }
        obj[d][e] = !obj[d][e];

        if (Object.keys(obj[d]).map(e=> obj[d][e]).includes(true)){
            const objFacility = { ...itemsChecked };
            objFacility[d] = true;
            setItemsChecked(objFacility)
            // setFacilityFilter(Object.fromEntries(Object.entries(objFacility).filter(([key]) => key !== 'all')));
        }
        else{
            const objFacility = { ...itemsChecked };
            objFacility[d] = false;
            setItemsChecked(objFacility)
            // setFacilityFilter(Object.fromEntries(Object.entries(objFacility).filter(([key]) => key !== 'all')));

        }
        setFacilityEquipmentFilter(obj)
    };

    const handleCheckboxItemChange = (event, d) => {

        if (childHover){return}

        const obj = { ...itemsChecked }

        if (d === "all"){
            const obj2 = {};
            Object.keys(obj).forEach(key => {
                obj2[key] = true;
            });
            setItemsChecked(obj2);
            // setFacilityFilter(Object.fromEntries(Object.entries(obj2).filter(([key]) => key !== 'all')));
            const equObj = { ...facilityEquipmentFilter }
            Object.keys(equObj).forEach(key =>{
                Object.keys(equObj[key]).forEach((key2)=>{
                    equObj[key][key2] = true
                })
            } )
            setFacilityEquipmentFilter(equObj)
            return
        }

        if (d === "clear"){
            const obj2 = {};
            Object.keys(obj).forEach(key => {
                obj2[key] = false;
            });
            setItemsChecked(obj2);
            // setFacilityFilter(Object.fromEntries(Object.entries(obj2).filter(([key]) => key !== 'all')));
            const equObj = { ...facilityEquipmentFilter }
            Object.keys(equObj).forEach(key =>{
                Object.keys(equObj[key]).forEach((key2)=>{
                    equObj[key][key2] = false
                })
            } )
            setFacilityEquipmentFilter(equObj)
            
            return
        }
        

        obj[d] = !obj[d];
        const obj2 = { ...obj };
        obj2['all'] = Object.entries(obj).filter(([key]) => key !== 'all').every(([, value]) => value === true);
        setItemsChecked(obj2);
        // setFacilityFilter(Object.fromEntries(Object.entries(obj2).filter(([key]) => key !== 'all')));

        const equObj = { ...facilityEquipmentFilter }
        Object.keys(equObj[d]).map(e=> {equObj[d][e] = obj[d]})
        setFacilityEquipmentFilter(equObj)


    };




    useEffect(() => {
        if (facilityData) {
          const updatedItemsChecked = Object.keys(facilityData).reduce(
            (prev, d) => ({ ...prev, [d]: true }),
            itemsChecked
          );
          setItemsChecked(updatedItemsChecked);
        }
      }, [facilityData]);

      const isEmptyObj = (obj) => {
        return Object.keys(obj).length === 0;
      };

    const filterCheckboxesMarkup = facilityData && Object.keys(facilityData).map((d, index) => {
        return (
            <>
            <div key={`mfc-${index}`} className='menu-filtering-checkbox-container' onClick={(event) => handleCheckboxItemChange(event, d)}>
                <input type="checkbox" id = {`menu-filtering-checkbox-${index}`} checked={itemsChecked[d]} onChange={(event) => handleCheckboxItemChange(event, d)}/>
                <label className={"menu-filtering-checkbox-label"}  htmlFor={`menu-filtering-checkbox-${index}`} id={`menu-filtering-checkbox-${index}-label`} onClick={(event) => event.stopPropagation()}>{d}</label>
                <div className='facility-drop-button' onMouseOver={handleChildOver} onMouseLeave={handleChildLeave} onClick={(event) => handleChildDropdownClick(event, d)}>
                    <span>{equipmentDropdownOpen[d] ? '\u2227' : '\u2228'}</span>
                </div>
            </div>
            <div className={`equipment-dropdown ${!equipmentDropdownOpen[d] ? 'collapsed' : ''}`}> 
                {facilityData[d].map((e, index_e) => {
                    return(
                        <div id={`${d}-dropdown`} className={`equipment-dropdown-item ${!equipmentDropdownOpen[d] ? 'hide' : ''}`} >
                            <input type="checkbox" id = {`menu-filtering-checkbox-${d}-${index_e}`} checked={facilityEquipmentFilter[d][e]} onChange={(event) => handleCheckboxEquChange(event, d, e)}/>
                            {/* <input type="checkbox" id = {`menu-filtering-checkbox-${d}-${index_e}`} checked={true}/> */}

                            <label className={"menu-filtering-checkbox-label-equipment"}  htmlFor={`menu-filtering-checkbox-${d}-${index_e}`}>{e}</label>
                        </div>
                    )
                })}
            </div>
            </>
        )
    });

    return (
        <div>
            <div className='menu-filtering-heading'>
                <button className='menu-filtering-fill-button' onClick={handleMenuCollapse}>Filter Tool</button>
            </div>
            
            <div className={`menu-filtering-content ${!menuOpen ? 'collapsed' : ''} ${isTransitionComplete ? 'transitionComplete' : 'transitioning'}`} onTransitionEnd={handleTransitionEnd}>
                <div className='menu-filtering-checkbox-container' onClick={(event) => handleCheckboxItemChange(event, 'all')}> 
                    <input type="checkbox" id="mfc-all" checked={itemsChecked['all']} onChange={(event) => handleCheckboxItemChange(event, 'all')}/>
                    <label className={"menu-filtering-checkbox-label"}  htmlFor="mfc-all" id="mfc-all-label" onClick={(event) => event.stopPropagation()}>Select All</label>
                </div>
                {filterCheckboxesMarkup}
                <div className='menu-filtering-checkbox-container' onClick={(event) => handleCheckboxItemChange(event, 'clear')}> 
                    <label className={"menu-filtering-checkbox-label"}  htmlFor="mfc-clear" id="mfc-clear-label">Clear Selected</label>
                </div>
            </div>
        </div>
    );
}

export { FilteringButton };