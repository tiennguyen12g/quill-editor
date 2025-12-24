import React, { useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import styles from "./Preview2.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
import "react-quill/dist/quill.snow.css";
import  "./Preview2.css"
import ConvertDocProperly from "./ConvertDocProperly";
// icons

interface Preview2Props {
  documentValue: string | null;
  setDocumentValue: React.Dispatch<React.SetStateAction<string | null>>;
}
function Preview2({ documentValue }: Preview2Props) {
  
  const [fileContent, setFileContent] = useState("");

  useEffect(() => {
    // Recognize the hightlight content
    // let temperaryContent = documentValue;
    // if (temperaryContent === null) return;
    // (function RecognizeHightlight() {
    //   // Use a regular expression to identify and wrap the content
    //   const updatedContent = temperaryContent.replace(
    //     /<p>```content<\/p>([\s\S]*?)<p>```<\/p>/g,
    //     '<div class="content-group"><button class="copy-code-hightlight-content">Copy</button>$1</div>'
    //   );
    //   temperaryContent = updatedContent;
    //   // setFileContent(updatedContent);
    // })();
    // (function RecognizeCodeBlock(){
    //   const updatedContent = temperaryContent.replace(
    //     /<pre.*?>([\s\S]*?)<\/pre>/g,
    //   '<div class="preview-code-block">$&<button class="copy-code-block-btn" >Copy</button></div>'
    //   );
    //   temperaryContent = updatedContent;
    //   // setFileContent(updatedContent);
    // })();

    // (function Handle_Image_Left_And_Content(){
    //   const updatedContent1 = temperaryContent.replace(
    //     /<p>```imageLeft_Content<\/p>([\s\S]*?)<p>```<\/p>/g,
    //   '<div class="image-left-content">$1</div>'
    //   );
    //   const updatedContent2 = updatedContent1.replace(
    //     /<p>`imageLeft<\/p>([\s\S]*?)<p>`<\/p>/g,
    //   '<div class="image-left">$1</div>'
    //   );
    //   const updatedContent3 = updatedContent2.replace(
    //     /<p>`contentRight<\/p>([\s\S]*?)<p>`<\/p>/g,
    //   '<div class="content-right">$1</div>'
    //   );
    //   temperaryContent = updatedContent3;
    //   // setFileContent(updatedContent3);
    // })();

    // (function Handle_Image_Right_And_Content(){
    //   const updatedContent1 = temperaryContent.replace(
    //     /<p>```imageRight_Content<\/p>([\s\S]*?)<p>```<\/p>/g,
    //   '<div class="image-right-content">$1</div>'
    //   );
    //   const updatedContent2 = updatedContent1.replace(
    //     /<p>`imageRight<\/p>([\s\S]*?)<p>`<\/p>/g,
    //   '<div class="image-right">$1</div>'
    //   );
    //   const updatedContent3 = updatedContent2.replace(
    //     /<p>`contentLeft<\/p>([\s\S]*?)<p>`<\/p>/g,
    //   '<div class="content-left">$1</div>'
    //   );
    //   temperaryContent = updatedContent3;
    //   // setFileContent(updatedContent3);
    // })();
    // setFileContent(temperaryContent);
    // if(documentValue === null) return;
    const convertDoc = ConvertDocProperly({documentValue});
    if(convertDoc){
      console.log('1');
      setFileContent(convertDoc)
    }
  }, [documentValue]);

  useEffect(() =>{
    const copyCodeBlocks = document.querySelectorAll(".copy-code-block-btn");
    const copyHightLights = document.querySelectorAll(".copy-code-hightlight-content");
    function CopyContentInsidePreTag(buttonElement: Element){
      if (buttonElement) {
        // Find the previous element (which is assumed to be the <pre> tag)
        const preElement = buttonElement.previousElementSibling;
  
        if (preElement && preElement.tagName === 'PRE') {
  
          // Copy the selected text to the clipboard using Clipboard API
          const textToCopy = preElement.textContent || '';
          try {
            navigator.clipboard.writeText(textToCopy);
            console.log('Copied:', textToCopy);
          } catch (err) {
            console.error('Unable to copy text:', err);
          }
        }
      }
    }
    function CopyHightlightContent (buttonElement: Element) {
      const divContentGroup = buttonElement.closest(".content-group")
      if (divContentGroup) {
        // Now 'container' is the closest ancestor <div> with class 'content-group'
        const paragraphs = divContentGroup.querySelectorAll('p');
        const textToCopy = Array.from(paragraphs).map((p) => p.textContent || '').join('\n');

        try {
          navigator.clipboard.writeText(textToCopy);
          console.log('Copied:', textToCopy);
        } catch (err) {
          console.error('Unable to copy text:', err);
        }
      }
    }
    if(copyHightLights){
      console.log('copyHightLights',copyHightLights);
      copyHightLights.forEach((copyHightlight) => {
        // add class "active-copy" and remove after 2000ms
        copyHightlight.addEventListener("click",() => {
          copyHightlight.innerHTML = "&#10003;";
          copyHightlight.classList.add("active-copy");
          CopyHightlightContent(copyHightlight)
          setTimeout(() => {
            copyHightlight.innerHTML = "Copy";
            copyHightlight.classList.remove("active-copy");
          }, 2000);
        })
      })
    }
    if(copyCodeBlocks){
      console.log('copyHightLights',copyHightLights);
      copyCodeBlocks.forEach((copyCodeBlock) => {
        // add class "active-copy" and remove after 2000ms
        
        copyCodeBlock.addEventListener("click",() => {
          copyCodeBlock.innerHTML = "&#10003;";
          copyCodeBlock.classList.add("active-copy");
          CopyContentInsidePreTag(copyCodeBlock)
          setTimeout(() => {
            copyCodeBlock.innerHTML = "Copy";
            copyCodeBlock.classList.remove("active-copy");
          }, 2000);
        })
      })
    }


  },[fileContent])

  // useEffect(() => {
  //   // Add copy button for code-block
  //   const getContainer = document.getElementById("text-area");
  //   if (!getContainer) return;
  //   const preTags = getContainer.querySelectorAll("pre.ql-syntax");
  //   const wrapPreTags = () => {
  //     preTags.forEach((preTag) => {
  //       if (preTag instanceof HTMLElement) {
  //         console.log("1");
  //         const flexContainer = document.createElement("div");
  //         flexContainer.classList.add("preview-code-block");

  //         preTag.style.flex = "1";

  //         // Clone the preTag to avoid replacing the original node with its descendant
  //         const clonedPreTag = preTag.cloneNode(true) as HTMLElement;
  //         flexContainer.appendChild(clonedPreTag);

  //         const button = document.createElement("button");
  //         button.textContent = "Copy";
  //         button.classList.add("copy-code-block-btn");
  //         flexContainer.appendChild(button);

  //         if (preTag.parentNode) {
  //           preTag.parentNode.replaceChild(flexContainer, preTag);
  //         }
  //       }
  //     });
  //   };
  //   wrapPreTags();
  // }, [fileContent]);
  return (
    <div className={cx("preview-show")}>
      <h4 style={{ marginBottom: 10 }}>Document Content Preview</h4>
      {/* Render HTML content using dangerouslySetInnerHTML */}
      <div
        dangerouslySetInnerHTML={{
          __html: documentValue !== null ? fileContent : "",
        }}
        className={cx("text-area")}
        id="text-area"
      />
    </div>
  );
}

export default Preview2;
