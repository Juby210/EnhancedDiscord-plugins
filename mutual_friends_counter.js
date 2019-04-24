const Plugin = require('../plugin');

module.exports = new Plugin({
    name: 'Mutual Friends Counter',
    author: 'Juby210#2100',
    description: 'Mutual friends counter',
    color: 'aqua',

    load: () => {
        document.body.addEventListener('DOMNodeInserted', module.exports.listener);
    },
    unload: () => {
        document.body.removeEventListener('DOMNodeInserted', module.exports.listener);
    },

    listener: e => {
        if(!e.target || !e.target.classList) return;
        let el = e.target;
        
        if (el.classList.contains("scrollerWrap-2lJEkd") && Array.from(document.body.getElementsByClassName("item-PXvHYJ"))[2].style.color == "rgb(255, 255, 255)") {
            //console.log(el);
            let scroller = Array.from(el.getElementsByClassName("scroller-2FKFPG"))[0];
            let loading = Array.from(el.getElementsByClassName("spinner-2enMB9")).length;
            if(loading != 0) setTimeout(() => check(scroller, el), 200); else cont(scroller);
        }
    }
});

function check(scroller, el) {
    let loading = Array.from(el.getElementsByClassName("spinner-2enMB9")).length;
    if(loading != 0) setTimeout(() => check(scroller, el), 200); else cont(scroller);
}

function cont(scroller) {
    let count = Array.from(scroller.getElementsByClassName("listRow-hutiT_")).length;
    let elm = Array.from(document.body.getElementsByClassName("item-PXvHYJ"))[2];
    if(elm.innerText.includes(" [") && elm.innerText.includes("]")) {
        elm.innerText = elm.innerText.split(" [")[0];
    }
    elm.innerText += ` [${count}]`;
}