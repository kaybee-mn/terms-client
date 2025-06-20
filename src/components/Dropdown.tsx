import React from "react";

export default function Dropdown(props: {
  toggle?: boolean;
  items: any[];
  setToggle?: Function;
  setValue: Function;
  values: any;
}) {
    const [toggle, setToggle]= (!props.toggle || !props.setToggle)? React.useState(false):[props.toggle, props.setToggle];

  return (
    <div className="col-span-2">
      <button
        className="bg-tan-2 px-8 py-4 rounded text-tan-4 border-[0.005rem] border-transparent m-4  hover:text-green-4 hover:border-green-3 duration-200 text-xl font-medium  w-11/12 inline-flex items-center text-center justify-center "
        type="button"
        onClick={() => {
          setToggle(!toggle);
        }}
      >
        {props.values?props.values:"(none)"}
        <svg
          className="w-2.5 h-2.5 ml-2.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      {/* <!-- Dropdown menu --> */}
      {toggle && (
        <div className="ml-3 lg:w-50%  sm:w-4/12 min-w-[150px] z-10  bg-tan-1 divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 absolute justify-center">
          <ul
            className="py-2 text-sm text-tan-5 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
            {props.items.map((item,index) => {
              return (
                <li key={index}>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-tan-3 dark:hover:tan-2 dark:hover:text-white"
                    onClick={() => {
                      setToggle(false);
                      props.setValue(item);
                    }}
                  >
                    {item}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
