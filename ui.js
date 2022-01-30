const baseStyle = `
    position: absolute;
    top: 0;
    left: 0;
    transition: opacity 0.5s;
`;

const cardStyle = `
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    padding: 12px;
    margin: 6px;
    overflow: hidden;
    display: inline-block;
`;

const textStyle = `
    font-size: 1.2em;
    font-weight: bold;
    color: #000;
`;

const columnStyle = `
    display: flex;
    flex-direction: column;
`;

const rowStyle = `
    display: flex;
    flex-direction: row;
`;

class ObservableText {

    constructor(text, element) {
        this._value = text;
        this._element = element;
    }

    get value() { return this._value; }

    set value(text) {
        if (text !== this._value) {
            this._value = text;
            // if it's an image, we need to update the src attribute
            if (this._element.tagName === 'IMG') {
                this._element.src = text;
            } else {
                this._element.innerHTML = text;
            }
        }
    }

}

class UIBuilder {

    constructor() {
        this.properties = {};
    }

    create(element) {
        let style = element.style || '';
        switch (element.type) {
            case 'card': {
                let card = document.createElement('div');
                card.style.cssText = baseStyle + cardStyle;
                if (style.toLowerCase() !== 'none')
                    card.style.cssText += style;
                return card;
            }
            case 'text': {
                let text = document.createElement('span');
                text.style.cssText = textStyle + style;

                if (element.text.match(/{{(.*?)}}/)) {
                    this.properties[element.text.replace(/{{(.*?)}}/, '$1').trim()] = new ObservableText('', text);
                } else {
                    text.innerText = element.text;
                }

                return text;
            }
            case 'column': {
                let column = document.createElement('div');
                column.style.cssText = columnStyle + style;
                return column;
            }
            case 'row': {
                let row = document.createElement('div');
                row.style.cssText = rowStyle + style;
                return row;
            }
            case 'image': {
                let image = document.createElement('img');
                image.style.cssText = style;
                return image;
            }
            default: {
                return document.createElement(element.type);
            }
        }
    }

    parse(ob, parent) {
        let el = this.create(ob);
        if (parent) {
            parent.appendChild(el);
        }

        if (ob.child) {
            this.parse(ob.child, el);
        } else if (ob.children) {
            ob.children.forEach(element => {
                this.parse(element, el);
            });
        }
        return el;
    }

};

var UI = new UIBuilder();