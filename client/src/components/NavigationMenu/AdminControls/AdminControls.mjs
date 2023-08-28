import React, { useState, useEffect, useContext } from 'react';
import './AdminControls.css';
import { useEventContext, useFacilityContext, useFacilityFilterContext, useEventStatusFilterContext, useNavigationMenuContext } from '../../../context/DataContext.mjs';


const AdminControls = () => {

    const [menuOpen, setMenuOpen] = useState(false);
    const [isTransitionComplete, setIsTransitionComplete] = useState(true);
    // const [allSelected, setAllSelected] = useState(true);
    // const [itemsChecked, setItemsChecked] = useState({'approved': true, 'pending': true});

    // const { facilityData } = useFacilityContext();
    // const { setFacilityFilter } = useFacilityFilterContext();
    // // const { eventData, setEventData } = useEventContext();

    const { sharedState, setSharedState } = useNavigationMenuContext();

    const { eventStatusFilter, setEventStatusFilter } = useEventStatusFilterContext();
    // setEventStatusFilter({'approved': true, 'pending': true})

    useEffect(()=>{
        setEventStatusFilter({'approved': true, 'pending': true})
    },[])


    const handleMenuCollapse = (e) => {
        e.preventDefault()
        setMenuOpen(!menuOpen)
        setIsTransitionComplete(false);
    }

    const handleTransitionEnd = () => {
        setIsTransitionComplete(true);
    };

    // const handleCheckboxChange = (event) => {
    //     setAllSelected(event.target.checked);
    // };

    // const handleCheckboxItemChange = (event, d) => {

    //     const obj = { ...itemsChecked }

    //     if (d === "all"){
    //         const obj2 = {};
    //         Object.keys(obj).forEach(key => {
    //             obj2[key] = true;
    //         });
    //         setItemsChecked(obj2);
    //         setFacilityFilter(Object.fromEntries(Object.entries(obj2).filter(([key]) => key !== 'all')));
    //         return
    //     }
    //     if (d === "clear"){
    //         const obj2 = {};
    //         Object.keys(obj).forEach(key => {
    //             obj2[key] = false;
    //         });
    //         setItemsChecked(obj2);
    //         setFacilityFilter(Object.fromEntries(Object.entries(obj2).filter(([key]) => key !== 'all')));
    //         return
    //     }
    //     obj[d] = !obj[d];
    //     const obj2 = { ...obj };
    //     obj2['all'] = Object.entries(obj).filter(([key]) => key !== 'all').every(([, value]) => value === true);
    //     setItemsChecked(obj2);
    //     setFacilityFilter(Object.fromEntries(Object.entries(obj2).filter(([key]) => key !== 'all')));
    // };

    const handleCheckboxItemChange = (event, d) => {
        const obj = { ...eventStatusFilter }
        obj[d] = !obj[d];
        setEventStatusFilter(obj);
    };

    // useEffect(() => {
    //     if (facilityData) {
    //       const updatedItemsChecked = Object.keys(facilityData).reduce(
    //         (prev, d) => ({ ...prev, [d]: true }),
    //         itemsChecked
    //       );
    //       setItemsChecked(updatedItemsChecked);
    //     }
    //   }, [facilityData]);

    // const filterCheckboxesMarkup = facilityData && Object.keys(facilityData).map((d, index) => {
    //     return (
    //         <div key={`mfc-${index}`} className='menu-admin-checkbox-container' onClick={(event) => handleCheckboxItemChange(event, d)}>
    //             <input type="checkbox" id = {`menu-admin-checkbox-${index}`} checked={itemsChecked[d]} onChange={(event) => handleCheckboxItemChange(event, d)}/>
    //             <label className={"menu-admin-checkbox-label"}  htmlFor={`menu-admin-checkbox-${index}`} id={`menu-admin-checkbox-${index}-label`} onClick={(event) => event.stopPropagation()}>{d}</label>
    //         </div> 
    //     )
    // });

    const handleAddUser = (e) => {
        e.preventDefault();
        setSharedState({
            ...sharedState, 
            addUserPageOpen: !sharedState.addUserPageOpen
        });
    }


    return (
        <div>
            <div className='menu-admin-heading'>
                <button className='menu-admin-fill-button' onClick={handleMenuCollapse}>Admin Controls</button>
            </div>
            
            <div className={`menu-admin-content ${!menuOpen ? 'collapsed' : ''} ${isTransitionComplete ? 'transitionComplete' : 'transitioning'}`} onTransitionEnd={handleTransitionEnd}>
                <div className='menu-admin-checkbox-container' > 

                    <div className='menu-admin-checkbox-container-child-header' >
                        <span className={"menu-admin-checkbox-label"} >Event Statuses</span>
                    </div>

                    <div className='menu-admin-checkbox-container-child' onClick={(event) => handleCheckboxItemChange(event, 'approved')}> 
                        <input type="checkbox" id="mac-approved" checked={eventStatusFilter['approved']} onChange={(event) => handleCheckboxItemChange(event, 'approved')}/>
                        <label className={"menu-admin-checkbox-label"}  htmlFor="mac-approved" id="mac-approved-label" onClick={(event) => event.stopPropagation()}>Approved Requests</label>
                    </div>
                    <div className='menu-admin-checkbox-container-child' onClick={(event) => handleCheckboxItemChange(event, 'pending')}> 
                        <input type="checkbox" id="mac-pending" checked={eventStatusFilter['pending']} onChange={(event) => handleCheckboxItemChange(event, 'pending')}/>
                        <label className={"menu-admin-checkbox-label"}  htmlFor="mac-pending" id="mac-pending-label" onClick={(event) => event.stopPropagation()}>Pending Requests</label>
                    </div>
                </div>
                <div className='menu-admin-checkbox-container' > 
                    <button className='menu-admin-fill-button-inner' onClick={handleAddUser}>Add User</button>
                </div>


                {/* <div className='menu-admin-checkbox-container' onClick={(event) => handleCheckboxItemChange(event, 'all')}>  */}
                    {/* <input type="checkbox" id="mfc-all" checked={itemsChecked['all']} onChange={(event) => handleCheckboxItemChange(event, 'all')}/> */}
                    {/* <label className={"menu-admin-checkbox-label"}  htmlFor="mfc-all" id="mfc-all-label" onClick={(event) => event.stopPropagation()}>Select All</label> */}
                {/* </div> */}
                {/* {filterCheckboxesMarkup} */}
                {/* <div className='menu-admin-checkbox-container' onClick={(event) => handleCheckboxItemChange(event, 'clear')}>  */}
                    {/* <input type="checkbox" id="mfc-all" checked={itemsChecked['all']} onChange={(event) => handleCheckboxItemChange(event, 'all')}/> */}
                    {/* <label className={"menu-admin-checkbox-label"}  htmlFor="mfc-clear" id="mfc-clear-label">Clear Selected</label> */}
                {/* </div> */}
            </div>
        </div>
    );
}

export { AdminControls };