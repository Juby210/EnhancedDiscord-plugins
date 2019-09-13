const Plugin = require('../plugin');
const {React: {createElement: e}} = EDApi;
const star = {id: null, name: "⭐", animated: false};

module.exports = new Plugin({
    name: 'Star Option',
    author: 'Juby210#2100',
    description: 'Star option in message options',
    color: '#FFD700',

    load: () => {
        const Button = findModule("ButtonSizes").default;
        const className = EDApi.findModule(m => m.button && m.item).item;
        
        monkeyPatch(findModule("MessageOptionPopout").MessageOptionPopout.prototype, "render", b => {
            const render = b.callOriginalMethod();
            render.props.children.props.children.push(e(Button, {
                look: Button.Looks.BLANK,
                size: Button.Sizes.NONE,
                onClick: () => module.exports.star(b.thisObject.props),
                className,
                role: "menuitem"
            }, "Star"));
            return render;
        });
    },
    unload: () => {
        let m = findModule("MessageOptionPopout").MessageOptionPopout.prototype.render;
        if(m.__monkeyPatched) m.unpatch();
    },

    star: t => {
        findModule('addReaction').addReaction(t.message.channel_id, t.message.id, star);
    }
});
