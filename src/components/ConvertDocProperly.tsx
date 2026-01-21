interface ConvertDocProperlyProps{
    documentValue: string | null;
}
export default function ConvertDocProperly({documentValue} : ConvertDocProperlyProps) {
    let temperaryContent: string | null = documentValue;
    if (temperaryContent === null) return;
    (function RecognizeHightlight() {
      // Use a regular expression to identify and wrap the content
      const updatedContent = temperaryContent.replace(
        /<p>```content<\/p>([\s\S]*?)<p>```<\/p>/g,
        '<div class="content-group"><button class="copy-code-hightlight-content">Copy</button>$1</div>'
      );
      temperaryContent = updatedContent;
      // setFileContent(updatedContent);
    })();
    (function RecognizeCodeBlock(){
      const updatedContent = temperaryContent.replace(
        /<pre.*?>([\s\S]*?)<\/pre>/g,
      '<div class="preview-code-block">$&<button class="copy-code-block-btn" >Copy</button></div>'
      );
      temperaryContent = updatedContent;
      // setFileContent(updatedContent);
    })();

    (function Handle_Image_Left_And_Content(){
      const updatedContent1 = temperaryContent.replace(
        /<p>```imageLeft_Content<\/p>([\s\S]*?)<p>close_imageLeft_Content```<\/p>/g,
      '<div class="image-left-content">$1</div>'
      );
      const updatedContent2 = updatedContent1.replace(
        /<p>`imageLeft<\/p>([\s\S]*?)<p>`<\/p>/g,
      '<div class="image-left">$1</div>'
      );
      const updatedContent3 = updatedContent2.replace(
        /<p>`contentRight<\/p>([\s\S]*?)<p>`<\/p>/g,
      '<div class="content-right">$1</div>'
      );
      temperaryContent = updatedContent3;
      // setFileContent(updatedContent3);
    })();

    (function Handle_Image_Right_And_Content(){
      const updatedContent1 = temperaryContent.replace(
        /<p>```imageRight_Content<\/p>([\s\S]*?)<p>close_imageRight_Content```<\/p>/g,
      '<div class="image-right-content">$1</div>'
      );
      const updatedContent2 = updatedContent1.replace(
        /<p>`imageRight<\/p>([\s\S]*?)<p>`<\/p>/g,
      '<div class="image-right">$1</div>'
      );
      const updatedContent3 = updatedContent2.replace(
        /<p>`contentLeft<\/p>([\s\S]*?)<p>`<\/p>/g,
      '<div class="content-left">$1</div>'
      );
      temperaryContent = updatedContent3;
      // setFileContent(updatedContent3);
    })();

    (function Handle_Image_In_Center_By_Horizontal(){
      const updatedContent = temperaryContent.replace(
        /<p>```imageInCenter_Horizontal<\/p>([\s\S]*?)<p>close_imageInCenter_Horizontal```<\/p>/g,
      '<div class="image-center-horizontal">$1</div>'
      );
      temperaryContent = updatedContent;
    })();

    (function Handle_Blockquote(){
      const updatedContent = temperaryContent.replace(
        /<p>```blockquote<\/p>([\s\S]*?)<p>close_blockquote```<\/p>/g,
      '<div class="custom-blockquote">$1</div>'
      );
      temperaryContent = updatedContent;
    })();

    return temperaryContent;
}
