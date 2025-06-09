import React from "react";

export default function Toggle(props: {
  name: string;
  toggle: boolean;
  setShowDropdowns: Function;
  showDropdowns: any;
}) {
  return (
    <div className="col-span-1">
      <span className="ml-3 text-xl font-medium text-green-5 ">
        {props.toggle ? "Simplified" : "Detailed"}
      </span>
      <br></br>
      <label className="relative inline-flex items-center cursor-pointer ml-3 mt-2 ">
        <input type="checkbox" value="" className="sr-only peer"></input>
        <div
          className={
            props.toggle
              ? "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-3 dark:peer-focus:ring-green-3 rounded-full peer after:translate-x-full after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-tan-2 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all bg-green-4"
              : "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-3 dark:peer-focus:ring-green-3 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-tan-2 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all "
          }
          onClick={() => {
            props.setShowDropdowns({
              ...props.showDropdowns,
              [props.name]: !props.toggle,
            });
          }}
        ></div>
      </label>
    </div>
  );
}

//className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-3 dark:peer-focus:ring-green-3 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-tan-2 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-4 "
