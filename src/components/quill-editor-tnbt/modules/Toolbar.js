// import IconAlignLeft from "../assets/align-left.svg"
// import IconAlignCenter from '../assets/align-center.svg';
// import IconAlignRight from '../assets/align-right.svg';
// import LeftHalf from '../assets/located-left-half.svg';
// import RightHalf from '../assets/located-right-half.svg';
import { BaseModule } from './BaseModule';
import { IconAlignCenter, IconAlignRight, IconAlignLeft, LocatedLeftHalf, LocatedRightHalf } from './Icons';
let Parchment = {};
let FloatStyle = {};
let MarginStyle = {};
let DisplayStyle = {};

export class Toolbar extends BaseModule {
    
    onCreate = (parchment) => {
        // Initilize styles
        Parchment = parchment;
        FloatStyle = new Parchment.Attributor.Style('float', 'float');
        MarginStyle = new Parchment.Attributor.Style('margin', 'margin');
        DisplayStyle = new Parchment.Attributor.Style('display', 'display');

        // Setup Toolbar
        this.toolbar = document.createElement('div');
        Object.assign(this.toolbar.style, this.options.toolbarStyles);
        this.overlay.appendChild(this.toolbar);

        // Setup Buttons
        this._defineAlignments();
        this._addToolbarButtons();
    };

	// The toolbar and its children will be destroyed when the overlay is removed
    onDestroy = () => {};

	// Nothing to update on drag because we are are positioned relative to the overlay
    onUpdate = () => {};

    getCurrentQLEditorScreen = () => {
        const editorElement = document.querySelector('.ql-editor');
        if (editorElement) {
          const widthCurrentBox = editorElement.clientWidth;
          const heightCurrentBox = editorElement.clientHeight;
          console.log('Width:', widthCurrentBox, 'Height:', heightCurrentBox);
          return {widthCurrentBox, heightCurrentBox}
        }
    }

    _defineAlignments = () => {
        const {widthCurrentBox, heightCurrentBox} = this.getCurrentQLEditorScreen();
        this.alignments = [
            {
                icon: IconAlignLeft,
                apply: () => {
                    DisplayStyle.add(this.img, 'inline');
                    FloatStyle.add(this.img, 'left');
                    MarginStyle.add(this.img, '0 1em 1em 0');
                },
                isApplied: () => FloatStyle.value(this.img) == 'left',
            },
            {
                icon: IconAlignCenter,
                apply: () => {
                    DisplayStyle.add(this.img, 'block');
                    FloatStyle.remove(this.img);
                    MarginStyle.add(this.img, 'auto');
                },
                isApplied: () => MarginStyle.value(this.img) == 'auto',
            },
            {
                icon: IconAlignRight,
                apply: () => {
                    DisplayStyle.add(this.img, 'inline');
                    FloatStyle.add(this.img, 'right');
                    MarginStyle.add(this.img, '0 0 1em 1em');
                },
                isApplied: () => FloatStyle.value(this.img) == 'right',
            },
            {
                icon: LocatedLeftHalf,
                apply: () => {
                    DisplayStyle.add(this.img, 'inline');
                    FloatStyle.add(this.img, 'left');
                    MarginStyle.add(this.img, '0 50% 1em 0');
                },
                isApplied: () => FloatStyle.value(this.img) == 'left',
            },
            {
                icon: LocatedRightHalf,
                apply: () => {
                    DisplayStyle.add(this.img, 'inline');
                    FloatStyle.add(this.img, 'right');
                    MarginStyle.add(this.img, '0 0 1em 50%');
                },
                isApplied: () => FloatStyle.value(this.img) == 'right',
            },
        ];
    };
    // _addToolbarButtons = () => {
    //     const buttons = [];
    //     this.alignments.forEach((alignment, idx) => {
    //         const button = document.createElement('span');
    //         buttons.push(button);
    
    //         // Create an SVG element and set its innerHTML to the SVG code
    //         const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    //         svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    //         svgElement.setAttribute('width', '24');
    //         svgElement.setAttribute('height', '24');
    //         // svgElement.innerHTML = alignment.icon;
    
    //         // Append the SVG element to the button
    //         button.appendChild(svgElement);
    
    //         button.addEventListener('click', () => {
    //             // deselect all buttons
    //             buttons.forEach(button => button.style.filter = '');
    //             if (alignment.isApplied()) {
    //                 // If applied, unapply
    //                 FloatStyle.remove(this.img);
    //                 MarginStyle.remove(this.img);
    //                 DisplayStyle.remove(this.img);
    //             } else {
    //                 // otherwise, select button and apply
    //                 this._selectButton(button);
    //                 alignment.apply();
    //             }
    //             // image may change position; redraw drag handles
    //             this.requestUpdate();
    //         });
    
    //         Object.assign(button.style, this.options.toolbarButtonStyles);
    //         if (idx > 0) {
    //             button.style.borderLeftWidth = '0';
    //         }
    //         Object.assign(button.children[0].style, this.options.toolbarButtonSvgStyles);
    //         if (alignment.isApplied()) {
    //             // select button if previously applied
    //             this._selectButton(button);
    //         }
    //         this.toolbar.appendChild(button);
    //     });
    // };
    
    _addToolbarButtons = () => {
		const buttons = [];
		this.alignments.forEach((alignment, idx) => {
			const button = document.createElement('span');
			buttons.push(button);
            button.innerHTML = alignment.icon
			button.addEventListener('click', () => {
					// deselect all buttons
				buttons.forEach(button => button.style.filter = '');
				if (alignment.isApplied()) {
						// If applied, unapply
					FloatStyle.remove(this.img);
					MarginStyle.remove(this.img);
					DisplayStyle.remove(this.img);
				}				else {
						// otherwise, select button and apply
					this._selectButton(button);
					alignment.apply();
				}
					// image may change position; redraw drag handles
				this.requestUpdate();
			});
			Object.assign(button.style, this.options.toolbarButtonStyles);
			if (idx > 0) {
				button.style.borderLeftWidth = '0';
			}
            Object.assign(button.style, this.options.toolbarButtonSvgStyles);
			if (alignment.isApplied()) {
					// select button if previously applied
				this._selectButton(button);
			}
			this.toolbar.appendChild(button);
		});
    };

    _selectButton = (button) => {
		button.style.filter = 'invert(20%)';
    };
}
