window.JubyLibCSS = `#JubyLib-container h2.ui-form-title {
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
    margin-left: 6px;
    margin-right: 6px;
}
.JL-title {
    color: #f6f6f7;
}
.JL-input {
    margin: 3px;
}`;
/**
 * @namespace JubyLib
 * @example
 * const Plugin = require("../plugin");
 * let jlSrc = "https://juby.cf/jl/JubyLib.js";
 * let jlVer = {min: 0.23, max: 0.29, tested: 0.23}; // min is min version supported; max is max version supported; tested is tested version
 *
 *  function loadJL() {
 *      let jl = document.createElement("script");
 *      jl.id = "JubyLib-script";
 *      jl.src = jlSrc;
 *      document.head.appendChild(jl);
 *
 *      jl.onload = () => {
 *          if(jlVer.max <= JubyLib.version.v || (jlVer.min >= JubyLib.version.v && jlVer.min != JubyLib.version.v)) {
 *              jlSrc = `https://juby.cf/jl/JubyLib-${jlVer.tested}.js`;
 *              JubyLib.unload();
 *              loadJL();
 *          } else {
 *              JubyLib.load();
 *              checkUpdate();
 *          }
 *      };
 *  }
 *
 *  function checkUpdate() {
 *      JubyLib.updatesModule.check("http://localhost/example.json", "Example", 1.0, "http://localhost/example.js");
 *  }
 *  module.exports = new Plugin({
 *      name: "Example for JubyLib",
 *      author: "Juby210#5831",
 *      description: "https://github.com/juby210-PL/EnhancedDiscord-plugins",
 *      load: () => {
 *          try {
 *              if(!hasJubyLib) loadJL(); else checkUpdate();
 *          } catch(e) {loadJL();}
 *      }
 *  });
 */
window.JubyLib = {
    version: {},
    updatesModule: {}
}

/**
 * @overview
 * @copyright © Juby210 2018
 * @license Apache2
 * @author Juby210
 * @version 0.23
 */

/* Classes */
/**
 * @class JubyLib.Embed
 * @property {string} title - Embed title
 * @property {string} description - Embed description
 * @property {string} color - Embed color hex without #
 * @property {string} image - Image url
 * @property {string} thumbnail - Thumbnail url
 * @property {object} footer
 * @property {object} author
 * @property {array} fields - Array of objects
 */
window.JubyLib.Embed = class JubyLibEmbed {
    constructor() {
        this.title = "";
        this.description = "";
        this.color = "";
        this.image = "";
        this.thumbnail = "";
        this.footer = {text: "", icon_url: ""};
        this.author = {name: "", icon_url: ""};
        this.fields = [];
    }
    /**
     * Set embed footer
     * @param {string} text - Text
     * @param {string} iconUrl - Icon url
     */
    setFooter(text = "", iconUrl = "") {
        this.footer.text = text;
        this.footer.icon_url = iconUrl;
    }
    /**
     * Set embed author
     * @param {string} text - Text
     * @param {string} iconUrl - Icon url
     */
    setAuthor(text = "", iconUrl = "") {
        this.author.name = text;
        this.author.icon_url = iconUrl;
    }
    /**
     * Add field
     * @param {string} name - Field name
     * @param {string} value - Field value
     * @param {boolean} inline - Field inline
     */
    addField(name = "", value = "", inline = false) {
        this.fields.push({name, value, inline});
    }
}

/**
 * @namespace JubyLib
 */
/* Functions */

/* load and unload */
/**
 * Init library
 */
window.JubyLib.load = () => {
    var hasJQuery = false;
    try{
        if(!jQuery) {} else hasJQuery = true;
    } catch(e) {}
    if(!hasJQuery) {
        var jq = document.createElement("script");
        jq.id = "JubyLib-jQuery";
        jq.src = `https://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js`;
        document.head.appendChild(jq);
    }
    var csse = document.createElement("style");
    csse.id = "JubyLib-style";
    csse.innerHTML = window.JubyLibCSS;
    document.head.appendChild(csse);
}
/**
 * Remove library from discord
 */
window.JubyLib.unload = () => {
    window.hasJubyLib = false;
    window.JubyLib = undefined;
    let jq = document.getElementById("JubyLib-jQuery")
    if(jq) document.head.removeChild(jq);
    let csse = document.getElementById("JubyLib-style");
    if(csse) document.head.removeChild(csse);
    let jl = document.getElementById("JubyLib-script");
    if(jl) jl.parentElement.removeChild(jl);
}

/* Sending messages */
/**
 * Get selected channel id
 * @returns {string}
 */
