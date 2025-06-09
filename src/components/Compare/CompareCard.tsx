import Dropdown from "../Dropdown";
import Toggle from "../Toggle";
import { useEffect, useState } from "react";
import supabase from "../../api/supabaseClient";

export default function CompareCard(props: { docList: string[] }) {
  const [doc, setDoc] = useState<number>(0);
  const [version, setVersion] = useState<string>("");
  const [versionList, setVersionList] = useState<Map<string, string>>(
    new Map([])
  );
  const getVersionList = async () => {
    const { data: sbData } = await supabase.auth.getSession();
    const user_token = sbData?.session?.access_token ?? null;
    const res = await fetch(`api/simplifications/titles/${doc +1}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user_token}`,
      },
    });
    const {data}=await res.json();
    data.map((ob:any,index:number)=>{
        setVersionList(versionList.set(ob.timestamp,ob.content))
        if(index===1){
            setVersion(ob.timestamp)
        }
    })
    setVersion(versionList[0]);
    console.log(versionList)
  };

  useEffect(() => {
    getVersionList();
  }, []);

  return (
    <div className="sm:w-full  ">
      <div className="bg-tan-3 rounded-lg p-5 mx-auto mb-auto mt-0">
        <div className="flex-shrink items-center grid grid-cols-5">
          <Dropdown
            items={props.docList}
            values={props.docList[doc]}
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
    </div>
  );
}
