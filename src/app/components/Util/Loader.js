import React from "react";
import LoaderSvg from "../../icons/loader.svg";
import "./Util.css";

export function Loader() {
  return (
    <div className="loader">
      <img src={LoaderSvg} alt="Loading" />
    </div>
  );
}
