module.exports = {
    Embed: class JubyLibEmbed {
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
        setFooter(text = "", iconUrl = "") {
            this.footer.text = text;
            this.footer.icon_url = iconUrl;
        }
        setAuthor(text = "", iconUrl = "") {
            this.author.name = text;
            this.author.icon_url = iconUrl;
        }
        addField(name = "", value = "", inline = false) {
            this.fields.push({name, value, inline});
        }
    },

    injectCSS: (id, css) => {
        $('head').append(`<style id=${id}>${css}</style>`);
    },
    clearCSS: id => {
        let css = document.getElementById(id);
        if(css) css.parentElement.removeChild(css);
    },

    patcher: (modules, func) => {
        if(!Array.isArray(modules) || typeof func != 'function') return;
        modules.forEach(m => {
            monkeyPatch(m.module, m.method, func);
        });
    },
    unpatch: modules => {
        if(!Array.isArray(modules)) return;
        modules.forEach(m => {
            if(m.__monkeyPatched) m.unpatch();
        });
    },
    isPatched: m => {
        if(m.__monkeyPatched) return true; else return false;
    },

    getSelectedChannel: () => {
        return findModules('getChannelId')[2].getChannelId()
    },
    sendMessage: (channelId, content, data) => {
        let m = data ? Object.assign({content}, data) : {content};
        findModule('sendClydeError').sendMessage(channelId, m);
    },
    sendEmbed: (channelId, content, embed) => {
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
    },
    
    getUserByTag: (username, discriminator) => {
        if(!discriminator) {
            discriminator = username.split('#')[1];
            username = username.split('#')[0];
        }
        const users = findModule('getUsers').getUsers();
        return users[Object.keys(users).filter(k=>users[k].username==username&&users[k].discriminator==discriminator)[0]];
    },
    getUser: id => {
        return findModule('getUser').getUser(id);
    },
    isBot: id => {
        return findModule('getUser').getUser(id).bot;
    },

    getPluginsDir: () => {
        const path = require("path");
        if(process.env.injDir) return path.resolve(process.env.injDir, "plugins");
    },
    
    addButtonInList: (id, text) => {
        const guildSep = findModule('guildSeparator').guildSeparator;
        let jlbtns = $('#jlbtns');
        if(jlbtns.length == 0) {
            $(`.${guildSep.split(' ')[0]}`).before(`<div id="jlbtns"></div>`);
            jlbtns = $('#jlbtns');
        }
        const friendsClass = findModule('friendsOnline').friendsOnline;
        $(jlbtns).append(`<div id="${id}" class="${friendsClass}">${text}</div>`);
        return $(`#${id}`);
    },
    notice: (content, button, type = "Premium", btnClickListener = () => {}, closeNoticeListener = () => {}) => {
        const id = document.getElementsByClassName("JubyLib-notice").length;
        let style = ``;
        if(type == "Spotify") style = ` style="margin-top: 5px; margin-left: 10px;"`;
        let btn = ``;
        if(button) btn = `<button class="${findModule("noticeInfo").btn} ${findModule("noticeInfo").button} JubyLib-nbutton${id}"${style}>${button}</button>`;
        let noticeElement = `<div class="${findModule("noticeInfo").notice} ${findModule("noticeInfo")[`notice${type}`]} JubyLib-notice JubyLib-notice${id}"><div class="${findModule("noticeInfo").dismiss} JubyLib-ndismiss${id}"></div><span class="JubyLib-nmessage${id}">${content}${btn}</div>`;
        $('#app-mount').children().first().after(noticeElement);
        $('.win-buttons').addClass("win-buttons-notice");
        $(`.JubyLib-ndismiss${id}`).on('click', () => {
            closeNoticeListener();
            $('.win-buttons').animate({top: 0}, 400, "swing", () => { $('.win-buttons').css("top","").removeClass("win-buttons-notice"); });
            $(`.JubyLib-notice${id}`).slideUp({complete: () => { $(`.JubyLib-notice${id}`).remove(); }});
        });
        $(`.JubyLib-nbutton${id}`).on('click', () => {
            btnClickListener();
            $('.win-buttons').animate({top: 0}, 400, "swing", () => { $('.win-buttons').css("top","").removeClass("win-buttons-notice"); });
            $(`.JubyLib-notice${id}`).slideUp({complete: () => { $(`.JubyLib-notice${id}`).remove(); }});
        });
    },
    popup: (title = "Awesome Popup", content = "", btnName = "OK", height = "auto", btnClickListener = () => {}, closePopupListener = () => {}) => {
        let con = content;
        if(!con.startsWith("<")) con = `<div class="${ED.classMaps.headers.h1} JL-title">${content}</div>`;
        let mm = findModule('modal')
        
        const baseModalClasses = EDApi.findModule(m => m.modal && m.inner && !m.sizeMedium) || {modal: "modal-36zFtW", inner: "inner-2VEzy9"}
        const modalClasses = EDApi.findModuleByProps("sizeMedium") || {modal: "backdrop-1wrmKb", sizeMedium: "sizeMedium-ctncE5", content: "content-2KoCOZ", header: "header-2nhbou", footer: "footer-30ewN8", close: "close-hhyjWJ", inner: "inner-2Z5QZX"}
        const backdrop = EDApi.findModuleByProps("backdrop") || {backdrop: "backdrop-1wrmKb"}
        
        const popupHTML = `<div id="JubyLib-container" class="theme-dark">
            <div class="backdrop ${backdrop.backdrop}" style="background-color: rgb(0, 0, 0); opacity: 0.85;"></div>
            <div class="modal ${baseModalClasses.modal}" style="opacity: 1;">
                <div class="${baseModalClasses.inner}">
                    <div class="${modalClasses.modal} ${modalClasses.sizeMedium}" style="overflow: hidden;">
                        <div class="flex-1xMQg5 flex-1O1GKY horizontal-1ae9ci horizontal-2EEEnY flex-1O1GKY directionRow-3v3tfG justifyStart-2NDFzi alignCenter-1dQNNs noWrap-3jynv6 ${modalClasses.header}">
                            <h4 class="title h4-AQvcAz title-3sZWYQ size16-14cGz5 height20-mO2eIN weightSemiBold-NJexzi defaultColor-1_ajX0 defaultMarginh4-2vWMG5 marginReset-236NPn">${title}</h4>
                            <svg viewBox="0 0 12 12" name="Close" width="18" height="18" class="close-button ${modalClasses.close} flexChild-faoVW3"><g fill="none" fill-rule="evenodd"><path d="M0 0h12v12H0"></path><path class="fill" fill="currentColor" d="M9.5 3.205L8.795 2.5 6 5.295 3.205 2.5l-.705.705L5.295 6 2.5 8.795l.705.705L6 6.705 8.795 9.5l.705-.705L6.705 6"></path></g></svg>
                        </div>
                        <div class="scrollerWrap-2lJEkd scrollerThemed-2oenus themeGhostHairline-DBD-2d ${modalClasses.content}">
                            <div id="JubyLib-popup-${title.replace(/ /g, "")}" class="scroller-2FKFPG ${modalClasses.inner} selectable">
                                ${con}
                        </div>
                    </div>
                    <div class="flex-1xMQg5 flex-1O1GKY horizontalReverse-2eTKWD horizontalReverse-3tRjY7 flex-1O1GKY directionRowReverse-m8IjIq justifyStart-2NDFzi alignStretch-DpGPf3 noWrap-3jynv6 ${modalClasses.footer}" style="flex: 0 0 auto;"><button id="JubyLib-btn-${btnName.replace(/ /g, "")}" type="button" class="done-button button-38aScr lookFilled-1Gx00P colorBrand-3pXr91 sizeMedium-1AC_Sl grow-q77ONN"><div class="contents-18-Yxp">${btnName}</div></button>
                </div>
            </div>
        </div>`
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
    popupCategory: (name, content, defaultHidden = true) => {
        const name2 = name.replace(/ /g, "");
        const sc = `var e = document.getElementById("category-${name2}-c");
            var e2 = document.getElementById("category-${name2}");
            if(e.style.visibility != "hidden") {
                Array.from(e.getElementsByClassName("category-title")).forEach(em => {if(em.innerText.startsWith("˅")) em.click();});
                e.style.visibility = "hidden";
                e.style.height = "0px";
                e2.innerText = "> ${name}";
            } else {
                e.style.visibility = "visible";
                e.style.height = "auto";
                e2.innerText = "˅ ${name}";
            }`;
    
        return `<div class="category-title ${ED.classMaps.headers.size16} titleDefault-a8-ZSr title-31JmR4 marginReset-236NPn weightMedium-2iZe9B height24-3XzeJx flexChild-faoVW3" id="category-${name2}" onclick='${sc}'>${defaultHidden ? ">" : "Ë"} ${name}</div>
            <div class="category-content ${ED.classMaps.headers.size14} JL-title marginReset-236NPn weightMedium-2iZe9B height24-3XzeJx flexChild-faoVW3" id="category-${name2}-c" style="visibility: ${defaultHidden ? "hidden; height: 0px;" : "visible;"}">
                ${content}
            </div>`;
    },

    updatesModule: {
        check: (jsonUrl, plugin, pluginUrl) => {
            $.ajax({
                url: `https://cors-anywhere.herokuapp.com/${jsonUrl}`,
                context: document.body,
                success: function(json) {
                    if(typeof json != 'object') {
                        json = JSON.parse(json);
                    }
                    let v = json[plugin.name.replace(/ /g, "")];
                    if(plugin.version <= v && plugin.version != v) {
                        module.exports.notice(`Plugin update: <strong>${pluginName}</strong> (${pluginVersion} => ${v})`, "Download", "Premium", () => {
                            const request = require("request");
                            const fs = require("fs");
                            const path = require("path");
                            request(pluginUrl, (err, res, body) => {
                                if(err) return module.exports.notice(`Failed to download <strong>${pluginName} ${v}</strong>`, undefined, "Danger");
                                let fn = plugin.id+'.js';
                                let file = path.join(module.exports.getPluginsDir(), fn);
                                fs.writeFileSync(file, body);
                                module.exports.notice(`Updated <strong>${pluginName}</strong> from version ${pluginVersion} to ${v}`, "Reload", "Spotify", () => {
                                    window.location.reload(false);
                                });
                            });
                        });
                    }
                }
            });
        }
    }
};
module.exports.injectCSS('JubyLib-style', `#JubyLib-container h2.ui-form-title {
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
}`);

// Legacy //
module.exports.updatesModule.getPluginsDir = module.exports.getPluginsDir;
window.JubyLib = module.exports;
window.JubyLib.version = {v: 0.3,name:'Rewrite 0.3'};
window.JubyLib.load = () => {};
window.JubyLib.unload = () => {
    window.hasJubyLib = false;
    window.JubyLib = undefined;
};
window.hasJubyLib = true;

module.exports