import React, { useState, useRef, useEffect, useImperativeHandle } from "react";
import "./MainEditorForCreate.css";
import { FaArrowCircleUp } from "react-icons/fa";
import { FaArrowCircleDown } from "react-icons/fa";

// Component

// Quill-react package
import ReactQuill from "react-quill";
import { Quill, Range } from "react-quill";
import "react-quill/dist/quill.snow.css";

// Custom modules
import { insertHeart, insertStart, HightlightContent, Image_Left_And_Content, Image_Right_And_Content } from "./FeatureButton/SomeEasyFeature.jsx";
import { ImageDrop } from "quill-image-drop-module";
import ImageResize from "./quill-editor-tnbt/ImageResize.js";
import CompareImage2 from "./quill-editor-tnbt/CompareImage2.js";

// Register the module to Quill
Quill.register("modules/imageResize", ImageResize);
Quill.register("modules/imageDrop", ImageDrop);
const instanceCompareImage = new CompareImage2();
Quill.register("modules/compareImage", instanceCompareImage);

import { CustomRedo, CustomUndo, undoChange, redoChange } from "./FeatureButton/RedoAndUndo.jsx";

// Start component
const MainEditorForCreate = React.forwardRef(
  (
    props: {
      documentValue: any;
      setDocumentValue: React.Dispatch<React.SetStateAction<string | null>>;
      switchCount: number;
      setSwitchCount: React.Dispatch<React.SetStateAction<number>>;
      onImageUpload?: (file: File) => Promise<string>;
      defaultImageWidth?: number;
      placeholder?: string;
      showToolbar?: boolean;
    },
    ref
  ) => {
    const { 
      documentValue, 
      setDocumentValue, 
      switchCount, 
      setSwitchCount,
      onImageUpload,
      defaultImageWidth = 500,
      placeholder = "   Write something awesome...",
      showToolbar = true,
    } = props;
    // console.log('docvalue 2', documentValue);
    const [valueDoc, setValueDoc] = useState(documentValue ? documentValue : "");
    // console.log('value doc', valueDoc);
    const [showTopEnd, setShowTopEnd] = useState(false);
    const quillRef = useRef<any>(null);

    useEffect(() => {
      setValueDoc(documentValue);
    }, [documentValue]);
    // update the current Doc
    const handleChange = (value: any) => {
      setValueDoc(value);
      // IMPORTANT: Also update parent component's state
      setDocumentValue(value);
    };

    // Pass QuillRef to Compare
    useEffect(() => {
      instanceCompareImage.setQuillRef(quillRef);
    }, []);

    // add class to ql-editor
    useEffect(() => {
      const qlEditor = document.querySelectorAll(".ql-editor");
      if (qlEditor) {
        qlEditor[0].classList.add("box-writing");
      }
      const quillCustomClass = document.querySelectorAll(".ql-container");
      if (quillCustomClass) {
        quillCustomClass[0].classList.add("ql-container-custom");
      }
    }, []);
    // function switch to Preview mode
    const moveDocumentToPreview = () => {
      function StoreImageStyles() {
        const qlEditor = document.querySelector(".ql-editor");
        if (qlEditor) {
          // Find all img tags within qlEditor
          const imgElements = qlEditor.querySelectorAll("img");

          // Array to store img tags
          const imgArray: {
            style: string;
            width: number;
          }[] = [];

          // Iterate over imgElements and add them to imgArray
          imgElements.forEach((imgElement) => {
            console.log("img style", imgElement.style.width);
            const attributes = {
              style: imgElement.style.cssText,
              width: imgElement.width,
            };
            imgArray.push(attributes);
          });

          // Now imgArray contains all img tags within .ql-editor
          console.log(imgArray);
          // setImageArrays(imgArray);
          sessionStorage.setItem("imageAttributes", JSON.stringify(imgArray));
        }
      }
      StoreImageStyles();
      setDocumentValue(valueDoc);
      setSwitchCount(switchCount + 1);
      sessionStorage.setItem("documentValue", valueDoc);
    };
    //get temporary doc that has stored in sessionStorage
    const getCurrentDoc = () => {
      return valueDoc;
    };

    // When we change mode between "Write" and "Preview", the img has lost its style that have been modified.
    // This useEffect get the last attribute of the img and add again to its style.
    // We need to switchCount to detect when we switch mode.
    useEffect(() => {
      const qlEditor = document.querySelector(".ql-editor");
      const attributes = sessionStorage.getItem("imageAttributes");
      if (qlEditor && attributes) {
        // Find all img tags within qlEditor
        const imgElements = qlEditor.querySelectorAll("img");
        const parseAttributes = JSON.parse(attributes);
        imgElements.forEach((imgElement, index) => {
          const { style, width } = parseAttributes[index];
          imgElement.style.cssText = style;
          imgElement.width = width;
        });
      }
    }, [switchCount]);

    // This component to test store article to local and drive api.
    const handleSave = async (titleInput: string) => {};

    // Store article in Firestore.
    const handleStore_In_Firestore = async (titleInput: string, listTags: string[], imageFile: string | File) => {
      //Create unique ID for article.
      function generateArticleID() {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let articleID = "";
        for (let i = 0; i < 12; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          articleID += characters.charAt(randomIndex);
        }
        return articleID;
      }
      const uniqueArticleID = generateArticleID();

      // Create date when posted
      function getFormattedDate(): string {
        const options: Intl.DateTimeFormatOptions = {
          hour: "numeric",
          minute: "numeric",
          day: "numeric",
          month: "short",
        };

        const formatter = new Intl.DateTimeFormat("en-US", options);
        const currentDate = new Date();

        return formatter.format(currentDate);
      }
      const datePostArticle = getFormattedDate();
      console.log(datePostArticle);

      // store article as document in collection firestore.
      (async function StoreToCollection() {})();

      // store article to list article for showing
      (async function Store_To_List_Articles() {})();
    };

    // Edit article in Firestore.
    function handleEdit_Article(titleInput: string, nameFramework: string) {
      try {
        (async function EditDocument() {})();
        (async function EditSearchDocument() {})();
        return "Text saved successfully!";
      } catch (error) {
        console.log("error", error);
        return "Failed to save text.";
      }
    }

    // Store article in Mongodb.
    const handleStore_In_Mongodb = async (titleInput: string, listTags: string[], imageFile: string | File) => {
      //Create unique ID for article.
      function generateArticleID() {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let articleID = "";
        for (let i = 0; i < 12; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          articleID += characters.charAt(randomIndex);
        }
        return articleID;
      }
      const uniqueArticleID = generateArticleID();

      // Create date when posted
      function getFormattedDate(): string {
        const options: Intl.DateTimeFormatOptions = {
          hour: "numeric",
          minute: "numeric",
          day: "numeric",
          month: "short",
        };

        const formatter = new Intl.DateTimeFormat("en-US", options);
        const currentDate = new Date();

        return formatter.format(currentDate);
      }
      const datePostArticle = getFormattedDate();
      console.log(datePostArticle);

      // Get userInfo

      // store article to list article for showing
      (async function Store_To_List_Articles() {})();
    };
    // Edit article in Mongodb.

    // this hook help us forward function to parent element and trigger it from parent
    useImperativeHandle(ref, () => ({
      handleSave,
      handleStore_In_Firestore,
      moveDocumentToPreview,
      getCurrentDoc,
      handleEdit_Article,
      handleStore_In_Mongodb,
      getEditor: () => {
        if (quillRef.current) {
          return quillRef.current.getEditor();
        }
        return null;
      },
    }));

    // Control button by shortcut keyboard
    const buttonRef = useRef<HTMLButtonElement>(null);
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        // Check if the key combination is Ctrl + Shift + C
        // if (event.ctrlKey && event.shiftKey && event.key === 'C') {
        //   // Trigger the button click event
        //   buttonRef.current?.click();
        // }
        if (event.shiftKey && event.key === "D") {
          // Trigger the button click event
          buttonRef.current?.click();
        }
      };

      // Add the keydown event listener to the document
      document.addEventListener("keydown", handleKeyDown);

      // Cleanup the event listener on component unmount
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, []); // Empty dependency array ensures the effect runs only once on mount
    const handleDeleteFormat = () => {
      console.log("removeFormat");
      // You can replace the alert with your desired functionality
      if (quillRef.current) {
        const quill = quillRef.current.getEditor();
        const selection = quill.getSelection();
        const position = selection ? selection.index : 0;
        quill.removeFormat(position);
      }
    };
    function GoTop() {
      console.log("go top");
      if (quillRef.current) {
        const quill = quillRef.current.getEditor();

        // Set the selection to the end of the content
        quill.setSelection(0, 0);

        // Get the scrolling container
        const scrollElement = document.scrollingElement || document.body;
        scrollElement.scrollTop = 0;
        const qlContainerCustom = document.querySelector(".ql-container-custom");
        if (!qlContainerCustom) return;
        qlContainerCustom.scrollTop = 0;
      }
    }
    function GoEnd() {
      if (quillRef.current) {
        const quill = quillRef.current.getEditor();

        // Set the selection to the end of the content
        quill.setSelection(quill.getLength(), 0);

        // Get the scrolling container
        const qlContainerCustom = document.querySelector(".ql-container-custom");
        const scrollElement = document.scrollingElement || document.body;
        scrollElement.scrollTop = scrollElement.scrollHeight;
        if (!qlContainerCustom) return;
        qlContainerCustom.scrollTop = qlContainerCustom.scrollHeight;
      }
    }
    const handleCustomImageDefault = () => {
      // Create a file input element
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.style.display = 'none';
      
      // Handle file selection
      input.onchange = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;
        
        let imageUrl: string;
        
        // If onImageUpload callback is provided, use it
        if (onImageUpload) {
          try {
            imageUrl = await onImageUpload(file);
          } catch (error: any) {
            console.error('Image upload failed:', error);
            // Fallback to data URL if upload fails
            imageUrl = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = (event: any) => resolve(event.target.result);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
          }
        } else {
          // Fallback to data URL if no callback provided
          imageUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event: any) => resolve(event.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        }
        
        if (quillRef.current) {
          const quill = quillRef.current.getEditor();
          const selection = quill.getSelection();
          const position = selection ? selection.index : quill.getLength();
          
          // Insert the image at the current cursor position
          quill.insertEmbed(position, 'image', imageUrl);
          
          // Set default size after a short delay to ensure image is inserted
          setTimeout(() => {
            const qlEditor = document.querySelector('.ql-editor');
            if (qlEditor) {
              const imgElements = qlEditor.querySelectorAll('img');
              const lastImg = imgElements[imgElements.length - 1] as HTMLImageElement;
              
              if (lastImg) {
                // Use the provided defaultImageWidth or fallback to 500
                lastImg.style.width = `${defaultImageWidth}px`;
                lastImg.style.height = 'auto';
                lastImg.style.maxWidth = '100%';
              }
            }
          }, 100);
        }
      };
      
      // Trigger file input click
      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
    };
    console.log("Re-dender");
    // I dont know why this console alway render after useEffect. Maybe React-Quill have sth wrong.
    // So I cannot fix auto scroll to top after made paste action by using useEffect.
    // I just found this way, use "window" to scroll.
    // window.scrollTo({
    //   top: document.documentElement.scrollHeight,
    //   behavior: "instant"
    // })
    useEffect(() => {
      function showButtonTopEnd() {
        const qlEditor = document.querySelector(".ql-editor");
        if (qlEditor) {
          const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
              const articleHeight = entry.target.clientHeight;
              console.log("Element resized:", articleHeight);
              // Your logic here based on the resized height
              // setShowTopEnd(true)
              if (articleHeight > 500) {
                setShowTopEnd(true);
              } else {
                setShowTopEnd(false);
              }
            }
          });

          // Start observing the element's size changes
          observer.observe(qlEditor);

          // Cleanup the observer when the component is unmounted
          return () => {
            observer.disconnect();
          };
        }
      }

      showButtonTopEnd(); // Initial check

      // Add a global event listener for resize events
      window.addEventListener("resize", showButtonTopEnd);

      // Cleanup the event listener when the component is unmounted
      return () => {
        window.removeEventListener("resize", showButtonTopEnd);
      };
    }, []);

    return (
      <div className="wrap-text-editor">
        <div className="top-and-bottom">
          {showTopEnd ? (
            <>
              <div>
                <button onClick={() => GoTop()} className="go-top">
                  <FaArrowCircleUp />
                </button>
              </div>
              <div>
                <button onClick={() => GoEnd()} className="go-end">
                  <FaArrowCircleDown />
                </button>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
        <div id="quill-toolbar">
          <span className="ql-formats">
            <select className="ql-font custom-ql-font" defaultValue="arial">
              <option value="arial">Arial</option>
              <option value="comic-sans">Comic Sans</option>
              <option value="courier-new">Courier New</option>
              <option value="georgia">Georgia</option>
              <option value="helvetica">Helvetica</option>
              <option value="lucida">Lucida</option>
            </select>
            <select className="ql-size custom-ql-size" defaultValue="medium">
              <option value="extra-small">Size 1</option>
              <option value="small">Size 2</option>
              <option value="medium">Size 3</option>
              <option value="large">Size 4</option>
            </select>
            <select className="ql-header custom-ql-header" defaultValue="3">
              <option value="1">Heading</option>
              <option value="2">Subheading</option>
              <option value="3">Normal</option>
            </select>
          </span>
          <span className="ql-formats">
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
            <button className="ql-strike" />
          </span>
          <span className="ql-formats">
            <button className="ql-list" value="ordered" />
            <button className="ql-list" value="bullet" />
            <button className="ql-indent" value="-1" />
            <button className="ql-indent" value="+1" />
          </span>
          <span className="ql-formats">
            <button className="ql-script" value="super" />
            <button className="ql-script" value="sub" />
            <button className="ql-blockquote" />
            <button className="ql-direction" />
          </span>
          <span className="ql-formats">
            <select className="ql-align" />
            <select className="ql-color" />
            <select className="ql-background" />
          </span>
          <span className="ql-formats">
            <button className="ql-link" />
            <button className="ql-video" />
            {/* <button className="ql-image" />  // this is default import image*/}
            <button className="ql-image-custom" onClick={handleCustomImageDefault}>
              <svg fill="#000000" height="18px" width="18px" viewBox="0 0 24 24">
                <g id="image">
                  <g>
                    <path d="M24,22H0V2h24V22z M3.4,20H22v-2.6l-5-5l-5,5l-3-3L3.4,20z M2,4v14.6l7-7l3,3l5-5l5,5V4H2z" />
                  </g>
                  <g>
                    <circle cx="7" cy="8" r="2" />
                  </g>
                </g>
              </svg>
            </button>
          </span>
          <span className="ql-formats">
            <button className="alignBtn" style={{ color: "yellowgreen", marginTop: 0 }} onClick={() => insertStart(quillRef)}>
              &#9733;
            </button>
            <button className="alignBtn" style={{ color: "red", fontSize: 20, marginTop: -4 }} onClick={() => insertHeart(quillRef)}>
              &#9829;
            </button>
            <button className="ql-testExecute alignBtn" onClick={() => HightlightContent(quillRef)} style={{ color: "black" }}>
              <span style={{ color: "black" }}>Hightlight</span>
            </button>
            <button className="ql-undo" onClick={() => undoChange(quillRef)} style={{ marginTop: 4 }}>
              <CustomUndo />
            </button>
            <button className="ql-redo" onClick={() => redoChange(quillRef)} style={{ marginTop: 4 }}>
              <CustomRedo />
            </button>
          </span>
          <span className="ql-formats" style={{ marginTop: 4 }}>
            <button className="ql-formula" />
            <button className="ql-code-block" />
            <button className="ql-clean" ref={buttonRef} onClick={handleDeleteFormat} />
          </span>
          <span className="ql-formats">
            <button className="ql-compareImage" style={{ marginTop: 4 }}>
              <svg x="0px" y="0px" width="18px" height="18px" viewBox="0 0 98.327 98.327">
                <g>
                  <path
                    d="M96.064,11.098H15.578c-1.249,0-2.261,1.012-2.261,2.261v11.057H2.261C1.012,24.416,0,25.428,0,26.677v58.292
              		c0,1.249,1.013,2.261,2.261,2.261h80.488c1.248,0,2.261-1.012,2.261-2.261V73.91h11.057c1.248,0,2.261-1.012,2.261-2.261V13.357
              		C98.327,12.108,97.314,11.098,96.064,11.098z M75.193,17.581c4.771,0,8.639,3.867,8.639,8.638s-3.868,8.637-8.639,8.637
              		s-8.637-3.867-8.637-8.637C66.557,21.448,70.423,17.581,75.193,17.581z M77.629,80.08l-70.25-0.021
              		c0.284-6.229,2.467-16.201,5.938-24.424v16.015c0,1.249,1.013,2.261,2.261,2.261h59.289C75.872,76.164,77.374,79.172,77.629,80.08z
              		 M20.697,66.742c0.444-9.767,5.549-28.744,12.985-35.736C40.341,24.792,46,30.229,50.44,36.556
              		c4.106,5.882,7.681,11.084,10.691,14.354c4.957,4.957,9.191-2.557,14.391-5.032c7.574-3.607,13.816,15.149,15.426,20.886
              		L20.697,66.742z"
                  />
                </g>
              </svg>
            </button>
            <button style={{ marginTop: 4 }} onClick={() => Image_Left_And_Content(quillRef)}>
              <svg width="18px" height="18px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 6v12h9V6zm8 11H2V7h7zm-8 3h22v1H1zM1 3h22v1H1zm11 4h11v1H12zm0 3h11v1H12zm0 3h11v1H12zm0 3h11v1H12z" />
                <path fill="none" d="M0 0h24v24H0z" />
              </svg>
            </button>
            <button onClick={() => Image_Right_And_Content(quillRef)} style={{ marginTop: 4, transform: "rotate(180deg)" }}>
              <svg width="18px" height="18px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 6v12h9V6zm8 11H2V7h7zm-8 3h22v1H1zM1 3h22v1H1zm11 4h11v1H12zm0 3h11v1H12zm0 3h11v1H12zm0 3h11v1H12z" />
                <path fill="none" d="M0 0h24v24H0z" />
              </svg>
            </button>
            <button onClick={() => GoTop()} className="go-top alignBtn">
              Top
            </button>
            <button onClick={() => GoEnd()} className="go-end alignBtn">
              End
            </button>
            {/* <button onClick={() => Selection(quillRef)} className="alignBtn">Selection</button>
          <button onClick={CursorLocated} className="alignBtn">Cursor locates</button> */}
          </span>
        </div>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={valueDoc}
          onChange={handleChange}
          placeholder={placeholder}
          formats={formats}
          modules={modules}
          scrollingContainer=".ql-editor"
        />
        {/* <div className="editor-arrow">
        <FaArrowCircleUp />
        <FaArrowCircleDown/>
      </div> */}
      </div>
    );
  }
);

