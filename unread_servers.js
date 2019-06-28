const Plugin = require("../plugin");
let JubyLib;

module.exports = new Plugin({
    name: "Unread Servers",
    author: "Juby210#2100",
    description: "Open unread server list on ctrl+s",
    color: "#ff0000",
    JubyLib: JubyLib,

    load: async () => {
        await module.exports.loadLib();
        document.addEventListener("keyup", module.exports.onkey);
	},
    unload: () => {
        document.removeEventListener("keyup", module.exports.onkey);
    },

    onkey: e => {
        let c = findModules('pill')[3];
        if (e.ctrlKey && e.key == 's') {
            let content = '';
            $(`.${c.pill.split(' ')[0]}`).each((i, p) => {
                if($(p).children().first().attr('style') == 'opacity: 0.7; height: 8px; transform: translate3d(0px, 0px, 0px);') {
                    let el = $(p).parent().find(`.${c.blobContainer.split(' ')[0]}`).clone();
                    let h = $(el).find('.wrapper-1BJsBx').attr('href').split('/');
                    $(el).find('.wrapper-1BJsBx').attr('href', `javascript:findModule('selectChannel').selectChannel('${h[2]}','${h[3]}');`);
                    content += `<div style="color:white"><div style="display:inline-block">${$(el).html()}</div><h1 style="display:inline;margin-left:5px">${$(el).find('.wrapper-1BJsBx').attr('aria-label')}</h1></div>`;
                }
            });
            JubyLib.popup("Unread servers", content);
        }
    },
    loadLib: () => {
        return new Promise((resolve, reject) => {
            require('request')({url:`https://juby210-pl.github.io/EnhancedDiscord-plugins/lib/JubyLib.js`},(err,res,body)=> {
                JubyLib = eval(body);
                resolve();
            });
        });
    }
});
