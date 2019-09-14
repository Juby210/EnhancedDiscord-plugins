const Plugin = require('../plugin');

module.exports = new Plugin({
    name: 'Bots Mutual Guilds',
    author: 'Juby210#2100',
    description: 'Brings back mutual servers to bot accounts',
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
        let nt = findModules("nameTag")[1];

        if(el.classList.contains(findModules("modal")[2].modal.split(" ")[0]) && $(el).find("."+nt.nameTag.split(" ")[0]).length != 0 
            && $(el).find("."+findModules("botTag")[2].botTag.split(" ")[0]).length != 0) {
            console.log("aaabmg")
            let hc = EDApi.findModuleByProps("header", "botTag", "listAvatar")
            let c = findModule("tabBarContainer")
            let c2 = EDApi.findModuleByProps("item", "selected", "themed")
            let m = findModule("Messages").Messages

            let sc = findModule('scrollerWrap')
            let ic = EDApi.findModuleByProps("iconSizeMedium", "iconInactive")

            $(el).find("."+hc.header.split(" ")[0]).parent()
                .append(`<div class="${c.tabBarContainer}"><div class="${c.tabBar}"><div id="bmg0" class="${c.tabBarItem} ${c2.item} ${c2.selected} ${c2.themed}" role="button" style="border-color:rgb(255,255,255)">
                ${m["USER_INFO"]}</div><div id="bmg" class="${c.tabBarItem} ${c2.item} ${c2.themed}" role="button">${m["MUTUAL_GUILDS"]}</div></div></div>`)

            let old
            $(el).find("#bmg").click(() => {
                if($(el).find("#bmg").hasClass(c2.selected)) return;

                $(el).find("#bmg0").removeClass(c2.selected).css("border-color", "transparent")
                $(el).find("#bmg").addClass(c2.selected).css("border-color", "rgb(255,255,255)")

                old = $(el).find("."+hc.body.split(" ")[0]).html()
                $(el).find("."+hc.body.split(" ")[0]).html(`<div class="${sc.scrollerWrap} ${sc.scrollerThemed} ${sc.scrollerFade}"><div id="bmgl" class="${sc.scroller} ${sc.systemPad}"></div></div>`)
            
                let un = $(el).find("."+nt.username.split(" ")[0]).text()
                let dr = $(el).find("."+nt.discriminator.split(" ")[0]).text().replace("#", "")
                let id = Object.values(findModule("getUsers").getUsers()).find(u => u.username == un && u.discriminator == dr).id
                
                let guilds = []
                Object.keys(findModule("getGuilds").getGuilds()).forEach(g => {
                    let u = findModule("getNick").getMembers(g).find(u => u.userId == id)
                    if(u) guilds.push({g: findModule("getGuilds").getGuild(g), nick: u.nick})
                })

                guilds.forEach(g => {
                    $(el).find("#bmgl").append($(`<div class="${hc.listRow}" role="button"><div class="${ic.icon} ${hc.listAvatar} ${ic.iconSizeMedium} ${ic.iconInactive}" role="button" style="background-image: url(&quot;https://cdn.discordapp.com/icons/${g.g.id}/${g.g.icon}.webp?size=128&quot;);"></div>
                    <div class="${hc.listRowContent}"><div class="${hc.listName}">${g.g.name}</div><div class="${hc.guildNick}">${g.nick ? g.nick : ""}</div></div></div></div>`)
                        .click(() => module.exports.select(g.g.id)))
                })
            })

            $(el).find("#bmg0").click(() => {
                if($(el).find("#bmg0").hasClass(c2.selected)) return;

                $(el).find("#bmg").removeClass(c2.selected).css("border-color", "transparent")
                $(el).find("#bmg0").addClass(c2.selected).css("border-color", "rgb(255,255,255)")

                $(el).find("."+hc.body.split(" ")[0]).html(old)
            })
        }
    },
    select: g => {
        let cid = Object.values(findModule("getChannels").getChannels()).filter(c => c.guild_id == g)[0].id
        findModules('selectChannel')[1].selectChannel(g, cid)
    }
});