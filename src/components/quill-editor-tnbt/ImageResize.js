import defaultsDeep from 'lodash/defaultsDeep';
import DefaultOptions from './DefaultOptions';
import { DisplaySize } from './modules/DisplaySize';
import { Toolbar } from './modules/Toolbar';
import { ImageToolbarCus } from './modules/ImageToolbarCus';
import { Resize } from './modules/Resize';

const knownModules = { DisplaySize, Toolbar, Resize, ImageToolbarCus };

/**
 * Custom module for quilljs to allow user to resize <img> elements
 * (Works on Chrome, Edge, Safari and replaces Firefox's native resize behavior)
 * @see https://quilljs.com/blog/building-a-custom-module/
 */
export default class ImageResize {

    constructor(quill, options = {}) {
        // save the quill reference and options
        this.quill = quill;

        // Apply the options to our defaults, and stash them for later
        // defaultsDeep doesn't do arrays as you'd expect, so we'll need to apply the classes array from options separately
        let moduleClasses = false;
        if (options.modules) {
            moduleClasses = options.modules.slice();
        }

        if (options.parchment) {
            this.parchment = options.parchment;
        }

        // Apply options to default options
        this.options = defaultsDeep({}, options, DefaultOptions);

        // (see above about moduleClasses)
        if (moduleClasses !== false) {
            this.options.modules = moduleClasses;
        }

        // disable native image resizing on firefox
        document.execCommand('enableObjectResizing', false, 'false');

        // respond to clicks inside the editor
        this.quill.root.addEventListener('click', this.handleClick, false);

        this.quill.root.parentNode.style.position = this.quill.root.parentNode.style.position || 'relative';

        // setup modules
        this.moduleClasses = this.options.modules;

        this.modules = [];
    }

    initializeModules = () => {
        this.removeModules();

        this.modules = this.moduleClasses.map(
            ModuleClass => new (knownModules[ModuleClass] || ModuleClass)(this),
        );

        this.modules.forEach(
            (module) => {
                module.onCreate(this.parchment);
            },
        );

        this.onUpdate();
        this.overlay.classList.add("abcde")
    };

    onUpdate = () => {
        this.repositionElements();
        this.modules.forEach(
            (module) => {
                module.onUpdate();
            },
        );
    };

    removeModules = () => {
        this.modules.forEach(
            (module) => {
                module.onDestroy();
            },
        );

        this.modules = [];
    };

    handleClick = (evt) => {

        if (evt.target && evt.target.tagName && evt.target.tagName.toUpperCase() === 'IMG') {
            console.log('2');
            if (this.img === evt.target) {
                // we are already focused on this image
                console.log('4');
                return;
            }
            if (this.img) {
                // we were just focused on another image
                console.log('5');
                this.hide();
            }
            // clicked on an image inside the editor
            this.show(evt.target);
        } else if (this.img) {
            console.log('3');
            // clicked on a non image
            this.hide();
        }
    };

    show = (img) => {
        // keep track of this img element
        this.img = img;
        console.log('1');
        if(this.img && (this.img.alt  === "pic-1" || this.img.alt  === "pic-2")){
            console.log('this.img', this.img.alt);
            return;
        }
        this.showOverlay();

        this.initializeModules();
    };

    showOverlay = () => {
        if (this.overlay) {
            this.hideOverlay();
        }


        this.quill.setSelection(null);

        // prevent spurious text selection
        this.setUserSelect('none');

        // listen for the image being deleted or moved
        document.addEventListener('keyup', this.checkImage, true);
        this.quill.root.addEventListener('input', this.checkImage, true);

        // Create and add the overlay
        this.overlay = document.createElement('div');
        Object.assign(this.overlay.style, this.options.overlayStyles);

        this.quill.root.parentNode.appendChild(this.overlay);

        this.repositionElements();
    };

