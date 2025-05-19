import React, { useState } from 'react';
import Dropdown from '../components/Dropdown';
import Toggle from '../components/Toggle';


import data from '../seeds/Dashboard.json';

interface DashboardData {
    [key: string]: {
        dateOptions: {
            [key: string]: {
                detailed: string;
                simplified: string;
            };
        };
    };
}

const typedData: DashboardData = data;




export default function Dashboard() {

    const [showDropdowns, setShowDropdowns] = useState<{ [key: string]: boolean }>({
        'provider1': false,
        'provider2': false,
        'date1': false,
        'date2': false,
        'toggle 1': false,
        'toggle2': true

    });

    const [provValues, setProvValues] = useState<{ [key: string]: string }>({
        'provider1': Object.keys(data)[0],
        'provider2': Object.keys(data)[1]
    });

    const [dateValues, setDateValues] = useState({

        'date1': Object.keys(typedData[provValues.provider1].dateOptions)[0],
        'date2': Object.keys(typedData[provValues.provider2].dateOptions)[0]
    })

    const [dateSets, setDateSets] = useState<{ [key: string]: string[] }>({
        'provider1': Object.keys(typedData[provValues.provider1].dateOptions),
        'provider2': Object.keys(typedData[provValues.provider2].dateOptions)
    })

    function renderContent1() {
        const toggle = showDropdowns.toggle1 ? "simplified" : "detailed";
        return typedData[provValues.provider1].dateOptions[dateValues.date1][toggle];
    }
    function renderContent2() {
        const toggle = showDropdowns.toggle2 ? "simplified" : "detailed";
        return typedData[provValues.provider2].dateOptions[dateValues.date2][toggle];
    }
    function updateProv(val: string, name: string) {
        setProvValues({ ...provValues, [name]: val })
        setDateSets({ ...dateSets, [name]: Object.keys(typedData[val].dateOptions) })
        setDateValues({...dateValues, ["date"+name.charAt(name.length-1)]:Object.keys(typedData[val].dateOptions)[0]})
        console.log({ dateSets, ...provValues });
    }
    function updateDate(val: string, name: string) {
        setDateValues({ ...dateValues, [name]: val })
        console.log({ dateSets, ...provValues });
    }
    function updateDisplay(val: boolean, name: string) {
        setShowDropdowns({ ...showDropdowns, [name]: val })
    }

    const temp = "ExampleProv1"






    return (
        <div className='overflow-hidden flex  '>
            <div className='text-center mt-[5rem] w-full justify-between content-start '>
                <div className=' grid lg:grid-cols-2 sm:grid-cols-1 gap-8 m-7 '>
                    <div className='sm:w-full  '>
                        <div className='bg-tan-3 rounded-lg p-5 mx-auto mb-auto mt-0'>


                            <div className='flex-shrink items-center grid grid-cols-5'>
                                <Dropdown
                                    name='provider1'
                                    toggle={showDropdowns.provider1}
                                    items={Object.keys(data)}
                                    values={provValues.provider1}
                                    setValues={updateProv}
                                    setShowDropdowns={updateDisplay} />

                                <Dropdown name='date1' toggle={showDropdowns.date1} items={dateSets.provider1}
                                    values={dateValues.date1}
                                    setValues={updateDate} setShowDropdowns={updateDisplay} />

                                <Toggle name="toggle1" toggle={showDropdowns.toggle1} setShowDropdowns={setShowDropdowns} showDropdowns={showDropdowns} />

                            </div>



                            <div className='whitespace-pre-wrap bg-tan-1 shadow-inner shadow-tan-4 rounded-lg p-4 h-[33vh] lg:h-[70vh]  overflow-y-auto scrollbar-thick scrollbar-thumb-blue-500 scrollbar-track-blue-100 '>
                                <p className='p-3 text-tan-5 text-2xl text-left'>{renderContent1()}</p>
                            </div>
                        </div>
                    </div>

                    <div className='sm:w-full  '>
                        <div className='bg-tan-3 rounded-lg p-5 mx-auto mb-auto mt-0'>


                            <div className='flex-shrink items-center grid grid-cols-5'>

                                <Dropdown
                                    name='provider2'
                                    toggle={showDropdowns.provider2}
                                    items={Object.keys(data)}
                                    values={provValues.provider2}
                                    setValues={updateProv}
                                    setShowDropdowns={updateDisplay} />



                                <Dropdown name='date2'
                                    toggle={showDropdowns.date2}
                                    items={dateSets.provider2}
                                    values={dateValues.date2}
                                    setValues={updateDate}
                                    setShowDropdowns={updateDisplay} />

                                <Toggle name="toggle2" toggle={showDropdowns.toggle2} setShowDropdowns={setShowDropdowns} showDropdowns={showDropdowns} />

                            </div>



                            <div className='whitespace-pre-wrap bg-tan-1 shadow-inner shadow-tan-4 rounded-lg p-4 h-[33vh] lg:h-[70vh]  overflow-y-auto scrollbar-thick scrollbar-thumb-blue-500 scrollbar-track-blue-100 '>
                                <p className='p-3 text-tan-5 text-2xl text-left'>{renderContent2()}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>


    );
}





//export default Dashboard;



