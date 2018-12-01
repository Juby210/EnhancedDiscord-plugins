const Plugin = require("../plugin");
const css = `#JubyLib-container h2.ui-form-title {
    font-size: 16px;
    font-weight: 600;
    line-height: 20px;
    text-transform: uppercase;
    display: inline-block;
    margin-bottom: 20px;
}
#JubyLib-container h2.ui-form-title {
    color: #f6f6f7;
}
.theme-light #JubyLib-container h2.ui-form-title {
    color: #4f545c;
}
#JubyLib-container .ui-switch-item {
    flex-direction: column;
    margin-top: 8px;
}
#JubyLib-container .ui-switch-item h3 {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    flex: 1;
}
#JubyLib-container .ui-switch-item h3 {
    color: #f6f6f7;
}
.theme-light #JubyLib-container .ui-switch-item h3 {
    color: #4f545c;
}
#JubyLib-container .ui-switch-item .style-description {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    margin-bottom: 10px;
	padding-bottom: 10px;
	border-bottom: 1px solid hsla(218,5%,47%,.3);
}
#JubyLib-container .ui-switch-item .style-description {
    color: #72767d;
}
.theme-light #JubyLib-container .ui-switch-item .style-description {
    color: rgba(114,118,125,.6);
}
#JubyLib-container .ui-switch-item .ui-switch-wrapper {
	-webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    position: relative;
    width: 44px;
    height: 24px;
    display: block;
    flex: 0 0 auto;
}
#JubyLib-container .ui-switch-item .ui-switch-wrapper input {
	position: absolute;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
    z-index: 1;
}
#JubyLib-container .ui-switch-item .ui-switch-wrapper .ui-switch {
	background: #7289da;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: #72767d;
    border-radius: 14px;
    transition: background .15s ease-in-out,box-shadow .15s ease-in-out,border .15s ease-in-out;
}
#JubyLib-container .ui-switch-item .ui-switch-wrapper .ui-switch:before {
	content: '';
    display: block;
    width: 18px;
    height: 18px;
    position: absolute;
    top: 3px;
    left: 3px;
    bottom: 3px;
    background: #f6f6f7;
    border-radius: 10px;
    transition: all .15s ease;
    box-shadow: 0 3px 1px 0 rgba(0,0,0,.05),0 2px 2px 0 rgba(0,0,0,.1),0 3px 3px 0 rgba(0,0,0,.05);
}
#JubyLib-container .ui-switch-item .ui-switch-wrapper .ui-switch.checked {
	background: #7289da;
}
#JubyLib-container .ui-switch-item .ui-switch-wrapper .ui-switch.checked:before {
	transform: translateX(20px);
}
#JubyLib-container .content {
    padding: 0 12px 12px 20px;
}
@keyframes jl-modal-backdrop {
    to { opacity: 0.85; }
}
@keyframes jl-modal-anim {
    to { transform: scale(1); opacity: 1; }
}
@keyframes jl-modal-backdrop-closing {
    to { opacity: 0; }
}
@keyframes jl-modal-closing {
    to { transform: scale(0.7); opacity: 0; }
}
#JubyLib-container .backdrop {
    animation: jl-modal-backdrop 250ms ease;
    animation-fill-mode: forwards;
    background-color: rgb(0, 0, 0);
    transform: translateZ(0px);
}
#JubyLib-container.closing .backdrop {
    animation: jl-modal-backdrop-closing 200ms linear;
    animation-fill-mode: forwards;
    animation-delay: 50ms;
    opacity: 0.85;
}
#JubyLib-container.closing .modal {
    animation: jl-modal-closing 250ms cubic-bezier(0.19, 1, 0.22, 1);
    animation-fill-mode: forwards;
    opacity: 1;
    transform: scale(1);
}
#JubyLib-container .modal {
    animation: jl-modal-anim 250ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
    animation-fill-mode: forwards;
    transform: scale(0.7);
    transform-origin: 50% 50%;
}
#JubyLib-container .category-title {
    margin-top: 10px;
}
#JubyLib-container .category-content {
    margin-bottom: 10px;
}`;

