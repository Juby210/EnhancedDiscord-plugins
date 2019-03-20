const Plugin = require('../plugin');

module.exports = new Plugin({
    name: '@all',
    author: 'Juby210#2100',
    description: 'Mention all members when @all',
    color: '#f44336',

    load: async () => {
        const gg = findModule('getGuild'), gu = findModule('getUser').getUser, lg = findModule('getLastSelectedGuildId'), gm = findModule('getMembers').getMembers;

        module.exports.lis = e => {
            let text = e.target.value;

            let guildID = lg.getLastSelectedGuildId();
            let g = gg.getGuild(guildID);

            if (!guildID || !g || !text || !text.includes('@all')) return;

            let members = gm(guildID);
            members.forEach(mem => {
                if(gu(mem.userId).bot) return;
                text += ' <@' + mem.userId + '>';
            });

            text = text.replace(' @all', '').replace('@all', '');
            if (e.target.value == text) return;
            e.target.value = text;
        };
        document.addEventListener("input", module.exports.lis);
    },
    unload: () => {
        document.removeEventListener("input", module.exports.lis);
        module.exports.lis = null;
    }
});