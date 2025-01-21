import React from "react";
import "./loader.css";

interface LoaderProps {
  height: string;
}

const Loader: React.FC<LoaderProps> = ({ height }) => {
  return (
    <div className={` w-full flex justify-center items-center`} style={{ height }}>
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
