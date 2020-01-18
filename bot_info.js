const Plugin = require('../plugin')
const request = require('request')
let cache = {}

module.exports = new Plugin({
    name: 'DiscordBots Bot Info',
    author: 'Juby210#0577',
    description: 'Show Top.gg bot info on bot profile',
    color: 'aqua',

    load: () => {
        findModule("dispatch").subscribe("USER_PROFILE_MODAL_OPEN", module.exports.check)
    },
    unload: () => {
        findModule("dispatch").unsubscribe("USER_PROFILE_MODAL_OPEN", module.exports.check)
    },

    check: arg => {
        let el = $("."+findModule(m => m.modal && m.inner && !m.close).modal.split(" ")[0])
        if(el.length == 0) {
            setTimeout(() => module.exports.check(arg), 100)
            return;
        }
        // why { findModuleByDisplayName } = EDApi doesn't work on newest ED..
        if(EDApi.findModuleByProps("getUser", "getUsers").getUser(arg.userId).bot) module.exports.listener(el, arg.userId)
    },
    listener: (el, id) => {
        if(cache[id] && cache[id].d + (60 * 60 * 1000) >= Date.now()) {
            module.exports.parse(id, el, 200, cache[id].body)
        } else {
            request(`https://top.gg/bot/${id}`, (err, res, body) => {
                if(err) return console.error(err)

                module.exports.parse(id, el, res.statusCode, body)
                if(res.statusCode == 200) cache[id] = { body, d: Date.now() }
            })
        }
    },
    parse: (id, el, code, body) => {
        let hc = EDApi.findModuleByProps("header", "botTag", "listAvatar")
        let sc = findModule("scrollerWrap")

        let scroller = $(el).find("."+sc.scroller.split(" ")[0])
        let di = $(scroller).find("."+hc.userInfoSection.split(" ")[0]).clone()
        $(di).find("."+hc.userInfoSectionHeader.split(" ")[0]).html("Bot Info")
        let m = $(di).find("textarea").parent().attr("class", findModule("markup").markup)
        $(m).html("Bot not found on top.gg")
        $(scroller).append(di)

        if(code == 200) {
            let r = $(body)
            let web = $(r).find("#websitelink").attr("href")
            web = web ? `<a href="${web}" rel="noreferrer noopener" target="_blank">${web}</a>` : "-"
            let github = $(r).find("#github").attr("href")
            github = github ? `<a href="${github}" rel="noreferrer noopener" target="_blank">${github}</a>` : "-"
            let owners = []
            $(r).find("#createdby").find("span").each((i, name) => {
                owners.push(`<a href="https://top.gg${$(name).parent().attr("href")}" rel="noreferrer noopener" target="_blank">${$(name).text().replace(/	/g, "").replace(new RegExp("\n", "g"), "")}</a>`)
            })
            let tags = []
            $(r).find(".atag").each((i, name) => {
                tags.push($(name).text().replace(/	/g, "").replace(new RegExp("\n", "g"), ""))
            })
            let n = "&nbsp;".repeat(15)
            let serversshards = ""
            if($(r).find(".serversshards .votebutton").length == 1) {
                serversshards = `${n}<strong>Servers</strong>: ${$(r).find(".serversshards .votebutton").first().text().replace(/	/g, "").split("\n")[1]}`
            } else if ($(r).find(".serversshards .votebutton").length > 1) {
                serversshards = `${n}<strong>Servers</strong>: ${$(r).find(".serversshards .votebutton").first().text().replace(/	/g, "").split("\n")[1]}`
                serversshards += `${n}<strong>Shards</strong>: ${$(r).find(".serversshards .votebutton").last().text().replace(/	/g, "").split("\n")[1].split(" ")[0]}`
            }

            $(m).html(`<strong>Description</strong>: ${$(r).find(".bot-description").text().replace(/	/g, "").replace(new RegExp("\n", "g"), "")}
<a href="${$(r).find(".votebutton").first().parent().attr("href")}" rel="noreferrer noopener" target="_blank">[Invite]</a>\n<strong>Website</strong>: ${web}\n<strong>Github</strong>: ${github}
<strong>Prefix</strong>: ${$(r).find("#prefix").first().text().replace(/	/g, "").replace(new RegExp("\n", "g"), "")}
<strong>Lib</strong>: ${$(r).find("#libclick").text().replace(/	/g, "").replace(new RegExp("\n", "g"), "")}\n<strong>Owners</strong>: ${owners.join(", ")}
<strong>Tags</strong>: ${tags.join(", ")}\n<strong>Votes</strong>: ${$(r).find("#points").text().replace(/	/g, "").replace(new RegExp("\n", "g"), "")}${serversshards}
<a href="https://top.gg/bot/${id}" rel="noreferrer noopener" target="_blank">[Show on top.gg]</a>`)
        }
    }
});