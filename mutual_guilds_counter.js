const Plugin = require('../plugin');

module.exports = new Plugin({
    name: 'Mutual Guilds Counter',
    author: 'Juby210#2100',
    description: 'Mutual guilds counter',
    color: 'aqua',

    load: () => {
        document.body.addEventListener('DOMNodeInserted', listener);
    },
    unload: () => {
        document.body.removeEventListener('DOMNodeInserted', listener);
    }
});

function listener(e) {
    if(!e.target || !e.target.classList) return;
    let el = e.target;
    
    if (el.classList.contains("scrollerWrap-2lJEkd") && Array.from(document.body.getElementsByClassName("item-PXvHYJ"))[1].classList.contains("itemSelected-1qLhcL")) {
        //console.log(el);
        let scroller = Array.from(el.getElementsByClassName("scroller-2FKFPG"))[0];
        let count = Array.from(scroller.getElementsByClassName("listRow-hutiT_")).length;
        let elm = Array.from(document.body.getElementsByClassName("item-PXvHYJ"))[1];
        if(elm.innerText.includes(" [") && elm.innerText.includes("]")) {
            elm.innerText = elm.innerText.split(" [")[0];
        }
        elm.innerText += ` [${count}]`;
    }
}