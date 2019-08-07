const Plugin = require("../plugin");
let JubyLib;

module.exports = new Plugin({
    name: "Unread Servers",
    author: "Juby210#2100",
    description: "Open unread server list on ctrl+s",
    color: "#ff0000",
    version: 1.02,

    load: async () => {
        await module.exports.loadLib();
        document.addEventListener("keyup", module.exports.onkey);
        JubyLib.injectCSS('uspcss', `.uspsico {height: 48px; width: 48px; border-radius: 50%; display: inline;}`)
        JubyLib.updatesModule.check("https://raw.githubusercontent.com/juby210-PL/EnhancedDiscord-plugins/master/plugins_versions.json", module.exports, "https://raw.githubusercontent.com/juby210-PL/EnhancedDiscord-plugins/master/unread_servers.js");
	},
    unload: () => {
        document.removeEventListener("keyup", module.exports.onkey)
        JubyLib.clearCSS('uspcss')
    },

    onkey: e => {
        if (e.ctrlKey && e.key == 's') {
            let gs = findModule('getGuilds').getGuilds()
            let chu = findModule('hasUnread').hasUnread
            let hu = findModule('getGuildUnreadCount').hasUnread
            let channels = module.exports.objToArray(findModule('getChannels').getChannels())
            let content = ''
            Object.keys(gs).forEach(k => {
                let g = gs[k]
                if(hu(g.id)) {
                    let cid = channels.filter(c => c.guild_id == g.id && chu(c.id))
                    let cid2 = cid.filter(c => !findModule('isMuted').isChannelMuted(g.id, c.id))[0]
                    if(cid2) cid = cid2.id;
                    else cid = cid[0].id;

                    content += `<div style="color:white"><a href="javascript:findModules('selectChannel')[1].selectChannel('${g.id}','${cid}')"><div>
                        <img src="https://cdn.discordapp.com/icons/${g.id}/${g.icon}" class="uspsico"></img><h1 style="display:inline-block;margin-left:5px;color:white">${g.name}<h1></div></a></div>`
                }
            })
            JubyLib.popup("Unread Servers", content)
        }
    },
    objToArray: obj => {
        let arr = []
        Object.keys(obj).forEach(k => {
            arr.push(obj[k])
        })
        return arr
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
