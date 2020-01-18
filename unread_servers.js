const Plugin = require('../plugin')

module.exports = new Plugin({
    name: "Unread Servers",
    author: "Juby210#0577",
    description: "Open unread server list on ctrl+s",
    color: "#ff0000",

    load: () => {
        const { React, React: { createElement: e } } = EDApi
        module.exports.Modal = class extends React.Component {
            render() {
                const hc = EDApi.findModuleByProps('header', 'botTag', 'listAvatar')
                const chu = findModule('hasUnread').hasUnread
                const channels = Object.values(findModule('getChannels').getChannels())
                const { selectChannel } = findModules('selectChannel')[1]

                // why { findModuleByDisplayName } = EDApi doesn't work on newest ED..
                const Modal = findModule('CloseButton')
                const Title = EDApi.findModuleByDisplayName('FormTitle')
                const Scroller = EDApi.findModuleByDisplayName('VerticalScroller')
                const IconWrapper = EDApi.findModuleByDisplayName('GuildIconWrapper')

                const sc = e(Scroller, { children: [], style: { 'margin-top': '5px' } })
                this.props.guilds.forEach(g => {
                    let cid = channels.filter(c => c.guild_id == g.id && chu(c.id))
                    let cid2 = cid.find(c => !findModule('isMuted').isChannelMuted(g.id, c.id))
                    if(cid2) cid = cid2.id;
                    else cid = cid[0].id;

                    sc.props.children.push(e('div', { className: hc.listRow, onClick: () => { selectChannel(g.id, cid); this.props.onClose() } },
                        e(IconWrapper, { guild: g }),
                        e('div', { className: hc.listRowContent, style: { 'margin-left': '5px' } }, e('div', { className: hc.listName }, g.name))
                    ))
                })

                return e(Modal, {},
                    e(Modal.Header, {}, e(Title, { tag: 'h4' }, 'Unread Servers'),
                        e(Modal.CloseButton, { onClick: this.props.onClose })
                    ), sc
                )
            }
        }

        document.addEventListener("keyup", module.exports.onkey)
	},
    unload: () => {
        document.removeEventListener("keyup", module.exports.onkey)
    },

    onkey: e => {
        if (e.ctrlKey && e.key == 's') {
            const gs = findModule('getGuilds').getGuilds()
            const hu = findModule('getGuildUnreadCount').hasUnread
            const guilds = Object.values(gs).filter(g => hu(g.id))

            findModule('pushLazy').push(module.exports.Modal, { guilds })
        }
    }
})
