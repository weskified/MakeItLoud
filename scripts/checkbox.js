class Checkbox extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        
        const wrapper = document.createElement("div");
        wrapper.style.position = "relative";
        wrapper.style.width = "50px";
        wrapper.style.height = "50px";
        wrapper.style.cursor = "pointer";
        wrapper.style.display = "flex";
        wrapper.style.alignItems = "center";
        wrapper.style.justifyContent = "center";
        
        const tileContainer = document.createElement("div");
        tileContainer.style.width = "85%";
        tileContainer.style.height = "85%";
        tileContainer.style.position = "relative";
        tileContainer.style.display = "flex";
        tileContainer.style.alignItems = "center";
        tileContainer.style.justifyContent = "center";
        
        const tile = document.createElement("img");
        tile.src = "./assets/tile.webp";
        tile.style.width = "100%";
        tile.style.height = "100%";
        tile.style.objectFit = "contain";
        
        const check = document.createElement("img");
        check.src = "./assets/check.webp";
        check.style.position = "absolute";
        check.style.width = "100%";
        check.style.height = "100%";
        check.style.top = "0";
        check.style.left = "0";
        check.style.opacity = "0";
        check.style.transformOrigin = "center";
        check.style.zIndex = "1";
        
        const style = document.createElement("style");
        style.textContent = `
                        @keyframes bounceIn {
                            0%   { transform: scale(0.3); opacity: 0; }
                            50%  { transform: scale(1.2); opacity: 1; }
                            100% { transform: scale(1); opacity: 1; }
                        }
                        .visible {
                            animation: bounceIn 100ms ease-out;
                            opacity: 1 !important;
                        }
                    `;
        
        tileContainer.appendChild(tile);
        wrapper.appendChild(check);
        wrapper.appendChild(tileContainer);
        
        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(wrapper);
        
        this._checkImg = check;
        this._checked = false;
        
        wrapper.addEventListener("click", () => this.toggle());
    }
    
    toggle() {
        this.checked = !this.checked;
    }
    
    set checked(value) {
        this._checked = value;
        if (value) {
            this._checkImg.classList.remove("visible");
            void this._checkImg.offsetWidth;
            this._checkImg.classList.add("visible");
        } else {
            this._checkImg.classList.remove("visible");
            this._checkImg.style.opacity = "0";
        }
    }
    
    get checked() {
        return this._checked;
    }
}

customElements.define("w-checkbox", Checkbox);