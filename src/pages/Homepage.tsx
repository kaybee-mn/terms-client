import React, { useState, useRef, useEffect } from "react";
import simplifyText from "../api/simplify";
import supabase from "../api/supabaseClient";
import Dropdown from "../components/Dropdown";
import { Link } from "react-router-dom";
import { useAlert } from "../context/AlertContext";

function Homepage() {
  const titlesRef = useRef<string[]>([]);
  const user_token = useRef<string | null>(null);
  // const user_id = useRef<string | null>(null);
  const [displayText, setDisplayText] = useState<string>("");
  const [simplifications, setSimplifications] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("New Document");
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [upload, setUpload] = useState(false);
  const [view, setView] = useState(false);
  const {triggerAlert} = useAlert();

  useEffect(() => {
    const loadToken = async () => {
      const { data } = await supabase.auth.getSession();
      user_token.current = data?.session?.access_token ?? null;
      // console.log(user_token.current);
    };
    const fetchTitles = async () => {
      titlesRef.current = [];
      const result = await fetch("/api/simplifications/titles", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user_token.current}`,
        },
      });
      const {data} = await result.json();
      if (data && Array.isArray(data)) {
        data.map((title) => {
          titlesRef.current.push(title.title);
        });
      }
    };
    const init = async () => {
      await loadToken();
      await fetchTitles();
    };
    init();
  }, []);

  const btnUnclicked =
    " hover:text-green-4 hover:border-green-3 hover:p-6 hover:text-5xl";

  const ref = useRef<HTMLDivElement>(null);

  const handleConvert = async () => {
    let text = displayText.trim();

    //console.log("Token:", token);
    //clean up text
    if (!text) {
      console.error("No text to simplify.");
      return;
    }
    text = text.replace(/\s+/g, " ").trim();
    text =
      new DOMParser().parseFromString(text, "text/html").body.textContent || "";
    simplifications.push(text);

    setLoading(true);
    const response = await fetch("/api/simplify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user_token.current}`,
      },
      body: JSON.stringify({ text: text }),
    });
    updateDisplayText("");
    // test code
    const r = await response.json();

    if (!response.ok) {
      throw new Error(r.error || "Failed to simplify text");
    }
    updateDisplayText(r.simplified);
    setLoading(false);
    triggerAlert("Simplified!")
    return;

    // const reader = response.body?.getReader();
    // const decoder = new TextDecoder("utf-8");

    // if (!reader) {
    //   console.error("No stream reader found");
    //   setLoading(false);
    //   return;
    // }

    // let fullText = "";
    // let titleCapturing = false;
    // while (true) {
    //   const { done, value } = await reader.read();
    //   if (done) break;
    //   const chunk = decoder.decode(value, { stream: true });
    //   fullText += chunk;
    //   if (fullText.includes("TITLE:")) {
    //     // get start of title
    //     let start = fullText.slice(fullText.indexOf("TITLE:") + 6);
    //     // cut at end of summary
    //     fullText = fullText.slice(0, fullText.indexOf("TITLE:") - 2);
    //     updateDisplayText(fullText);
    //     fullText = start;
    //     titleCapturing = true;
    //   } else if (!titleCapturing) {
    //     updateDisplayText(fullText);
    //   }
    // }
    // setTitle(fullText);
    // setLoading(false);
  };

  const updateDisplayText = (text: string) => {
    if (ref.current) {
      ref.current.innerHTML = text;
    }
    setDisplayText(text);
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
      setSimplifications((prev) => {
        const copy = [...prev];
        updateDisplayText(copy.pop() || "");
        return copy;
      });
    }
  };

  const handleSave = async () => {
    const text = displayText.trim();
    if (!text) {
      console.error("No summary or title to save.");
      return;
    }

    const response = await fetch("/api/simplifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user_token.current}`,
      },
      body: JSON.stringify({
        title: title || new Date().toLocaleString(),
        content: text,
      }),
    });

    if (!response.ok) {
      triggerAlert("Error saving simplification");
    } else {
      triggerAlert("Simplification saved!");
    }
  };

  return (
    <div className="min-h-screen flex y-overflow-auto justify-center text-center ">
      <div className="self-center pt-[9vh]">
        {!upload ? (
          <div>
          <button className={btnUnclicked} onClick={() => setUpload(!upload)}>
            Simplify!
          </button>
          <br/>
          <button className={btnUnclicked} onClick={() => setUpload(!upload)}>
            <Link to="/history">
            Compare Docs
            </Link>
          </button>
          </div>
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
                <div className="flex-shrink items-center grid grid-cols-6">
                  <Dropdown
                    items={["New Document", ...titlesRef.current]}
                    setValue={setTitle}
                    values={title || "New Document"}
                  ></Dropdown>
                  <button
                    onClick={() => {
                      handleConvert();
                    }}
                    className="col-span-2"
                  >
                    Simplify{simplifications.length > 0 && " Again"}!
                    {simplifications.length > 2 && " (not recommended)"}
                  </button>
                </div>

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
                {simplifications.length > 0 && (
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
                    setView(false);
                  }}
                >
                  Back
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
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Homepage;
