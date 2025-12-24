const HightlightContent = (quillRef) => {
    const quill = quillRef.current.getEditor();
    const selection = quill.getSelection();
    const position = selection ? selection.index : 0;
    // Line 1: Insert the text "```content```" on the current line
    quill.insertText(position, "\n", "text", true)
    quill.insertText(position + 1, "```content" + "\n", "text", true);
  
    // Line 2: Move the cursor to a specific position (adjust the position as needed)
    quill.setSelection(position + 12, 0);
  
    // Line 3: Insert the text "```" on a new line
    quill.insertText(position + 13, "```" + "\n", "text", true);
  };
  
  const TestStyle = (quillRef) => {
    const quill = quillRef.current.getEditor();
    const selection = quill.getSelection();
    const position = selection ? selection.index : 0;
    // Line 1: Insert the text "```content```" on the current line
    quill.insertText(position, "♥", {
      'color': 'red',
      'italic': true,
    });
  
  }
  const TestAddTagHTML = (quillRef) => {
    const quill = quillRef.current.getEditor();
    const selection = quill.getSelection();
    const position = selection ? selection.index : 0;
      const content = '<pre class="ql-test" data-custom-class="ql-test">Content</pre>';
      quill.clipboard.dangerouslyPasteHTML(position, content);
  };
  const insertStart = (quillRef) => {
    const quill = quillRef.current.getEditor();
    const selection = quill.getSelection();
    const position = selection ? selection.index : 0;
    // Line 1: Insert the text "```content```" on the current line
    quill.insertText(position, '★', {
      'color': 'yellowgreen',
    });
  }
  const insertHeart = (quillRef) => {
    const quill = quillRef.current.getEditor();
    const selection = quill.getSelection();
    const position = selection ? selection.index : 0;
    // Line 1: Insert the text "```content```" on the current line
    quill.insertText(position, '♥', {
      'color': 'red',
    });
  }
  function Image_Left_And_Content (quillRef){
    const quill = quillRef.current.getEditor();
    const selection = quill.getSelection();
    const position = selection ? selection.index : 0;
  
    // At current cursor, down line
    quill.insertText(position, "\n", "text", true)
    // write this text and 
    quill.insertText(position + 1, "```imageLeft_Content" + "\n", "text", true); // 20
    // at position + 21 downline and write "`imageLeft"
    quill.insertText(position + 21, "\n" + "`imageLeft" + "\n", "text", true); // 10
    // at position + 33 create empty line
    quill.insertText(position + 33, "\n", "text", true)
    // set cursor at here for import picture first
    quill.setSelection(position + 33, 0);
    // downline and write this symbol
    quill.insertText(position + 34,"`" + "\n", "text", true);
    // downline and write this "`contentRight"
    quill.insertText(position + 36, "`contentRight" + "\n", "text", true); // 13
    //create a space between "`contentRight" and "`"
    quill.insertText(position + 50, "\n", "text", true)
    quill.insertText(position + 51, "`", "text", true);
    // downline and close block-content
    quill.insertText(position + 53, "close_imageLeft_Content```" + "\n", "text", true);
  }
  function Image_Right_And_Content (quillRef) {
    const quill = quillRef.current.getEditor();
    const selection = quill.getSelection();
    const position = selection ? selection.index : 0;
  
    // At current cursor, down line
    quill.insertText(position, "\n", "text", true)
    // write this text and 
    quill.insertText(position + 1, "```imageRight_Content" + "\n", "text", true); // 21
    // at position + 21 downline and write "`imageLeft"
    quill.insertText(position + 22, "\n" + "`contentLeft" + "\n", "text", true); // 12
    // at position + 33 create empty line
    quill.insertText(position + 36, "\n", "text", true)
    // set cursor at here for import picture first
    quill.setSelection(position + 36, 0);
    // downline and write this symbol
    quill.insertText(position + 37,"`" + "\n", "text", true);
    // downline and write this "`contentRight"
    quill.insertText(position + 39, "`imageRight" + "\n", "text", true); // 11
    //create a space between "`contentRight" and "`"
    quill.insertText(position + 51, "\n", "text", true)
    quill.insertText(position + 52, "`", "text", true);
    // // downline and close block-content
    quill.insertText(position + 54, "close_imageRight_Content```" + "\n", "text", true);
  }
  

  export {insertHeart, insertStart, HightlightContent, Image_Left_And_Content, Image_Right_And_Content}