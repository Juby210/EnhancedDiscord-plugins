window.EDPluginsUpdater = { updates: [] }

// based on https://github.com/rauenzi/BDPluginLibrary/blob/master/src/modules/pluginupdater.js

window.EDPluginsUpdater.check = (plugin, url) => {
    if(!plugin.version) return
    let version = String(plugin.version)
    if(version.length == 1) version += ".0.0"
    if(version.split(".").length == 2) version = `${version.split(".")[0]}.${version.split(".")[1][0]}.${version.split(".")[1][1]}`
    if(!url) url = `https://juby210-pl.github.io/EnhancedDiscord-plugins/${plugin.id}.js`

    require("request")(url, (err, resp, res) => {
        if(err) return console.error(plugin.name, "Failed to check update", err)

        let latestVersion = res.match(/['"][0-9]+\.[0-9]+\.[0-9]+['"]/i)
        if(!latestVersion) return
        latestVersion = latestVersion[0].replace(/['"]/g, "")

        let versionOld = version.split(".")
        let versionNew = latestVersion.split(".")

        if(versionNew[0] > versionOld[0] || (versionNew[0] == versionOld[0] && versionNew[1] > versionOld[1])
        || (versionNew[0] == versionOld[0] && versionNew[1] == versionOld[1] && versionNew[2] > versionOld[2])) {

            window.EDPluginsUpdater.updates.push({ name: plugin.name, url, id: plugin.id, r: plugin.reload })
            window.EDPluginsUpdater.displayNotice()
        }
    })
}

window.EDPluginsUpdater.displayNotice = () => {
    if(!document.getElementById("EDPUNotice")) {
        const c = findModule("noticeInfo")

        document.querySelector("." + EDApi.findModuleByProps("app", "layers").app.split(" ")[0]).insertAdjacentHTML("afterbegin",
        `<div class="${c.notice} ${c.noticePremium}" id="EDPUNotice"><div class="${c.dismiss}" id="EDPUN-dismiss"></div><span class="notice-message">The following ED plugins have updates:</span>&nbsp;&nbsp;<strong id="EDPUN-outdatedPlugins"></strong></div>`)

        document.getElementById("EDPUN-dismiss").addEventListener("click", () => document.getElementById("EDPUNotice").outerHTML = "")
    }

    window.EDPluginsUpdater.updates.forEach(p => {
        if(!document.getElementById(p.id + "-updateNotice")) {
            let element = document.createElement("span"), outdated = document.getElementById("EDPUN-outdatedPlugins")

            element.setAttribute("id", p.id + "-updateNotice")
            element.innerText = p.name
            element.addEventListener("click", () => window.EDPluginsUpdater.download(p))

            if(outdated.getElementsByTagName("span")[0]) outdated.insertAdjacentHTML("beforeend", "<span class='separator'>, </span>")
			outdated.appendChild(element)
        }
    })
}

window.EDPluginsUpdater.download = p => {
    const req = require("request"), { writeFileSync } = require("fs"), { join } = require("path")

    req(p.url, (err, resp, res) => {
        if(err) {
            console.log(err)
            return EDApi.showToast(`Failed to download ${p.name} update!`, { type: "error" })
        }

        let latestVersion = res.match(/['"][0-9]+\.[0-9]+\.[0-9]+['"]/i)[0].replace(/['"]/g, ""), fn = p.id + ".js"

        writeFileSync(join(process.env.injDir, 'plugins', fn), res)

        let outdated = document.getElementById("EDPUN-outdatedPlugins")
        let el = outdated.querySelector("#" + p.id + "-updateNotice")
        if(el) el.parentElement.removeChild(el)
        if(outdated.getElementsByTagName("span").length == 0) outdated.parentElement.outerHTML = ""

        let arr = window.EDPluginsUpdater.updates
        arr.splice(arr.findIndex(pe => pe.id == p.id), 1)
        EDApi.showToast(`${p.name} was updated to v${latestVersion}`, { type: "success" })
        try { p.r() } catch(e) {
            console.error("Failed to reload plugin", p.name, e)
        }
    })
}