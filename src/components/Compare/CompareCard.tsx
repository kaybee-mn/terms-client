import Dropdown from "../Dropdown";
import Toggle from "../Toggle";
import { useEffect, useState } from "react";

export default function CompareCard(
    docList:string[]
){
    const [doc,setDoc]=useState<number>(0);
    const [version,setVersion]=useState<string>("");
    const [versionList,setVersionList]=useState<Map<string,string>>(new Map([]));

    const getVersionList = async () =>{
        const res = await fetch(`api/simplifications/titles/${doc}`)

    }

    useEffect(()=>{
        
    },[])

    return (
          <div className="sm:w-full  ">
            <div className="bg-tan-3 rounded-lg p-5 mx-auto mb-auto mt-0">
              <div className="flex-shrink items-center grid grid-cols-5">
                <Dropdown
                  items={docList}
                  values={docList[doc]}
                  setValue={setDoc}
                />

                <Dropdown
                  items={[...versionList.keys()]}
                  values={version}
                  setValue={setVersion}
                />

                {/* <Toggle
                  name="toggle2"
                  toggle={showDropdowns.toggle2}
                  setShowDropdowns={setShowDropdowns}
                  showDropdowns={showDropdowns}
                /> */}
              </div>

              <div className="whitespace-pre-wrap bg-tan-1 shadow-inner shadow-tan-4 rounded-lg p-4 h-[33vh] lg:h-[70vh]  overflow-y-auto scrollbar-thick scrollbar-thumb-blue-500 scrollbar-track-blue-100 ">
                <p className="p-3 text-tan-5 text-2xl text-left">
                  {versionList.get(version)}
                </p>
              </div>
            </div>
          </div>)
}