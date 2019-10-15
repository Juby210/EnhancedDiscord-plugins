const Plugin = require('../plugin');
const Clipboard = require("electron").clipboard;

// contains modified code from https://github.com/joe27g/EnhancedDiscord/blob/master/plugins/avatar_links.js
// credits to joe & rauenzi

module.exports = new Plugin({
    name: 'Copy Mention',
    author: 'Juby210#2100',
    description: 'Add "Copy Mention" button to easy copy id mention of channel or user',
    color: '#09123b',

    load: () => {
        findModule('dispatch').subscribe('CONTEXT_MENU_OPEN', module.exports.listener)
    },
    unload: () => {
        findModule('dispatch').unsubscribe('CONTEXT_MENU_OPEN', module.exports.listener)
    },

    listener: async () => {
        await module.exports.sleep(5)
        const menu = document.querySelector('.' + findModule('contextMenu').contextMenu.split(' ')[0])
        if(!menu) return;
        const reactData = menu.__reactInternalInstance$

        let label = ''
        let content = ''

        // For channels
        if(reactData.memoizedProps && reactData.memoizedProps.children &&
            reactData.memoizedProps.children[2] &&
            reactData.memoizedProps.children[2].props) {

            let props = reactData.memoizedProps.children[2].props
            if(props.channel) {
                label = 'Copy Channel Mention'
                content = `<#${props.channel.id}>`
            } else if (props.id) { // DM Groups
                label = 'Copy Channel Mention'
                content = `<#${props.id}>`
            }
        }

        // For users
        if(reactData.return && reactData.return.return &&
            reactData.return.return.return &&
            reactData.return.return.return.return &&
            reactData.return.return.return.return.memoizedProps &&
            reactData.return.return.return.return.memoizedProps.user) {

            label = 'Copy User Mention'
            content = `<@${reactData.return.return.return.return.memoizedProps.user.id}>`
        }

        if(label == '') return;
        module.exports.addMenuItem(content, label)
    },
    addMenuItem: (content, label) => {
        let c = findModule('contextMenu')
        let cmGroups = document.getElementsByClassName(c.itemGroup.split(' ')[0])
        if(!cmGroups || cmGroups.length == 0) return;
    
        let item = document.createElement('div')
        item.className = c.item + ' ' + c.clickable
        let itemLabel = document.createElement("div")
        itemLabel.className = c.label
        itemLabel.innerHTML = label
        item.appendChild(itemLabel)
    
        let lastGroup = cmGroups[cmGroups.length-1]
        lastGroup.appendChild(item)
    
        item.onclick = () => {
            Clipboard.write({text: content});
            findModule('closeContextMenu').closeContextMenu()
        }
    }
});