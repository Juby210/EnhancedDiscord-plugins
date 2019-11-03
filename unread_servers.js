const Plugin = require('../plugin')
const { React, React: { createElement: e }, injectCSS, clearCSS,
    findModuleByDisplayName, findModuleByProps } = EDApi

module.exports = new Plugin({
    name: "Unread Servers",
    author: "Juby210#2100",
    description: "Open unread server list on ctrl+s",
    color: "#ff0000",

    load: () => {
        document.addEventListener("keyup", module.exports.onkey)
        injectCSS('uspcss', `.uspsico {height: 48px; width: 48px; border-radius: 50%; display: inline;}`)
	},
    unload: () => {
        document.removeEventListener("keyup", module.exports.onkey)
        clearCSS('uspcss')
    },

    onkey: e => {
        if (e.ctrlKey && e.key == 's') {
            const gs = findModule('getGuilds').getGuilds()
            const hu = findModule('getGuildUnreadCount').hasUnread
            const guilds = Object.values(gs).filter(g => hu(g.id))

            findModule('push').push(module.exports.Modal, { guilds })
        }
    },

    Modal: class extends React.Component {
        render() {
            const hc = findModuleByProps('header', 'botTag', 'listAvatar')
            const chu = findModule('hasUnread').hasUnread
            const channels = Object.values(findModule('getChannels').getChannels())
            const { selectChannel } = findModules('selectChannel')[1]

            const Modal = findModule('CloseButton')
            const Title = findModuleByDisplayName('FormTitle')
            const Scroller = findModuleByDisplayName('VerticalScroller')
            const IconWrapper = findModuleByDisplayName('GuildIconWrapper')

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
});
