const Plugin = require('../plugin');

module.exports = new Plugin({
    name: 'Online Friends Count',
    author: 'Juby210#2100',
    description: "Adds the number of online friends in right above the list.",
    color: 'indigo',

    load: () => {
        const at = findModule('ActionTypes').ActionTypes;
        const s = findModule('default');

        monkeyPatch(s.default, 'dispatch', b => {
            if(b.methodArguments[0].type == at.PRESENCE_UPDATE) module.exports.update();
            return b.callOriginalMethod(b.methodArguments);
        });
        module.exports.update()
    },
    unload: () => {
        let m = findModule('default').default.dispatch;
        if(m.__monkeyPatched) m.unpatch();
    },

    update: () => {
        const friendsClass = window.findModule('friendsOnline').friendsOnline;
        const guildSep = window.findModule('guildSeparator').guildSeparator;

        let onlineCount = document.getElementById('online_friends_count');
        let cnt = findModules('getState')[1].getState().onlineFriends.size;
        if (onlineCount) {
            onlineCount.innerHTML = cnt + ' Online';
            return b.callOriginalMethod(b.methodArguments);
        }
        let gs = document.querySelector(`.${guildSep.split(' ')[0]}`);
        if (gs) {
            onlineCount = document.createElement('div');
            onlineCount.className = friendsClass;
            onlineCount.innerHTML = cnt + ' Online';
            onlineCount.id = 'online_friends_count';
            onlineCount.style.marginLeft = '15px';
            try { gs.parentElement.insertBefore(onlineCount, gs); } catch(err) { module.exports.error(err); }
        }
    }
});
