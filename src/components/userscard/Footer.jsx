import React, { useState } from "react";

const Footer = ({ buttons, data }) => {
  const [componentFunction, setComponentFunction] = useState();

  const handleButtonClick = (button) => {
    if (data) {
      setComponentFunction(button.function(data));
    } else {
      setComponentFunction(button.function);
    }
  };

  return (
    <div className="flex flex-row w-full justify-between items-center">
      <p>{data?.role}</p>
      <div className="flex flex-row  gap-2 justify- items-center">
        {buttons.length !== 0 &&
          buttons.map((button) => (
            <button
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
