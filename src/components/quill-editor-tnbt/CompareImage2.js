// CompareImage.js
class CompareImage2 {
    constructor(){
        this.boxImage = null;
        this.boxImageInEditor = null;
        this.pContainer = null;
        this.quillRef = null;
    }
    show(){
        console.log('a', this.a);
    }
    addImageBox(){
        const qlEditor = document.querySelector('.ql-container');
        const boxImage = document.createElement('div');
        boxImage.classList.add('box-image-test');

        //create button choose image 1 and its box.

        const titleButton1 = document.createElement('button');
        titleButton1.classList.add("choose-image-button")
        titleButton1.innerHTML = "Choose image";
        // boxImage.appendChild(titleButton1)
        const spanBox1 = document.createElement('div');
        spanBox1.classList.add('image-span');
        spanBox1.classList.add('span-box-1');
        spanBox1.appendChild(titleButton1)
        boxImage.appendChild(spanBox1);

        //create button choose image 2 and its box.
        const titleButton2 = document.createElement('button');
        titleButton2.classList.add("choose-image-button")
        titleButton2.innerHTML = "Choose image";
        const spanBox2 = document.createElement('div');
        spanBox2.classList.add('image-span');
        spanBox2.classList.add('span-box-2');
        spanBox2.appendChild(titleButton2)
        boxImage.appendChild(spanBox2);
        
        // const imageInput = document.createElement('input');
        // imageInput.classList.add("image-input");
        // imageInput.type = "file";
        // boxImage.appendChild(imageInput)
        if(qlEditor){
            console.log('addBox');
            qlEditor.appendChild(boxImage);
        }
    }
    setQuillRef(quillRef) {
        this.quillRef = quillRef;
    }
    addBoxImage() {
        const qlContainer = document.querySelector('.ql-container');
        const boxConatainer = document.createElement('div');
        boxConatainer.classList.add('box-image-test');
        boxConatainer.contentEditable = false;
        this.boxImage = boxConatainer;

        const qlEditor = document.querySelector('.ql-editor');
        const boxImage = document.createElement('p');
        boxImage.classList.add("container-both-image")
        this.boxImageInEditor = boxImage;
    
        if (qlContainer) {
            console.log('addBox');
            qlContainer.appendChild(boxConatainer);
        }
        if(qlEditor){
            qlEditor.appendChild(boxImage)
            this.pContainer = boxImage;
        }
    }
    
