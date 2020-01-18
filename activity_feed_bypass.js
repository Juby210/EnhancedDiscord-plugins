const Plugin = require('../plugin');

module.exports = new Plugin({
    name: 'Activity Feed Bypass',
    author: 'Juby210#0577',
    description: 'Activity Feed privacy permissions bypass',
    color: '#7289da',

    load: () => {
        monkeyPatch(findModule('hasConsented'), 'hasConsented', b => {
            if(b.methodArguments[0] == 'personalization' && window.location.href.split('/')[3] == 'activity') return true
            return b.callOriginalMethod(b.methodArguments[0])
        })
    },
    unload: () => {
        findModule('hasConsented').hasConsented.unpatch()
    }
});