window.JubyLib.getSelectedChannel = () => {
    return findModules('getChannelId')[2].getChannelId();
}
/**
 * Send message to channel
 * @param {string} channelId - Channel id to send message
 * @param {string} content - Message content
 */
window.JubyLib.sendMessage = (channelId, content) => {
    findModule('sendClydeError').sendMessage(channelId, {content});
}
/**
 * Send embed to channel
 * @param {string} channelId - Channel id to send message
 * @param {string} content - Message content
 * @param {JubyLib.Embed} embed - Embed class
 */
window.JubyLib.sendEmbed = (channelId, content, embed) => {
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
                title: embed.title,
                description: embed.description,
                color: parseInt(embed.color, 16),
                image: {url: embed.image},
                thumbnail: {url: embed.thumbnail},
                footer: embed.footer,
                author: embed.author,
                fields: embed.fields
            }
        }
    });
}

/* popups */
/**
 * Create popup window like discord changelog.
 * @param {string} title - Popup title
 * @param {string} content - Popup content: HTML/text
 * @param {string} btnName - Button name
 * @param {string} height - Popup height
 * @param {function} btnClickListener - Button click listener
 * @param {function} closePopupListener - Close popup listener
 */
window.JubyLib.popup = (title = "Awesome Popup", content = "", btnName = "OK", height = "auto", btnClickListener = () => {}, closePopupListener = () => {}) => {
    let con = content;
    if(!con.startsWith("<")) con = `<div class="${ED.classMaps.headers.h1} JL-title">${content}</div>`;
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
                            ${con}
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
}
/**
 * Generate category HTML like this: 
 * 
 * ![preview](https://i.imgur.com/kRbIU2b.gif)
 * @param {string} name - Category name
 * @param {string} content - Content HTML
 * @param {boolean} defaultHidden - defaultHidden category? | default: true
 */
window.JubyLib.popupCategory = (name, content, defaultHidden = true) => {
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
        <div class="category-content ${ED.classMaps.headers.size14} JL-title marginReset-236NPn weightMedium-2iZe9B height24-3XzeJx flexChild-faoVW3" id="category-${name2}-c" style="visibility: ${defaultHidden ? "hidden; height: 0px;" : "visible;"}">
            ${content}
        </div>`;
}

/* presence */
/**
 * Set user rich presence
 * 
 * (id, name, details, state, time = true)
 */
window.JubyLib.setPresence = (id, name, details, state, time = true) => {
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
}
/**
 * Clear user rich presence
 */
window.JubyLib.clearPresence = () => {
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

/* updates */
/**
 * @class JubyLib.updatesModule
 */
/**
 * Get plugins install dir
 */
window.JubyLib.updatesModule.getPluginsDir = () => {
    const path = require("path");
    if(process.env.injDir) return path.resolve(process.env.injDir, "plugins");
}
/**
 * Check plugin update and show popup
 * @param {string} jsonUrl - Plugins versions json url
 * @param {string} pluginName - Plugin name
 * @param {double} pluginVersion - Plugin version
 * @param {string} pluginUrl - Plugin update url
 */
window.JubyLib.updatesModule.check = (jsonUrl, pluginName, pluginVersion, pluginUrl) => {
    $.ajax({
        url: `https://cors-anywhere.herokuapp.com/${jsonUrl}`,
        context: document.body,
        success: function(json) {
            if(typeof json != 'object') {
                json = JSON.parse(json);
            }
            let v = json[pluginName.replace(/ /g, "")];
            if(pluginVersion <= v && pluginVersion != v) {
                window.JubyLib.popup(`Plugin update: ${pluginName}`, `${pluginName} has an update!<br>Click download button to download and reload<br><br>Your Version: ${pluginVersion}<br>New Version: ${v}`, "Download", "10px", () => {
                    const request = require("request");
                    const fs = require("fs");
                    const path = require("path");
                    request(pluginUrl, (err, res, body) => {
                        if(err) return console.warn(`Failed to download ${pluginName} ${v}`);
                        let fn = pluginUrl.split('/')[pluginUrl.split('/').length - 1];
                        let file = path.join(window.JubyLib.updatesModule.getPluginsDir(), fn);
                        fs.writeFileSync(file, body);
                        setTimeout(() => {
                            window.location.reload(false);
                        }, 100);
                    });
                });
            }
        }
    });
};

/**
 * @class JubyLib.version
 * @property {double} v - JubyLib version number (e.g. 0.1 0.11 0.2)
 * @property {string} name - JubyLib version name (e.g. BETA 0.1)
 */
window.JubyLib.version.v = 0.23;
window.JubyLib.version.name = `BETA ${window.JubyLib.version.v}`;
/**
 * @namespace hasJubyLib
 * Check if JubyLib is added to discord
 */
window.hasJubyLib = true;