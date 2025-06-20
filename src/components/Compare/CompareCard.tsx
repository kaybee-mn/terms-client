import Dropdown from "../Dropdown";
import Toggle from "../Toggle";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../../api/supabaseClient";

export default function CompareCard(props: { docList: string[]; id: number }) {
  const [doc, setDoc] = useState<number>(0);
  const [version, setVersion] = useState<string|null>(null);
  const [versionList, setVersionList] = useState<Map<string, string>>(
    new Map([])
  );
  const getVersionList = async () => {
    const { data: sbData } = await supabase.auth.getSession();
    const user_token = sbData?.session?.access_token ?? null;
    const res = await fetch(`api/simplifications/titles/${doc + 1}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user_token}`,
      },
    });
    const { data } = await res.json();
    if(data.length<1){
      setVersion(null);
      return;
    }
    data.map((ob: any, index: number) => {
      const date = new Date(ob.timestamp).toLocaleString("en-US", {
        dateStyle: "long",
        timeStyle: "short",
      });
      setVersionList(versionList.set(date, ob.content));
      if (index === 1) {
        setVersion(date);
      }
    });
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
        {props.docList.length > 0 ? (
          <div className="whitespace-pre-wrap bg-tan-1 shadow-inner shadow-tan-4 rounded-lg p-4 h-[33vh] lg:h-[70vh]  overflow-y-auto scrollbar-thick scrollbar-thumb-blue-500 scrollbar-track-blue-100 ">
            <p className="p-3 text-tan-5 text-2xl text-left">
              {versionList.get(version)}
            </p>
          </div>
        ) : (
          <div className="flex text-center whitespace-pre-wrap bg-tan-1 shadow-inner shadow-tan-4 rounded-lg p-4 h-[33vh] lg:h-[70vh] items-center">
            {props.id === 1 ? (
              <span className="w-[100%] align-middle p-3 text-tan-5 text-2xl">
                You don't have anything here!
              </span>
            ) : (
              <span className="w-[100%] align-middle p-3 text-tan-5 text-2xl">
                Go back to the <Link to="/" className="bg-tan-2 px-4 py-2 rounded text-tan-5 border-[0.005rem] border-transparent h-min duration-200 self-center transition-all hover:text-green-5 ">mainpage</Link> to simplify your
                first document
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
