import React ,{ Component, useRef, createRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from "./ImageResize"
import CompareImage2 from './CompareImage2';
import './styles.css';

const instanceCompareImage = new CompareImage2();
Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/compareImage', instanceCompareImage);
/*
 * Simple editor component that takes placeholder text as a prop
 */
class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = { editorHtml: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleCompareImageClick = this.handleCompareImageClick.bind(this);
    this.quillRef = createRef(null);
    instanceCompareImage.setQuillRef(this.quillRef);
  }
  handleChange(html) {
    this.setState({ editorHtml: html });
  }
  handleCompareImageClick() {
    const boxImageTest = document.querySelectorAll('.box-image-test');
    if(boxImageTest.length !== 1){
      instanceCompareImage.addBoxImage();
      instanceCompareImage.addBox1()
      instanceCompareImage.exitBoxImageChoose();
      instanceCompareImage.addBox2();     
    } else {
      console.log('You have added this box');
    }
  }
  getCurrentSelection(){
    console.log('e',);
      if(this.quillRef.current){
      const quill = this.quillRef.current.getEditor();
      const selection = quill.getSelection();
      const position = selection ? selection.index : 0;
      console.log('selection.index',selection ? selection.index : 0);
      quill.insertText(position + 25, "\n", "text", true)
      quill.setSelection(quill.getLength(), 0);
    }
  }
  goTop(){
    if (this.quillRef.current) {
      const quill = this.quillRef.current.getEditor();
      
      // Set the selection to the end of the content
      quill.setSelection(0, 0);
      
      // Get the scrolling container
      const scrollElement = document.scrollingElement || document.body;
      scrollElement.scrollTop = 0;
    }
  }
  goEnd() {
    if (this.quillRef.current) {
      const quill = this.quillRef.current.getEditor();
      
      // Set the selection to the end of the content
      quill.setSelection(quill.getLength(), 0);
      
      // Get the scrolling container
      const scrollElement = document.scrollingElement || document.body;
      scrollElement.scrollTop = scrollElement.scrollHeight;

    }
  }
  render() {
    return (
      <div>
        <div className='top-and-bottom'>
          <div><button onClick={() => this.goTop()} className='go-top'>Top</button></div>
          <div><button onClick={() => this.goEnd()} className='go-end'>End</button></div>
        </div>
        <div id="toolbar">
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
          <select className="ql-align" />
          <select className="ql-color" />
          <select className="ql-background" />
        </span>
        <span className="ql-formats">
          <button className="ql-formula" />
          <button className="ql-code-block" />
          <button className="ql-clean"/>
          <button className='ql-image' />
        </span>
        <span className="ql-formats">
          <button className="ql-compareImage" >
            <svg  x="0px" y="0px" width="18px" height="18px" viewBox="0 0 98.327 98.327" >
              <g>
              	<path d="M96.064,11.098H15.578c-1.249,0-2.261,1.012-2.261,2.261v11.057H2.261C1.012,24.416,0,25.428,0,26.677v58.292
              		c0,1.249,1.013,2.261,2.261,2.261h80.488c1.248,0,2.261-1.012,2.261-2.261V73.91h11.057c1.248,0,2.261-1.012,2.261-2.261V13.357
              		C98.327,12.108,97.314,11.098,96.064,11.098z M75.193,17.581c4.771,0,8.639,3.867,8.639,8.638s-3.868,8.637-8.639,8.637
              		s-8.637-3.867-8.637-8.637C66.557,21.448,70.423,17.581,75.193,17.581z M77.629,80.08l-70.25-0.021
              		c0.284-6.229,2.467-16.201,5.938-24.424v16.015c0,1.249,1.013,2.261,2.261,2.261h59.289C75.872,76.164,77.374,79.172,77.629,80.08z
              		 M20.697,66.742c0.444-9.767,5.549-28.744,12.985-35.736C40.341,24.792,46,30.229,50.44,36.556
              		c4.106,5.882,7.681,11.084,10.691,14.354c4.957,4.957,9.191-2.557,14.391-5.032c7.574-3.607,13.816,15.149,15.426,20.886
              		L20.697,66.742z"/>
              </g>
            </svg>
          </button>
        </span>
        <span>
          <button onClick={this.getCurrentSelection}>
            index
          </button>
        </span>

        </div>
        <ReactQuill
          ref={this.quillRef}
          theme={this.state.theme}
          onChange={this.handleChange}
          value={this.state.editorHtml}
          modules={Editor.modules}
          formats={Editor.formats}
          bounds={'#root'}
          placeholder={this.props.placeholder}
        />
         <button onClick={() => this.getCurrentSelection()}>Get Selection</button>
      </div>
    );
  }
}

/*
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
Editor.modules = {
  toolbar: {
    container:'#toolbar',
    handlers: {
      'compareImage': Editor.prototype.handleCompareImageClick,
    },
  },
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false
  },
  imageResize: {
    parchment: Quill.import('parchment'),
    modules: ['Resize', 'DisplaySize', 'Toolbar']
  }
};

/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
Editor.formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
  'compareImage', // Add CompareImage format
];

export default Editor;
