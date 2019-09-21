const Plugin = require('../plugin');
const request = require('request');
let cache = {};

module.exports = new Plugin({
    name: 'DiscordBots Bot Info',
    author: 'Juby210#2100',
    description: 'Show DiscordBots.org bot info on bot profile',
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
            
            let un = $(el).find("."+nt.username.split(" ")[0]).text()
            let dr = $(el).find("."+nt.discriminator.split(" ")[0]).text().replace("#", "")
            let id = Object.values(findModule("getUsers").getUsers()).find(u => u.username == un && u.discriminator == dr).id

            if(cache[id] && cache[id].d + (60 * 60 * 1000) >= Date.now()) {
                module.exports.parse(id, el, 200, cache[id].body)
            } else {
                request(`https://discordbots.org/bot/${id}`, (err, res, body) => {
                    if(err) return console.error(err);
    
                    module.exports.parse(id, el, res.statusCode, body)
                    if(res.statusCode == 200) cache[id] = { body, d: Date.now() }
                })
            }
        }
    },
    parse: (id, el, code, body) => {
        let hc = EDApi.findModuleByProps("header", "botTag", "listAvatar")
        let sc = findModule("scrollerWrap")

        let scroller = $(el).find("."+sc.scroller.split(" ")[0])
        let di = $(scroller).find("."+hc.userInfoSection.split(" ")[0]).clone()
        $(di).find("."+hc.userInfoSectionHeader.split(" ")[0]).html("Bot Info")
        let m = $(di).find("textarea").parent().attr("class", findModule("markup").markup)
        $(m).html("Bot not found on discordbots.org")
        $(scroller).append(di)

        if(code == 200) {
            let r = $(body)
            let web = $(r).find("#websitelink").attr("href")
            web = web ? `<a href="${web}" rel="noreferrer noopener" target="_blank">${web}</a>` : "-"
            let github = $(r).find("#github").attr("href")
            github = github ? `<a href="${github}" rel="noreferrer noopener" target="_blank">${github}</a>` : "-"
            let owners = []
            $(r).find("#createdby").find("span").each((i, name) => {
                owners.push(`<a href="https://discordbots.org${$(name).parent().attr("href")}" rel="noreferrer noopener" target="_blank">${$(name).text().replace(/	/g, "").replace(new RegExp("\n", "g"), "")}</a>`)
            })
            let tags = []
            $(r).find(".atag").each((i, name) => {
                tags.push($(name).text().replace(/	/g, "").replace(new RegExp("\n", "g"), ""))
            })
            let n = "&nbsp;".repeat(15)
            let shards = ""
            if($(r).find(".votebutton")[2].text() != $(r).find(".votebutton").last().text()) {
                shards = `${n}<strong>Shards</strong>: ${$(r).find(".votebutton").last().text().replace(/	/g, "").split("\n")[1].split(" ")[0]}`
            }

            $(m).html(`<strong>Description</strong>: ${$(r).find(".bot-description").text().replace(/	/g, "").replace(new RegExp("\n", "g"), "")}
<a href="${$(r).find(".votebutton").first().parent().attr("href")}" rel="noreferrer noopener" target="_blank">[Invite]</a>\n<strong>Website</strong>: ${web}\n<strong>Github</strong>: ${github}
<strong>Prefix</strong>: ${$(r).find("#prefix").first().text().replace(/	/g, "").replace(new RegExp("\n", "g"), "")}
<strong>Lib</strong>: ${$(r).find("#libclick").text().replace(/	/g, "").replace(new RegExp("\n", "g"), "")}\n<strong>Owners</strong>: ${owners.join(", ")}
<strong>Tags</strong>: ${tags.join(", ")}\n<strong>Votes</strong>: ${$(r).find("#points").text().replace(/	/g, "").replace(new RegExp("\n", "g"), "")}${n}<strong>Servers</strong>: ${$(r).find(".votebutton")[2].text().replace(/	/g, "").split("\n")[1]}${shards}
<a href="https://discordbots.org/bot/${id}" rel="noreferrer noopener" target="_blank">[Show on discordbots.org]</a>`)
        }
    }
});