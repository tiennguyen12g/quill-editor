import styles from "./Alerts.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
import React from "react";
import { TiWarning } from "react-icons/ti";
import { IoCheckmarkCircle } from "react-icons/io5";
import { MdError } from "react-icons/md";
import { IoMdInformationCircle } from "react-icons/io";
import { IconContext } from "react-icons";

interface AlertProps {
  nameAlert: string;
  explainAlert: string;
}
export function WarningAlert({nameAlert, explainAlert} : AlertProps) {
//   const nameAlert = "Title empty";
//   const explainAlert = "Please write title for the article. Please write title for the article.";
  return (
    <div className={cx("box-alert", "warning")}>
      <div className={cx("container-icon-name")}>
        {/* icon warning */}
        <span className={cx("alert-icon")}>
          <IconContext.Provider
            value={{
              size: "25px",
              color: "rgb(255,204,0)",
              style: { display: "inline" },
            }}
          >
            <TiWarning />
          </IconContext.Provider>
        </span>

        {/* Name warning */}
        <span className={cx("alert-name")}>{nameAlert}</span>
      </div>

      {/* Explain waring */}
      <span className={cx("alert-explain")}>{explainAlert}</span>
    </div>
  );
}
export function SuccessAlert({nameAlert, explainAlert} : AlertProps) {
  return (
    <div className={cx("box-alert", "success")}>
      <div className={cx("container-icon-name")}>
        {/* icon success */}
        <span className={cx("alert-icon")}>
          <IconContext.Provider
            value={{
              size: "25px",
              color: "#2f855a",
              style: { display: "inline" },
            }}
          >
            <IoCheckmarkCircle />
          </IconContext.Provider>
        </span>

        {/* Name success  */}
        <span className={cx("alert-name")}>{nameAlert}</span>
      </div>

      {/* Explain success  */}
      <span className={cx("alert-explain")}>{explainAlert}</span>
    </div>
  );
}

export function ErrorAlert({nameAlert, explainAlert} : AlertProps) {
  return (
    <div className={cx("box-alert", "error")}>
      <div className={cx("container-icon-name")}>
        {/* icon error */}
        <span className={cx("alert-icon")}>
          <IconContext.Provider
            value={{
              size: "25px",
              color: "#c53030",
              style: { display: "inline" },
            }}
          >
            <MdError />
          </IconContext.Provider>
        </span>

        {/* Name error */}
        <span className={cx("alert-name")}>{nameAlert}</span>
      </div>

      {/* Explain error */}
      <span className={cx("alert-explain")}>{explainAlert}</span>
    </div>
  );
}
export function InfoAlert({nameAlert, explainAlert} : AlertProps) {
  return (
    <div className={cx("box-alert", "info")}>
      <div className={cx("container-icon-name")}>
        {/* icon info */}
        <span className={cx("alert-icon")}>
          <IconContext.Provider
            value={{
              size: "25px",
              color: "#2b6cb0",
              style: { display: "inline" },
            }}
          >
            <IoMdInformationCircle />
          </IconContext.Provider>
        </span>

        {/* Name info */}
        <span className={cx("alert-name")}>{nameAlert}</span>
      </div>

      {/* Explain info */}
      <span className={cx("alert-explain")}>{explainAlert}</span>
    </div>
  );
}
