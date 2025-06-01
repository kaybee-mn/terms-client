import React, { useState, useRef, useEffect } from "react";
import simplifyText from "../api/simplify";
import supabase from "../api/supabaseClient";

function Homepage() {
  const [displayText, setDisplayText] = useState<string>("");
  const [simplifications, setSimplifications] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [upload, setUpload] = useState(false);
  const [view, setView] = useState(false);

  const btnUnclicked =
    " hover:text-green-4 hover:border-green-3 hover:p-6 hover:text-5xl";

  const ref = useRef<HTMLDivElement>(null);

  const handleConvert = async () => {
    let text = displayText.trim();
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;
    //console.log("Token:", token);
    //clean up text
    if (!text) {
      console.error("No text to simplify.");
      return;
    }
    text = text.replace(/\s+/g, " ").trim();
    text =
      new DOMParser().parseFromString(text, "text/html").body.textContent || "";

    if (!token) {
      console.error("No access token found.");
      return;
    }
    updateDisplayText("");
    setLoading(true);

    const response = await fetch("/api/simplify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: displayText }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder("utf-8");

    if (!reader) {
      console.error("No stream reader found");
      setLoading(false);
      return;
    }

    let fullText = "";
    let titleCapturing = false;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
      if (fullText.includes("TITLE:")) {
        // get start of title
        let start = fullText.slice(fullText.indexOf("TITLE:") + 6);
        // cut at end of summary
        fullText = fullText.slice(0, fullText.indexOf("TITLE:")-1);
        updateDisplayText(fullText);
        simplifications.push(fullText);
        fullText = start;
        titleCapturing = true;
      } else if (!titleCapturing) {
        updateDisplayText(fullText);
      }
    }
    setTitle(fullText);
    setLoading(false);
  };

  const updateDisplayText = (text: string) => {
    if (ref.current) {
      ref.current.innerHTML = text;
    } else {
      setDisplayText(text);
    }
  };

  const [isEmpty, setIsEmpty] = useState(true);

  const handleInput = () => {
    if (!ref.current) return;
    const text = ref.current.innerText;
    setIsEmpty(text.trim() === "");
    setDisplayText && setDisplayText(text);
  };

  const handleUndo = () => {
    if (simplifications.length > 0) {
      const lastSimplification = simplifications.pop();
      updateDisplayText(lastSimplification || "");
    }
  };

  const handleSave = async () => {
    const text = displayText.trim();
    if (!text) {
      console.error("No text to save.");
      return;
    }
  };

  return (
    <div className="min-h-screen flex y-overflow-auto justify-center text-center ">
      <div className="self-center pt-[9vh]">
        {!upload ? (
          <button className={btnUnclicked} onClick={() => setUpload(!upload)}>
            Get Started!
          </button>
        ) : (
          <>
            {!view ? (
              <div className=" grid grid-flow-col grid-rows-1">
                <button className={btnUnclicked}>File Upload</button>
                <button
                  className={btnUnclicked}
                  onClick={() => {
                    setView(true);
                  }}
                >
                  Text Entry
                </button>
              </div>
            ) : (
              <div className={view ? "textbox-container" : "self-center"}>
                {simplifications.length !== 0 && (
                  <button
                    onClick={() => {
                      handleUndo();
                    }}
                  >
                    Undo
                  </button>
                )}
                <button
                  onClick={() => {
                    handleConvert();
                  }}
                >
                  Simplify{simplifications.length > 0 && " Again"}!
                  {simplifications.length > 2 && " (not recommended)"}
                </button>
                {simplifications.length !== 0 && (
                  <button
                    onClick={() => {
                      handleSave();
                    }}
                  >
                    Save
                  </button>
                )}
                {view && (
                  <div className="relative w-full">
                    {/* editable textbox */}
                    {isEmpty && (
                      <div
                        className="placeholder"
                        style={{ textIndent: "2rem" }}
                      >
                        Paste your confusing Terms & Conditions here...
                      </div>
                    )}
                    <div
                      contentEditable
                      ref={ref}
                      onInput={handleInput}
                      className="textbox"
                    ></div>

                    {loading && (
                      <div className="loading">
                        <div className="loading-spinner"></div>
                      </div>
                    )}
                  </div>
                )}
                <button
                  onClick={() => {
                    setView(false);
                  }}
                >
                  Back
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Homepage;
