import { BaseModule } from './BaseModule';
import { Resize } from './Resize';
export class DisplaySize extends BaseModule {
    onCreate = () => {
        // Create the container to hold the size display
        this.display = document.createElement('div');
        this.display.classList.add("hello")

        // Apply styles
        Object.assign(this.display.style, this.options.displayStyles);

        // Attach it
        this.overlay.appendChild(this.display);
    };

    onDestroy = () => {};

    getCurrentQLEditorScreen = () => {
        const editorElement = document.querySelector('.ql-editor');
        if (editorElement) {
          const widthCurrentBox = editorElement.clientWidth;
          const heightCurrentBox = editorElement.clientHeight;
          console.log('Width:', widthCurrentBox, 'Height:', heightCurrentBox);
          return {widthCurrentBox, heightCurrentBox}
        }
    }

    onUpdate = () => {
        if (!this.display || !this.img) {
            return;
        }

        const size = this.getCurrentSize();
        const {widthCurrentBox, heightCurrentBox} = this.getCurrentQLEditorScreen();
        this.display.innerHTML = size.join(' &times; ');
        if (size[0] > 120 && size[1] > 30) {
            // position on top of image
            if(this.img.style.marginLeft === "50%" || this.img.style.marginRight === "50%"){
                console.log('50%');

                const ratioSize = size[0] / size[1];
                const halfWidth = widthCurrentBox / 2;
                const halfHeight = halfWidth / ratioSize;
                this.img.width = halfWidth;
                // this.overlay.style.width = `${halfWidth} !important`;
                // this.overlay.style.height = halfHeight;
                // this.img.height = halfHeight;
                // this.display.style.height = halfHeight;
                // this.requestUpdate()
                return;
            }
            Object.assign(this.display.style, {
                right: '4px',
                bottom: '4px',
                left: 'auto',
            });
        }
        else if (this.img.style.float == 'right') {
            console.log('2');
			// position off bottom left
            const dispRect = this.display.getBoundingClientRect();
            Object.assign(this.display.style, {
                right: 'auto',
                bottom: `-${dispRect.height + 4}px`,
                left: `-${dispRect.width + 4}px`,
            });
        }
        else {
            // position off bottom right
            console.log('3');
            const dispRect = this.display.getBoundingClientRect();
            Object.assign(this.display.style, {
                right: `-${dispRect.width + 4}px`,
                bottom: `-${dispRect.height + 4}px`,
                left: 'auto',
            });
        }
    };

    getCurrentSize = () => [
        this.img.width,
        Math.round((this.img.width / this.img.naturalWidth) * this.img.naturalHeight),
    ];
}
