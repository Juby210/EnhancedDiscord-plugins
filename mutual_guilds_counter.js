const Plugin = require('../plugin');

module.exports = new Plugin({
    name: 'Mutual Guilds Counter',
    author: 'Juby210#2100',
    description: 'Mutual guilds counter',
    color: 'aqua',

    load: () => {
        findModule("dispatch").subscribe("USER_PROFILE_MODAL_SET_SECTION", module.exports.check)
    },
    unload: () => {
        findModule("dispatch").unsubscribe("USER_PROFILE_MODAL_SET_SECTION", module.exports.check)
    },

    check: arg => {
        if(arg.section == "MUTUAL_GUILDS") module.exports.listener()
    },
    listener: async () => {
        await module.exports.sleep(10)

        let c2 = EDApi.findModuleByProps("item", "selected", "themed")
        let modal = document.querySelector("."+findModules("modal")[3].modal.split(" ")[0])
        if(!modal) return;
        let scroller = modal.querySelector("."+findModule("scrollerWrap").scroller.split(" ")[0])
        
        let count = scroller.childNodes.length
        let elm = Array.from(modal.getElementsByClassName(c2.item.split(" ")[0]))[1]
        if(elm.innerText.includes(" [") && elm.innerText.includes("]")) {
            elm.innerText = elm.innerText.split(" [")[0]
        }
        elm.innerText += ` [${count}]`
    }
});