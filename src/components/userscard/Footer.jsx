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
      <p>{data?.role || data?.appointmentStatus}</p>
      <div className="flex flex-row  gap-1 justify-end items-center">
        
        {buttons.length !== 0 &&
          buttons.map((button, index) => (
            <button
              key={index}
              className="bg-transparent"
              onClick={() => handleButtonClick(button)}
            >
              <img src={button.src} alt={button.alt} height={25} width={25} />
            </button>
          ))}
      </div>
    </div>
  );
};

export default Footer;