    addBox1() {
        if (this.boxImage) {

            // Create button choose image 1 and its box.
            const titleButton1 = document.createElement('strong');
            titleButton1.classList.add("choose-image-button");
            titleButton1.innerHTML = "Choose image";
            titleButton1.style.left = 0;
            titleButton1.contentEditable = false;

            // Create input element for file selection
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.style.display = 'none'; // Hide the file input
            
            // Add an event listener to the "Choose Image" button
            titleButton1.addEventListener('click', () => {
                // Trigger the file input when the button is clicked
                fileInput.click();
            });
        
            // Add an event listener to handle file selection
            fileInput.addEventListener('change', (event) => {
                const qlEditor = document.querySelector(".ql-editor");
                const widthQlEditor = qlEditor.clientWidth;

                const selectedFile = event.target.files[0];
                // Handle the selected file as needed (e.g., display or upload)
                console.log('Selected File:', selectedFile);
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    
                    let imageRatio = 1;
                    img.onload = () => {
                        const originalWidth = img.width;
                        const originalHeight = img.height;
                        imageRatio = originalWidth / originalHeight;
    
                        // Now you have the original width and height
                        console.log('Original Width:', originalWidth);
                        console.log('Original Height:', originalHeight);
                    };
                    const imgContainPicture = document.createElement('img');
                    const maxImgWidth = (widthQlEditor - 30) / 2;
                    const maxImgHeight = maxImgWidth / imageRatio;

                    imgContainPicture.style.width = `${maxImgWidth}px`;
                    imgContainPicture.style.height = `${maxImgHeight}px`;
                    imgContainPicture.src = e.target.result; // Set the src to the data URL
                    imgContainPicture.alt = "pic-1";
                     // Insert the imgContainPicture at the beginning of this.boxImage
                    // console.log('count', this.boxImage.childElementCount);
                    // const pContainerBothImage = document.querySelector()
                    if(this.pContainer.childElementCount === 1){
                        this.pContainer.appendChild(imgContainPicture);
                    } else {
                        this.pContainer.insertBefore(imgContainPicture, this.boxImage.firstChild);
                    }
                    // this.boxImage.removeChild(this.imageBox1);
                    titleButton1.innerHTML = "Inserted";
                    titleButton1.style.pointerEvents = "none";
                    titleButton1.style.cursor = "not-allowed";
                    titleButton1.style.backgroundColor = "gray";
                    const imgElements = this.pContainer.querySelectorAll('img');
                    if(imgElements.length === 2 ){
                        while (this.boxImage.firstChild) {
                            this.boxImage.removeChild(this.boxImage.firstChild);
                        }
                        // Assuming this.boxImage has a parent node
                        const parentNode = this.boxImage.parentNode;

                        // Remove this.boxImage from its parent node
                        if (parentNode) {
                          parentNode.removeChild(this.boxImage);
                          console.log('all removed');
                        } else {
                          console.log('No parent node found for this.boxImage');
                        }
                    }
                };
            
                // Read the contents of the file as a data URL
                reader.readAsDataURL(selectedFile);
            });
    
            const imageBox1 = document.createElement('strong');
            imageBox1.contentEditable = false;
            this.imageBox1 = imageBox1;
            imageBox1.classList.add('image-span');
            imageBox1.classList.add('span-box-1');
            imageBox1.appendChild(titleButton1);
    
            this.boxImage.appendChild(imageBox1);
        }
    }
    
    addBox2() {
        if (this.boxImage) {
            // Create button choose image 2 and its box.
            const titleButton2 = document.createElement('em');
            titleButton2.classList.add("choose-image-button");
            titleButton2.innerHTML = "Choose image";
            titleButton2.style.right = 0;
            titleButton2.contentEditable = false;

            // Create input element for file selection
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.style.display = 'none'; // Hide the file input
            
            // Add an event listener to the "Choose Image" button
            titleButton2.addEventListener('click', () => {
                // Trigger the file input when the button is clicked
                fileInput.click();
            });
        
            // Add an event listener to handle file selection
            fileInput.addEventListener('change', (event) => {
                const qlEditor = document.querySelector(".ql-editor");
                const widthQlEditor = qlEditor.clientWidth;
                
                const selectedFile = event.target.files[0];
                // Handle the selected file as needed (e.g., display or upload)
                console.log('Selected File:', selectedFile);
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    
                    let imageRatio = 1;
                    img.onload = () => {
                        const originalWidth = img.width;
                        const originalHeight = img.height;
                        imageRatio = originalWidth / originalHeight;
    
                        // Now you have the original width and height
                        console.log('Original Width:', originalWidth);
                        console.log('Original Height:', originalHeight);
                    };
                    const imgContainPicture = document.createElement('img');
                    const maxImgWidth = (widthQlEditor - 30) / 2;
                    const maxImgHeight = maxImgWidth / imageRatio;

                    imgContainPicture.style.width = `${maxImgWidth}px`;
                    imgContainPicture.style.height = `${maxImgHeight}px`;
                    
                    imgContainPicture.src = e.target.result; // Set the src to the data URL
                    imgContainPicture.alt = "pic-2";
                     // Insert the imgContainPicture at the beginning of this.boxImage
                    this.boxImageInEditor.appendChild(imgContainPicture);
                    // this.boxImageInEditor.removeChild(this.imageBox2);
                    titleButton2.innerHTML = "Inserted";
                    titleButton2.style.pointerEvents = "none";
                    titleButton2.style.cursor = "not-allowed";
                    titleButton2.style.backgroundColor = "gray";
                    const imgElements = this.pContainer.querySelectorAll('img');
                    if(imgElements.length === 2 ){
                        while (this.boxImage.firstChild) {
                            this.boxImage.removeChild(this.boxImage.firstChild);
                          }

                        // Assuming this.boxImage has a parent node
                        const parentNode = this.boxImage.parentNode;
                                    
                        // Remove this.boxImage from its parent node
                        if (parentNode) {
                          parentNode.removeChild(this.boxImage);
                          console.log('all removed');
                        } else {
                          console.log('No parent node found for this.boxImage');
                        }
                    }
                };

                // Read the contents of the file as a data URL
                reader.readAsDataURL(selectedFile);
            });
    
            const imageBox2 = document.createElement('em');
            imageBox2.contentEditable = false;
            this.imageBox2 = imageBox2;
            imageBox2.classList.add('image-span');
            imageBox2.classList.add('span-box-2');
            imageBox2.appendChild(titleButton2);
    
            this.boxImage.appendChild(imageBox2);
        }
    }
    exitBoxImageChoose(){
        if (this.boxImage) {
            const exitButton = document.createElement('p');
            exitButton.classList.add("exit-choose-image-button");
            exitButton.innerHTML = "&#10005;";

            exitButton.addEventListener('click',() => {
                  // Remove all child elements
                while (this.boxImage.firstChild) {
                  this.boxImage.removeChild(this.boxImage.firstChild);
                }
                  // Assuming this.boxImage has a parent node
                const parentNode = this.boxImage.parentNode;

                // Remove this.boxImage from its parent node
                if (parentNode) {
                  parentNode.removeChild(this.boxImage);
                  console.log('all removed');
                } else {
                  console.log('No parent node found for this.boxImage');
                }
                console.log('all remove');

                // Bring cursor to the end of document.
                if(this.quillRef.current){
                    console.log('exit', "quill-true");
                    const quill = this.quillRef.current.getEditor();
                    const selection = quill.getSelection();
                    const position = selection ? selection.index : 0;
                    console.log('selection.index',selection ? selection.index : 0);
                    quill.insertText(position + 25, "\n", "text", true)
                    quill.setSelection(quill.getLength(), 0);
                }
            })
            this.boxImage.appendChild(exitButton)
        }
    }

  }
  
  export default CompareImage2;
  