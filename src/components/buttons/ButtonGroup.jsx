import React from "react";

const ButtonGroup = ({ buttons }) => {
  return (
    <div className="flex w-full justify-around [&_button]:bg-white [&_button]:rounded-3xl ">
      {buttons.length !== 0 ? (
        buttons.map((button) => (
          <button className="" onClick={button.function}>
            {button.placeholder}
          </button>
        ))
      ) : (
        <button className="">No Button</button>
      )}
    </div>
  );
};

export default ButtonGroup;
