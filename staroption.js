const Plugin = require('../plugin')

module.exports = new Plugin({
    name: 'Star Option',
    author: 'Juby210#0577',
    description: 'Star option in message options',
    color: '#FFD700',

    load: () => {
        const { React: { createElement: e } } = EDApi
        document.head.insertAdjacentHTML("beforeend", '<style id="staroption-css">.staroptionBtn {opacity: 0.8}</style>')

        // why { findModuleByDisplayName } = EDApi doesn't work on newest ED..
        monkeyPatch(EDApi.findModuleByDisplayName("MessageContent").prototype, "render", b => {
            let { renderButtons } = b.thisObject.props
            if(renderButtons) {
                b.thisObject.props.renderButtons = arg => {
                    const res = renderButtons(arg)
                    if(res.props.children && !arg.message.reactions.find(r => r.emoji.name == "⭐" && r.me)) {
                        if(!res.props.children.props.children[1]) return res // no permission to add reaction

                        res.props.children.props.children.unshift(e("img", {
                            src: "https://canary.discordapp.com/assets/e4d52f4d69d7bba67e5fd70ffe26b70d.svg",
                            alt: "Star",
                            onClick: () => module.exports.star(arg),
                            className: findModule("reactionBtn").reactionBtn + " staroptionBtn"
                        }))
                    }
                    return res
                }
            }
            return b.callOriginalMethod(b.methodArguments)
        })
    },
    unload: () => {
        let m = EDApi.findModuleByDisplayName("MessageContent").prototype.render
        if(m.__monkeyPatched) m.unpatch()
        let el = document.getElementById("staroption-css")
        if(el) el.parentElement.removeChild(el)
    },

    star: t => {
        findModule("addReaction").addReaction(t.message.channel_id, t.message.id, { name: "⭐" })
    }
});