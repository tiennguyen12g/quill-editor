import { useState, useEffect, useRef } from "react";
import MainEditorForCreate from "./MainEditorForCreate";
import styles from "./QuillEditor.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
import Preview2 from "./Preview2";
import { ErrorAlert } from "../Utilitys/CustomAlerts/Alerts";
export default function QuillEditor() {
  const [boxActive, setBoxActive] = useState("write");

  const [switchCount, setSwithCount] = useState<number>(0);
  const [getImageUpload, setGetImageUpload] = useState<File | undefined>(undefined);

  const [isDocHas, setIsDocHas] = useState<boolean | null>(null);
  const [isImageHas, setIsImageHas] = useState<boolean | null>(null);

  // Use Ref to trigger function in MainEditor
  const maineditorRef = useRef<any>(null);

  // Get value from MainEditor
  const [documentValue, setDocumentValue] = useState<string | null>(null);

  // Handle switch between two view mode
  const handleWrite = () => {
    setBoxActive("write");
  };
  const handlePreview = () => {
    setBoxActive("preview");
    if (maineditorRef.current !== null) {
      maineditorRef.current.moveDocumentToPreview();
    }
  };

  // Get session documentValue
  useEffect(() => {
    // Retrieve data from sessionStorage on component mount
    const storedDocumentValue = sessionStorage.getItem("documentValue");
    if (storedDocumentValue) {
      setDocumentValue(storedDocumentValue);
    }
  }, []); // Empty dependency array to run the effect only once on mount

  // Tracking the doc body has content.
  // useEffect(() =>{
  //     if(documentValue?.length > 0 && isDocHas === null || isDocHas === false){
  //         setIsDocHas(true)
  //     }
  // },[documentValue])

  // Tracking file image upload.
  useEffect(() => {
    if (getImageUpload) {
      setIsImageHas(true);
    } else if (getImageUpload === undefined) {
      setIsImageHas(false);
    }
  }, [getImageUpload]);

  return (
    <div className={cx("wrap-create-article")}>
      <div className={cx("container-create-article")}>
        <p style={{ fontSize: 13, color: "gray", marginBottom: 5 }}>Tip: Use "Shift + D" to delete the current format as text color, font, size... </p>
        <div className={cx("add-body")}>
          <div className={cx("box-toolbar")}>
            <div className={cx("write-btn", boxActive === "write" ? "write-active" : "")} onClick={handleWrite}>
              <p style={{ padding: "5px 10px", color: boxActive === "write" ? "rgb(27, 117, 170)" : "black", fontWeight: "500" }}>Write</p>
            </div>
            <div className={cx("preview-btn", boxActive === "preview" ? "preview-active" : "")} onClick={handlePreview}>
              <p style={{ padding: "5px 10px", color: boxActive === "preview" ? "rgb(27, 117, 170)" : "black", fontWeight: "500" }}>Preview</p>
            </div>
          </div>
          <div className={cx("box-write-preview")}>
            {boxActive === "write" ? (
              <div className={cx("main-editor")}>
                <MainEditorForCreate
                  ref={maineditorRef}
                  documentValue={documentValue}
                  setDocumentValue={setDocumentValue}
                  switchCount={switchCount}
                  setSwitchCount={setSwithCount}
                />
              </div>
            ) : (
              <div className={cx("document-preview")}>
                <div className={cx("container-preview")}>
                  <Preview2 documentValue={documentValue} setDocumentValue={setDocumentValue} />
                </div>
              </div>
            )}
          </div>
        </div>
        {isDocHas === false ? <ErrorAlert nameAlert="Document empty!" explainAlert="Please write something in your article." /> : ""}
      </div>
    </div>
  );
}