export default MainEditorForCreate;

export const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "align",
  "strike",
  "script",
  "blockquote",
  "code-block",
  "background",
  "color",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

const modules = {
  toolbar: {
    container: "#quill-toolbar",
    handlers: {
      compareImage: handleCompareImageClick,
    },
  },
  keyboard: {
    bindings: {
      list: {
        key: "ctrl + shift + C",
        format: ["list"],
        handler: function () {
          console.log("hello");
        },
      },
    },
  },
  imageResize: {
    parchment: Quill.import("parchment"),
    modules: ["Resize", "DisplaySize", "Toolbar"],
  },
  imageDrop: true,
};
function handleCompareImageClick() {
  const boxImageTest = document.querySelectorAll(".box-image-test");
  if (boxImageTest.length !== 1) {
    instanceCompareImage.addBoxImage();
    instanceCompareImage.addBox1();
    instanceCompareImage.exitBoxImageChoose();
    instanceCompareImage.addBox2();
  } else {
    console.log("You have added this box");
  }
}

// Function for test something
function Selection(quillRef: any) {
  const quill = quillRef.current.getEditor();
  const selection = quill.getSelection();
  const position = selection ? selection.index : 0;
  console.log("selection", selection);
  // if (selection) {
  //   const [leaf] = quill.getLeaf(selection.index);
  //   const currentNode = leaf[0];

  //   console.log("Current Element:", currentNode);
  //     // Check if currentNode is a text node
  // if (currentNode.nodeType === Node.TEXT_NODE) {
  //   // Create a container element to hold the image
  //   const container = document.createElement("span");
  //   container.classList.add("image-container");

  //   // Create an image element
  //   const img = document.createElement("img");
  //   img.src = "Users/TNBT/Desktop/my-picture.jpg"; // Set the source of the image

  //   // Insert the image into the container
  //   container.appendChild(img);

  //   // Replace the text node with the container and append the remaining text
  //   currentNode.parentNode.replaceChild(container, currentNode);
  //   quill.insertText(selection.index + 1, "Remaining text", "image", "user");
  // }
  // }
  if (selection.index) {
    const getLine = quill.getLine(position, 0);
    console.log("getLine", getLine);
    // quill.insertEmbed(position, "image", Mypicture);
  }
}
function CursorLocated() {
  console.log("at cursor located");
  const qlEditor = document.querySelector(".ql-editor");
  if (!qlEditor) return;
  qlEditor.addEventListener("mouseup", function () {
    const selection = window.getSelection();

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const container: any = range.commonAncestorContainer;

      // Check if the cursor is inside a <p> element
      if (container.nodeType === 3) {
        // If the cursor is inside text, find the parent <p> element
        const paragraphElement = container.parentElement;
        if (!paragraphElement?.parentNode) return;
        const paragraphIndex = Array.from(paragraphElement.parentNode.children).indexOf(paragraphElement);

        console.log("Cursor is inside <p> element:", paragraphIndex + 1);
      } else if (container.nodeType === 1 && container.nodeName === "P") {
        // If the cursor is directly inside a <p> element
        if (!container.parentNode) return;
        const paragraphIndex = Array.from(container.parentNode.children).indexOf(container);

        console.log("Cursor is inside <p> element:", paragraphIndex + 1);
      } else {
        console.log("Cursor is not inside a <p> element");
      }
    }
  });
}

interface UserPropertiesProps {
  userName: string;
  email: string;
  userID: number;
  confirmedEmail: boolean;
  password: string;
  role: "user" | "admin";
  personalDetails: {
    profilePicUrl: string;
    phoneNumber: number;
    city: string;
    country: string;
    socialLinks: string[];
  };
  createdAt: string;
}
//dropdown custom exam
// https://codesandbox.io/p/sandbox/custom-toolbar-with-react-quill-fully-working-select-forked-bre4j?file=%2Findex.js%3A12%2C41-12%2C44
