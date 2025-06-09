import React, { useEffect, useRef, useState } from "react";
import supabase from "../api/supabaseClient";
import CompareCard from "../components/Compare/CompareCard";


export default function Dashboard() {
  const documentList = useRef<string[]>([]);
  const [loading,setLoading]= useState<boolean>(true);

  useEffect(() => {
    const fetchDocs = async () => {
      const { data: sbData } = await supabase.auth.getSession();
      const user_token = sbData?.session?.access_token ?? null;
      documentList.current = [];
      const result = await fetch("/api/simplifications/titles", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user_token}`,
        },
      });
      const { data } = await result.json();
      if (data && Array.isArray(data)) {
        data.map((title) => {
          documentList.current.push(title.title);
        });
      }
      console.log(documentList)
      setLoading(false);
    };
    const init = async()=>{
      await fetchDocs();
    }
    init();
  }, []);


  return (
    <div className="overflow-hidden flex  ">
      <div className="text-center mt-[5rem] w-full justify-between content-start ">
        <div className=" grid lg:grid-cols-2 sm:grid-cols-1 gap-8 m-7 ">
          <CompareCard docList={documentList.current} />
          <CompareCard docList={documentList.current} />
        </div>
      </div>
    </div>
  );
}
