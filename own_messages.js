const Plugin = require('../plugin');
const fs = require('fs');
const path = require('path');
let orginalmess = {};

module.exports = new Plugin({
    name: 'Own Messages',
    author: 'Juby210#2100',
    description: 'Create your own messages for discord',
    color: '#f44336',

    load: () => {
        let p = path.join(process.env.injDir, 'plugins', 'own_messages.json');
        let p2 = path.join(process.env.injDir, 'plugins', 'own_messages.all.json');
        if(!fs.existsSync(p)) {
            fs.openSync(p,'w');
            fs.writeFileSync(p, '{}');
            fs.openSync(p2, 'w');
            fs.writeFileSync(p2, JSON.stringify(findModule('Messages').Messages, null, "\t"));
        }
        Object.keys(require(p)).forEach(k => {
            orginalmess[k] = findModule('Messages').Messages[k];
        });
        Object.assign(findModule('Messages').Messages, require(p));
    },
    unload: () => {
        Object.assign(findModule('Messages').Messages, orginalmess);
        delete require.cache[require.resolve(path.join(process.env.injDir, 'plugins', 'own_messages.json'))];
    }
});