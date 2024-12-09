import React from "react";

const Footer = ({ buttons, data }) => {

  const handleButtonClick = (button) => {
    if (button.needsParams) {
      button.function(data)
    } else {
      button.function()
    }
  };

  return (
    <div className="flex flex-row w-full justify-between items-center">
      <p className="xsm:text-[12px] xxsm:text-[10px]">{data?.role || data?.appointmentStatus}</p>
      <div className="flex flex-row  gap-1 justify-end items-center">
        
        {buttons.length !== 0 &&
          buttons.map((button, index) => (
            <button
              key={index}
              className="bg-transparent p-0"
              onClick={() => handleButtonClick(button)}
            >
              <img src={button.src} alt={button.alt} className="w-[25px] h-[25px] xsm:w-[20px] xsm:h-[20px] xxsm:w-[15px] xxsm:h-[15px]"/>
            </button>
          ))}
      </div>
    </div>
  );
};

export default Footer;
