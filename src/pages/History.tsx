import { useEffect, useRef, useState } from "react";
import supabase from "../api/supabaseClient";
import CompareCard from "../components/Compare/CompareCard";
import AuthWrapper from "../contexts/AuthContext";

export default function History() {
  const documentList = useRef<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDocs = async () => {
      const { data: sbData } = await supabase.auth.getSession();
      const user_token = sbData?.session?.access_token ?? null;
      documentList.current = [];
      console.log(documentList);
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
      setLoading(false);
    };
    const init = async () => {
      await fetchDocs();
    };
    init();
  }, []);

  return (
    <AuthWrapper>
      <div className="overflow-hidden flex  ">
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="text-center mt-[5rem] w-full justify-between content-start ">
            <div className=" grid lg:grid-cols-2 sm:grid-cols-1 gap-8 m-7 ">
              <CompareCard docList={documentList.current} id={1} />
              <CompareCard docList={documentList.current} id={2} />
            </div>
          </div>
        )}
      </div>
    </AuthWrapper>
  );
}
