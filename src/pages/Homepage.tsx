import React, { useState, useRef, useEffect } from 'react';
import { sendToAI } from '../api/simplify';


function Homepage() {
    const [displayText, setDisplayText] = useState<string>("");
    const [simplifications, setSimplifications] = useState<string[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [upload, setUpload] = useState(false);
    const [view, setView] = useState(false);

    const btnUnclicked = ' hover:text-green-4 hover:border-green-3 hover:p-6 hover:text-5xl';
    const handleConvert = async()=>{
        setSimplifications([...simplifications, displayText]);
        setDisplayText(await sendToAI(displayText));
    }

    const [isEmpty, setIsEmpty] = useState(true);
    const ref = useRef(null);
  
    const handleInput = () => {
      const text = ref.current.innerText;
      setIsEmpty(text.trim() === '');
      setDisplayText && setDisplayText(text);
    };

    const handleUndo = () => {
        if (simplifications.length > 0) {
            const lastSimplification = simplifications.pop();
            setDisplayText(lastSimplification);
        }
    };

    return (



        <div className='min-h-screen flex y-overflow-auto justify-center text-center '>
            <div className='self-center pt-[9vh]'>
                { !upload ? 
                (<button className={btnUnclicked} onClick={()=>setUpload(!upload)}>Get Started!</button>)
                :
                (<>
                    {!view? <div className=' grid grid-flow-col grid-rows-1'>
                        <button className={btnUnclicked}>File Upload</button>
                        <button className={btnUnclicked} onClick={()=>{setView(true)}}>Text Entry</button>
                    </div>:
                    <div className={view ? 'textbox-container':'self-center'}>
                        {simplifications.length!==0 && <button onClick={()=>{handleUndo()}}>Undo</button>}
                        <button onClick={()=>{handleConvert()}}>Simplify!{simplifications.length>2&& ' (not recommended)'}</button> 
                        {view && <div className="relative w-full">
                        {/* editable textbox */}
                            {isEmpty && (
                                <div className="placeholder"
                                style={{ textIndent: '2rem' }}>
                                Paste your confusing Terms & Conditions here...
                                </div>
                            )}
                            <div
                                contentEditable
                                ref={ref}
                                onInput={handleInput}
                                className="textbox"
                                style={{ textIndent: '2rem' }}
                            />
                            </div>}
                        <button onClick={()=>{setView(false)}}>Back</button>
                    </div>}
                </>)}
            </div>
        </div>



    );
}

export default Homepage;