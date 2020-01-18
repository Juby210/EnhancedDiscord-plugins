const Plugin = require('../plugin')

module.exports = new Plugin({
    name: '@all',
    author: 'Juby210#0577',
    description: 'Mention all members when @all (@everyone without permissions)',
    color: '#f44336',

    load: async () => {
        const { getGuild } = findModule('getGuild'),
            { getUser } = findModule('getCurrentUser'),
            { getGuildId } = findModule('getLastSelectedGuildId'),
            { getMembers } = findModule('getMembers')

        const m = EDApi.findModuleByDisplayName('ChannelEditorContainer').prototype
        monkeyPatch(m, 'render', { before: b => {
            let { textValue } = b.thisObject.props
            let gID = getGuildId()
            let g = getGuild(gID)

            if(!gID || !g || !textValue || !textValue.includes('@all')) return

            let members = getMembers(gID)
            members.forEach(mem => {
                if(getUser(mem.userId).bot) return
                textValue += ' <@' + mem.userId + '>'
            })

            textValue = textValue.replace(' @all', '').replace('@all', '')
            if(b.thisObject.props.textValue == textValue) return
            b.thisObject.props.textValue = textValue
            const { richValue } = b.thisObject.props
            if(richValue && richValue._map && richValue._map._root && Array.isArray(richValue._map._root.entries)) {
                let newRichValue = findModule('deserialize').deserialize(textValue)
                richValue._map._root.entries.forEach((v, i) => {
                    if(v[0] == "selection") newRichValue._map._root.entries[i] = v
                })
                b.thisObject.props.richValue = newRichValue
            }
        }, silent: true })
    },
    unload: () => {
        const m = EDApi.findModuleByDisplayName('ChannelEditorContainer').prototype.render
        if(m.__monkeyPatched) m.unpatch()
    }
})
