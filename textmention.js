const Plugin = require('../plugin');
const mentionlist = ["a", "b"];
const ignoreself = true;

module.exports = new Plugin({
    name: 'Text Mention',
    author: 'Juby210#2100',
    description: 'Mention you when your username is in message content',
    color: 'red',

    load: () => {
        const at = findModule('ActionTypes').ActionTypes;
        const s = findModule('default');

        monkeyPatch(s.default, 'dirtyDispatch', b => {
            let a = b.methodArguments[0];
            if(a.type != at.MESSAGE_CREATE) return b.callOriginalMethod(b.methodArguments);

            if(ignoreself && checkAuthor(a.message)) return b.callOriginalMethod(b.methodArguments);
            let hm = false;
            mentionlist.forEach(mw => {
                if(a.message.content.includes(mw)) hm = true;
            });
            if(hm) a.message.mention_everyone = true;
            return b.callOriginalMethod(b.methodArguments);
        });
        monkeyPatch(findModule('isMentioned'), 'isMentioned', b => {
            let m = b.methodArguments[0];
            if(ignoreself && checkAuthor(m)) return b.callOriginalMethod(b.methodArguments);
            let hm = false;
            mentionlist.forEach(mw => {
                if(m.content.includes(mw)) hm = true;
            });
            if(hm) return true;
            return b.callOriginalMethod(b.methodArguments);
        });
    },
    unload: () => {
        let b = findModule('default').default.dirtyDispatch;
        let c = findModule('isMentioned').isMentioned;
        if(b.__monkeyPatched) b.unpatch();
        if(c.__monkeyPatched) c.unpatch();
    }
});

function checkAuthor(msg) {
    if(msg.author.id == findModule('getCurrentUser').getCurrentUser().id) return true;
    return false;
}