    hideOverlay = () => {
        if (!this.overlay) {
            return;
        }

        // Remove the overlay
        this.quill.root.parentNode.removeChild(this.overlay);
        this.overlay = undefined;

        // stop listening for image deletion or movement
        document.removeEventListener('keyup', this.checkImage);
        this.quill.root.removeEventListener('input', this.checkImage);

        // reset user-select
        this.setUserSelect('');
    };
    getCurrentQLEditorScreen = () => {
        // get img current size
        const imgCurrentWidth = this.img.width;
        const imgCurrentHeight = Math.round((this.img.width / this.img.naturalWidth) * this.img.naturalHeight);
        const imgRatioSize = imgCurrentWidth / imgCurrentHeight;

        const editorElement = document.querySelector('.ql-editor');
        if (editorElement) {
          const widthCurrentBox = editorElement.clientWidth;
          const heightCurrentBox = editorElement.clientHeight;
          console.log('Width:', widthCurrentBox, 'Height:', heightCurrentBox);
          return {widthCurrentBox, heightCurrentBox, imgRatioSize}
        }
    }
    repositionElements = () => {
        const {widthCurrentBox, heightCurrentBox, imgRatioSize} = this.getCurrentQLEditorScreen();
        if (!this.overlay || !this.img) {
            return;
        }

        // position the overlay over the image
        const parent = this.quill.root.parentNode;
        const imgRect = this.img.getBoundingClientRect();
        const containerRect = parent.getBoundingClientRect();

        // Object.assign(this.overlay.style, {
        //     left: `${imgRect.left - containerRect.left - 1 + parent.scrollLeft}px`,
        //     top: `${imgRect.top - containerRect.top + parent.scrollTop}px`,
        //     width: `${imgRect.width}px`,
        //     height: `${imgRect.height}px`,
        // });
        if(this.img.style.marginLeft === "50%" || this.img.style.marginRight === "50%"){
            const halfWidth = widthCurrentBox / 2;
            const halfHeight = halfWidth / imgRatioSize;
            Object.assign(this.overlay.style, {
                left: `${imgRect.left - containerRect.left - 1 + parent.scrollLeft}px`,
                top: `${imgRect.top - containerRect.top + parent.scrollTop}px`,
                width: `${halfWidth}px`,
                height: `${halfHeight}px`,
            });
            if(this.img.style.marginLeft === "50%"){
                console.log('marginLeft');
                Object.assign(this.overlay.style, {
                    left: `${halfWidth - 15}px`,
                    top: `${imgRect.top - containerRect.top + parent.scrollTop}px`,
                    width: `${halfWidth}px`,
                    height: `${halfHeight}px`,
                });
            } else {
                console.log('marginRight');
                Object.assign(this.overlay.style, {
                    top: `${imgRect.top - containerRect.top + parent.scrollTop}px`,
                    width: `${halfWidth}px`,
                    height: `${halfHeight}px`,
                });
            }
        } else {
            Object.assign(this.overlay.style, {
            left: `${imgRect.left - containerRect.left - 1 + parent.scrollLeft}px`,
            top: `${imgRect.top - containerRect.top + parent.scrollTop}px`,
            width: `${imgRect.width}px`,
            height: `${imgRect.height}px`,
         });
        }
    };

    hide = () => {
        this.hideOverlay();
        this.removeModules();
        this.img = undefined;
    };

    setUserSelect = (value) => {
        [
            'userSelect',
            'mozUserSelect',
            'webkitUserSelect',
            'msUserSelect',
        ].forEach((prop) => {
            // set on contenteditable element and <html>
            this.quill.root.style[prop] = value;
            document.documentElement.style[prop] = value;
        });
    };

    checkImage = (evt) => {
        if (this.img) {
            if (evt.keyCode == 46 || evt.keyCode == 8) {
                window.Quill.find(this.img).deleteAt(0);
            }
            this.hide();
        }
    };

}

if (window.Quill) {
    window.Quill.register('modules/imageResize', ImageResize);
}