module.exports = new Plugin({
	name: "JubyLib",
	author: "Juby210#5831",
    description: "Juby210's Plugin Library",
    color: "#0000ff",
    preload: true,
    load: () => {
        let hasJQuery = false;
        try{
            if(!jQuery) {} else hasJQuery = true;
        } catch(e) {}
        if(!hasJQuery) {
            let jq = document.createElement("script");
            jq.id = "JubyLib-jQuery";
            jq.src = `https://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js`;
            document.head.appendChild(jq);
        }
        let csse = document.createElement("style");
        csse.id = "JubyLib-style";
        csse.innerHTML = css;
        document.head.appendChild(csse);

        window.JubyLib = {
            version: {},
            sendMessage(channelId, content) {
                findModule('sendClydeError').sendMessage(channelId, {content});
            },
            sendEmbed(channelId, content, embedTitle, embedDescription, embedColor, embedImage, embedFooter = {text: "", icon_url: ""}) {
                let sb = findModule('createBotMessage');
                let sq = findModule('enqueue');
                let message = sb.createMessage(channelId, content);
                    
                sq.enqueue({
                    type: "send",
                    message: {
                        channelId,
                        content,
                        tts: false,
                        nonce: message.id,
                        embed: {
                            title: embedTitle,
                            description: embedDescription,
                            color: parseInt(embedColor, 16),
                            image: {url: embedImage},
                            footer: embedFooter
                        }
                    }
                });
            },
            getSelectedChannel() {
                return findModules('getChannelId')[2].getChannelId();
            },
            popup(title = "Awesome Popup", content = "", btnName = "OK", height = "auto", btnClickListener = () => {}, closePopupListener = () => {}) {
                const popupHTML = `<div id="JubyLib-container" class="theme-dark">
                    <div class="backdrop backdrop-1wrmKB" style="background-color: rgb(0, 0, 0); opacity: 0.85;"></div>
                    <div class="modal modal-1UGdnR" style="opacity: 1;">
                        <div class="inner-1JeGVc">
                            <div class="modal-3HD5ck sizeMedium-1fwIF2" style="overflow: hidden; height: ${height}">
                                <div class="flex-1xMQg5 flex-1O1GKY horizontal-1ae9ci horizontal-2EEEnY flex-1O1GKY directionRow-3v3tfG justifyStart-2NDFzi alignCenter-1dQNNs noWrap-3jynv6 header-1R_AjF">
                                    <h4 class="title h4-AQvcAz title-3sZWYQ ${ED.classMaps.headers.size16} height20-mO2eIN weightSemiBold-NJexzi defaultColor-1_ajX0 defaultMarginh4-2vWMG5 marginReset-236NPn">${title}</h4>
                                    <svg viewBox="0 0 12 12" name="Close" width="18" height="18" class="close-button close-18n9bP flexChild-faoVW3"><g fill="none" fill-rule="evenodd"><path d="M0 0h12v12H0"></path><path class="fill" fill="currentColor" d="M9.5 3.205L8.795 2.5 6 5.295 3.205 2.5l-.705.705L5.295 6 2.5 8.795l.705.705L6 6.705 8.795 9.5l.705-.705L6.705 6"></path></g></svg>
                                </div>
                                <div class="scrollerWrap-2lJEkd content-2BXhLs scrollerThemed-2oenus themeGhostHairline-DBD-2d">
                                    <div id="JubyLib-popup-${title.replace(/ /g, "")}" class="scroller-2FKFPG inner-3wn6Q5 selectable content">
                                        ${content}
                                    </div>
                                </div>
                                <div class="flex-1xMQg5 flex-1O1GKY horizontalReverse-2eTKWD horizontalReverse-3tRjY7 flex-1O1GKY directionRowReverse-m8IjIq justifyStart-2NDFzi alignStretch-DpGPf3 noWrap-3jynv6 footer-2yfCgX" style="flex: 0 0 auto;"><button id="JubyLib-btn-${btnName.replace(/ /g, "")}" type="button" class="button-38aScr lookFilled-1Gx00P colorBrand-3pXr91 sizeMedium-1AC_Sl grow-q77ONN"><div class="contents-18-Yxp">${btnName}</div></button></div>
                            </div>
                        </div>
                    </div>
                </div>`;
                const popup = $(popupHTML);

                popup.find('.backdrop, .close-button').on('click', () => {
                    popup.addClass('closing');
                    closePopupListener();
                    setTimeout(() => { popup.remove(); }, 300);
                });
                popup.find(`#JubyLib-btn-${btnName.replace(/ /g, "")}`).on('click', () => {
                    popup.addClass('closing');
                    btnClickListener();
                    setTimeout(() => { popup.remove(); }, 300);
                });
                popup.appendTo('#app-mount');
            },
            popupCategory(name, content, defaultHidden = true) {
                const name2 = name.replace(/ /g, "");
                const sc = `var e = document.getElementById("category-${name2}-c");
                    var e2 = document.getElementById("category-${name2}");
                    if(e.style.visibility != "hidden") {
                        e.style.visibility = "hidden";
                        e.style.height = "0px";
                        e2.innerText = "> ${name}";
                    } else {
                        e.style.visibility = "visible";
                        e.style.height = "auto";
                        e2.innerText = "˅ ${name}";
                    }`;

                return `<div class="category-title ${ED.classMaps.headers.size16} titleDefault-a8-ZSr title-31JmR4 marginReset-236NPn weightMedium-2iZe9B height24-3XzeJx flexChild-faoVW3" id="category-${name2}" onclick='${sc}'>${defaultHidden ? ">" : "˅"} ${name}</div>
                    <div class="category-content ${ED.classMaps.headers.size14} titleDefault-a8-ZSr title-31JmR4 marginReset-236NPn weightMedium-2iZe9B height24-3XzeJx flexChild-faoVW3" id="category-${name2}-c" style="visibility: ${defaultHidden ? "hidden; height: 0px;" : "visible;"}">
                        ${content}
                    </div>`;
            },
            setPresence(id, name, details, state, time = true) {
                return new Promise((resolve, reject) => {
                    const obj = {socket:{application:{}, transport:'ipc'}, args:{activity:{timestamps:{}, assets:{}, pid:process.pid}}};
                    let app = obj.socket.application;
                    app.id = id;
                    app.name = name;
                    let activity = obj.args.activity;
                    if(details) activity.details = details;
                    if(state) activity.state = state;
                    if(time) activity.timestamps.start = Math.floor(new Date().valueOf() / 1000);
                    try {
                        findModule("SET_ACTIVITY").SET_ACTIVITY.handler(obj);
                        resolve(true);
                    } catch(e) {
                        reject(e);
                    }
                });
            },
            clearPresence() {
                return new Promise((resolve, reject) => {
                    const obj = {socket:{transport:'ipc'}, args:{pid:process.pid}};
                    try {
                        findModule("SET_ACTIVITY").SET_ACTIVITY.handler(obj);
                        resolve(true);
                    } catch(e) {
                        reject(e);
                    }
                });
            }
        }
        window.JubyLib.version.v = 0.1;
        window.JubyLib.version.name = `BETA ${window.JubyLib.version.v}`;
        window.hasJubyLib = true;
    },
    unload: () => {
        window.hasJubyLib = false;
        window.JubyLib = undefined;
        let jq = document.getElementById("JubyLib-jQuery")
        if(jq) document.head.removeChild(jq);
        let csse = document.getElementById("JubyLib-style");
        if(csse) document.head.removeChild(csse);
    }
});