import React from "react";
import styles from "./CreateArticle.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
import QuillEditor from "../components/QuillEditor";
export default function CreateArticle() {
  return (
    <div>
      <div style={{ marginTop: 20 }}>
        <h3 style={{ fontWeight: "600", fontSize: 25 }}>Create your article</h3>
      </div>

      <div className={cx("add-title")}>
        <h4>Add a title</h4>
        <div className={cx("title-filter")}>
          <input type="text" placeholder="Title ..." />
        </div>
      </div>

      <h4 style={{ margin: "0 0 10px 0" }}>Add a body</h4>
      <QuillEditor />
    </div>
  );
}
