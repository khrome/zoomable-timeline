import { HTMLElement, customElements } from '@environment-safe/elements';

export class TimelineCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const link = document.querySelector('#animate.css');
        const animateCSSLink = link?link.getAttribute('href'):'/node_modules/animate.css/animate.css';
        this._link = document.createElement('link');
        this._link.setAttribute('rel', 'stylesheet');
        this._link.setAttribute('href', animateCSSLink);
        this.shadowRoot.appendChild(this._link);
        this._container = document.createElement('div');
        this._container.innerHTML = '<slot></slot>';
        this.shadowRoot.appendChild(this._container);
    }
    
    async setContent(html){
        return await new Promise((resolve, reject)=>{
            try{
                if(html !== null){
                    this._container.innerHTML = html;
                }else{
                    this._container.innerHTML = '<slot></slot>';
                }
                const animationTarget = this;
                const endFn = ()=>{
                    animationTarget.removeEventListener('animationend', endFn);
                    animationTarget.classList.remove(`animate__${'animated'}`);
                    animationTarget.classList.remove(`animate__${'flipInY'}`);
                    animationTarget.classList.remove(`animate__${'faster'}`);
                    resolve();
                };
                animationTarget.addEventListener('animationend', endFn, false);
                animationTarget.classList.add(`animate__${'animated'}`);
                animationTarget.classList.add(`animate__${'flipInY'}`);
                animationTarget.classList.add(`animate__${'faster'}`);
            }catch(ex){
                reject(ex);
            }
        });
    }
    
    render(){
        
    }
    
    display(){
        
    }
}
customElements.define('timeline-card', TimelineCard);