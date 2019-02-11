const Plugin = require('../plugin');

module.exports = new Plugin({
    name: 'Text Mention',
    author: 'Juby210#2100',
    description: 'Mention you when your username is in message content',
    color: 'red',

    load: () => {
        const at = findModule('ActionTypes').ActionTypes;
        const s = findModule('default');
        let settings = module.exports.settings;
        let conf = module.exports.config;

        settings.ignoreself = EDApi.loadData(module.exports.id, "ignoreself");
        settings.ignorebots = EDApi.loadData(module.exports.id, "ignorebots");
        settings.mentionlist = EDApi.loadData(module.exports.id, "mentionlist");

        monkeyPatch(s.default, 'dirtyDispatch', b => {
            let a = b.methodArguments[0];
            if(a.type != at.MESSAGE_CREATE) return b.callOriginalMethod(b.methodArguments);

            if(checkAuthor(a.message)) return b.callOriginalMethod(b.methodArguments);
            let mentionlist = settings.mentionlist == undefined ? conf.mentionlist : settings.mentionlist;
            let hm = false;
            mentionlist.forEach(mw => {
                if(a.message.content.toLowerCase().includes(mw.toLowerCase())) hm = true;
            });
            if(hm) a.message.mention_everyone = true;
            return b.callOriginalMethod(b.methodArguments);
        });
        monkeyPatch(findModule('isMentioned'), 'isMentioned', b => {
            let m = b.methodArguments[0];
            if(checkAuthor(m)) return b.callOriginalMethod(b.methodArguments);
            let mentionlist = settings.mentionlist == undefined ? conf.mentionlist : settings.mentionlist;
            let hm = false;
            mentionlist.forEach(mw => {
                if(m.content.toLowerCase().includes(mw.toLowerCase())) hm = true;
            });
            if(hm) return true;
            return b.callOriginalMethod(b.methodArguments);
        });
    },
    unload: () => {
        let b = findModule('default').default.dirtyDispatch;
        let c = findModule('isMentioned').isMentioned;
        if(b.__monkeyPatched) b.unpatch();
        if(c.__monkeyPatched) c.unpatch();
    },

    config: {
        mentionlist: ["yourusername"],
        ignoreself: true,
        ignorebots: true
    },

    generateSettings: () => {
        const h = window.ED.classMaps.headers;
        const a = window.ED.classMaps.alignment;
        const sw = window.ED.classMaps.switchItem;
        const cb = window.ED.classMaps.checkbox;
        const inp = findModule('input');
        const btn = findModule('button');
        const settings = module.exports.settings;
        const conf = module.exports.config;
        const ignoreself = settings.ignoreself == undefined ? conf.ignoreself : settings.ignoreself;
        const ignorebots = settings.ignorebots == undefined ? conf.ignorebots : settings.ignorebots;
        const mentionlist = settings.mentionlist == undefined ? conf.mentionlist : settings.mentionlist;

        let list = '';
        mentionlist.forEach(word => {
            list += `<input type="text" value="${word}" class="${inp.inputDefault} textmention-mentionlist" style="margin-top:5px"><br>\n`;
        });

        return `<div id="textmention-settings">
            <div class="${a.vertical} ${a.justifyStart} ${a.alignStretch} ${a.noWrap} ${sw.switchItem}" style="flex: 1 1 auto;">
                <div class="${a.horizontal} ${a.justifyStart} ${a.alignStart} ${a.noWrap}" style="flex: 1 1 auto;">
                <h3 class="${sw.titleDefault}" style="flex: 1 1 auto;">Ignore self</h3>
                <div id="textmention-igself-cb" class="${cb.switchEnabled} ${ignoreself ? cb.valueChecked : cb.valueUnchecked} ${cb.sizeDefault} ${cb.themeDefault}">
                    <input type="checkbox" class="${cb.checkboxEnabled}" value="${ignoreself ? 'on' : 'off'}">
                </div>
            </div>
            <div class="${ED.classMaps.divider} ${sw.dividerDefault}"></div>
            <div class="${a.vertical} ${a.justifyStart} ${a.alignStretch} ${a.noWrap} ${sw.switchItem}" style="flex: 1 1 auto;">
                <div class="${a.horizontal} ${a.justifyStart} ${a.alignStart} ${a.noWrap}" style="flex: 1 1 auto;">
                <h3 class="${sw.titleDefault}" style="flex: 1 1 auto;">Ignore bots</h3>
                <div id="textmention-igbots-cb" class="${cb.switchEnabled} ${ignorebots ? cb.valueChecked : cb.valueUnchecked} ${cb.sizeDefault} ${cb.themeDefault}">
                    <input type="checkbox" class="${cb.checkboxEnabled}" value="${ignorebots ? 'on' : 'off'}">
                </div>
            </div>
            <div class="${ED.classMaps.divider} ${sw.dividerDefault}"></div>
            <div id="textmention-ml">
                <div class="${h.defaultColor} ${h.h3}">Mention list:</div>
                ${list}
            </div>
            <div style="margin-top:5px">
                <button type="button" id="textmention-addword-btn" class="${btn.button} ${btn.sizeMin} ${btn.grow} ${btn.lookFilled} ${btn.colorBrand}" style="width:100px;display:inline-block"><div class="contents-18-Yxp">Add word</div></button>
                <button type="button" id="textmention-savelist-btn" class="${btn.button} ${btn.sizeMin} ${btn.grow} ${btn.lookFilled} ${btn.colorBrand}" style="width:100px;display:inline-block"><div class="contents-18-Yxp">Save list</div></button>            
            </div>
        </div>`;
    },
    settingListeners: [
        {
            el: '#textmention-igself-cb',
            type: 'click',
            eHandler: e => {
                const cbM = window.ED.classMaps.checkbox;
                let s = module.exports.settings;
                if(e.target.value == 'on') {
                    e.target.parent().className = e.target.parent().className.replace(cbM.valueChecked, cbM.valueUnchecked);
                    e.target.value = 'off';
                    s.ignoreself = false;
                } else {
                    e.target.parent().className = e.target.parent().className.replace(cbM.valueUnchecked, cbM.valueChecked);
                    e.target.value = 'on';
                    s.ignoreself = true;
                }
                EDApi.saveData(module.exports.id, 'ignoreself', s.ignoreself);
            }
        },
        {
            el: '#textmention-igbots-cb',
            type: 'click',
            eHandler: e => {
                const cbM = window.ED.classMaps.checkbox;
                let s = module.exports.settings;
                if(e.target.value == 'on') {
                    e.target.parent().className = e.target.parent().className.replace(cbM.valueChecked, cbM.valueUnchecked);
                    e.target.value = 'off';
                    s.ignorebots = false;
                } else {
                    e.target.parent().className = e.target.parent().className.replace(cbM.valueUnchecked, cbM.valueChecked);
                    e.target.value = 'on';
                    s.ignorebots = true;
                }
                EDApi.saveData(module.exports.id, 'ignorebots', s.ignorebots);
            }
        },
        {
            el: '#textmention-addword-btn',
            type: 'click',
            eHandler: e => {
                document.getElementById("textmention-ml").innerHTML += `<input type="text" value="word" class="${findModule('input').inputDefault} textmention-mentionlist" style="margin-top:5px"><br>\n`;
            }
        },
        {
            el: '#textmention-savelist-btn',
            type: 'click',
            eHandler: e => {
                let s = module.exports.settings;
                let list = [];
                $('.textmention-mentionlist').each((i,el) => {
                    if($(el).val() == '') return;
                    list.push($(el).val());
                });
                s.mentionlist = list;
                EDApi.saveData(module.exports.id, 'mentionlist', list);
            }
        }
    ]
});

function checkAuthor(msg) {
    const getu = findModule('getUser').getUser;
    const user = findModule('getCurrentUser').getCurrentUser();
    const settings = module.exports.settings;
    const conf = module.exports.config;
    const ignoreself = settings.ignoreself == undefined ? conf.ignoreself : settings.ignoreself;
    const ignorebots = settings.ignorebots == undefined ? conf.ignorebots : settings.ignorebots;
    const usertocheck = getu(msg.author.id);

    if(ignoreself && msg.author.id == user.id) return true;
    if(!usertocheck) return false;
    if(ignorebots && usertocheck.bot) return true;
    return false;
}