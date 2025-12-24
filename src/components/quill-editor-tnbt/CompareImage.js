// CompareImage.js
class CompareImage {
    constructor(props){
        this.boxImage = null;
        this.imageBox1 = null;
        this.imageBox2 = null;
        this.quillRef = null;
    }
    // static test() {
    //   console.log('hello');
    //   // Perform the desired action here
    // }
    // hello () {
    //     console.log('test');
    // }
    setQuillRef(quillRef) {
        this.quillRef = quillRef;
    }
    addImageBox(){
        const qlEditor = document.querySelector('.ql-editor');
        const boxImage = document.createElement('p');
        boxImage.classList.add('box-image');

        //create button choose image 1 and its box.

        const titleButton1 = document.createElement('strong');
        titleButton1.classList.add("choose-image-button")
        titleButton1.innerHTML = "Choose image";
        // boxImage.appendChild(titleButton1)
        const spanBox1 = document.createElement('strong');
        spanBox1.classList.add('image-span');
        spanBox1.classList.add('span-box-1');
        spanBox1.appendChild(titleButton1)
        boxImage.appendChild(spanBox1);

        //create button choose image 2 and its box.
        const titleButton2 = document.createElement('b');
        titleButton2.classList.add("choose-image-button")
        titleButton2.innerHTML = "Choose image";
        const spanBox2 = document.createElement('strong');
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
    
    addBoxImage() {
        const qlEditor = document.querySelector('.ql-editor');
        const boxImage = document.createElement('p');
        boxImage.classList.add('box-image');
        boxImage.style.margin = "10px 0";
        // boxImage.contentEditable = false;
        this.boxImage = boxImage;
    
        if (qlEditor) {
            console.log('addBox');
            qlEditor.appendChild(boxImage);
        }
    }
    getCurrentSelection(){
        console.log('e',);
          if(this.quillRef.current){
          const quill = this.quillRef.current.getEditor();
          const selection = quill.getSelection();
          const position = selection ? selection.index : 0;
          console.log('selection.index',selection ? selection.index : 0);
          quill.insertText(position + 4, "\n", "text", true)
        }
      }
    addBox1() {
        if (this.boxImage) {

            // Create button choose image 1 and its box.
            const titleButton1 = document.createElement('strong');
            titleButton1.classList.add("choose-image-button");
            titleButton1.innerHTML = "Choose image";
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
                    this.boxImage.insertBefore(imgContainPicture, this.boxImage.firstChild);
                    this.boxImage.removeChild(this.imageBox1);
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
                    this.boxImage.appendChild(imgContainPicture);
                    this.boxImage.removeChild(this.imageBox2);
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
    
  }
  
  export default CompareImage;
  