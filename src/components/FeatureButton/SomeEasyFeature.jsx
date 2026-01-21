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

  // Generic function to insert emoji
  const insertEmoji = (quillRef, emoji) => {
    const quill = quillRef.current.getEditor();
    const selection = quill.getSelection();
    const position = selection ? selection.index : 0;
    quill.insertText(position, emoji);
  }

  // Emoji insert functions
  const insertWarning = (quillRef) => insertEmoji(quillRef, '⚠️');
  const insertCross = (quillRef) => insertEmoji(quillRef, '❌');
  const insertOne = (quillRef) => insertEmoji(quillRef, '1️⃣');
  const insertTwo = (quillRef) => insertEmoji(quillRef, '2️⃣');
  const insertBrain = (quillRef) => insertEmoji(quillRef, '🧠');
  const insertCheck = (quillRef) => insertEmoji(quillRef, '✅');
  const insertCheckMark = (quillRef) => insertEmoji(quillRef, '✔️');
  const insertFire = (quillRef) => insertEmoji(quillRef, '🔥');
  const insertPin = (quillRef) => insertEmoji(quillRef, '📌');
  const insertTarget = (quillRef) => insertEmoji(quillRef, '🎯');
  const insertDevil = (quillRef) => insertEmoji(quillRef, '😈');
  const insertFist = (quillRef) => insertEmoji(quillRef, '👊');
  const insertGoldMedal = (quillRef) => insertEmoji(quillRef, '🥇');
  const insertTrophy = (quillRef) => insertEmoji(quillRef, '🏆');
  const insertPointRight = (quillRef) => insertEmoji(quillRef, '👉');
  const insertMuscle = (quillRef) => insertEmoji(quillRef, '💪');
  const insertTestTube = (quillRef) => insertEmoji(quillRef, '🧪');
  const insertBomb = (quillRef) => insertEmoji(quillRef, '🧨');
  const insertBlueBook = (quillRef) => insertEmoji(quillRef, '📘');
  const insertKey = (quillRef) => insertEmoji(quillRef, '🔑');
  const insertRedCircle = (quillRef) => insertEmoji(quillRef, '🔴');
  const insertYellowCircle = (quillRef) => insertEmoji(quillRef, '🟡');
  const insertBlueCircle = (quillRef) => insertEmoji(quillRef, '🔵');
  const insertLightbulb = (quillRef) => insertEmoji(quillRef, '💡');
  const insertRocket = (quillRef) => insertEmoji(quillRef, '🚀');
  const insertMemo = (quillRef) => insertEmoji(quillRef, '📝');
  const insertRepeat = (quillRef) => insertEmoji(quillRef, '🔄');
  const insertAlert = (quillRef) => insertEmoji(quillRef, '🚨');
  const insertClipboard = (quillRef) => insertEmoji(quillRef, '📋');
  const insertPackage = (quillRef) => insertEmoji(quillRef, '📦');
  const insertParty = (quillRef) => insertEmoji(quillRef, '🎉');
  const insertBooks = (quillRef) => insertEmoji(quillRef, '📚');
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

  function Image_In_Center_By_Horizontal (quillRef) {
    const quill = quillRef.current.getEditor();
    const selection = quill.getSelection();
    const position = selection ? selection.index : 0;
    
    // At current cursor, down line
    quill.insertText(position, "\n", "text", true);
    // Write opening tag: ```imageInCenter_Horizontal
    quill.insertText(position + 1, "```imageInCenter_Horizontal" + "\n", "text", true);
    // Create empty line for image (cursor will be here)
    quill.insertText(position + 30, "\n", "text", true);
    // Set cursor at empty line for importing picture
    quill.setSelection(position + 30, 0);
    // Insert closing tag on next line
    quill.insertText(position + 31, "close_imageInCenter_Horizontal```" + "\n", "text", true);
  }

  function InsertBlockquote (quillRef) {
    const quill = quillRef.current.getEditor();
    const selection = quill.getSelection();
    const position = selection ? selection.index : 0;
    
    // At current cursor, down line
    quill.insertText(position, "\n", "text", true);
    // Write opening tag: ```blockquote
    quill.insertText(position + 1, "```blockquote" + "\n", "text", true);
    // Create empty line for content (cursor will be here)
    quill.insertText(position + 15, "\n", "text", true);
    // Set cursor at empty line for typing content
    quill.setSelection(position + 15, 0);
    // Insert closing tag on next line
    quill.insertText(position + 16, "close_blockquote```" + "\n", "text", true);
  }
  

  export {
    insertHeart, 
    insertStart, 
    HightlightContent, 
    Image_Left_And_Content, 
    Image_Right_And_Content, 
    Image_In_Center_By_Horizontal,
    InsertBlockquote,
    TestStyle, 
    TestAddTagHTML,
    insertWarning,
    insertCross,
    insertOne,
    insertTwo,
    insertBrain,
    insertCheck,
    insertCheckMark,
    insertFire,
    insertPin,
    insertTarget,
    insertDevil,
    insertFist,
    insertGoldMedal,
    insertTrophy,
    insertPointRight,
    insertMuscle,
    insertTestTube,
    insertBomb,
    insertBlueBook,
    insertKey,
    insertRedCircle,
    insertYellowCircle,
    insertBlueCircle,
    insertLightbulb,
    insertRocket,
    insertMemo,
    insertRepeat,
    insertAlert,
    insertClipboard,
    insertPackage,
    insertParty,
    insertBooks
  };