const Plugin = require('../plugin');
let inter;

module.exports = new Plugin({
    name: 'Full Timestamps',
    author: 'Juby210#2100',
    description: 'My remake of CompleteTimestamps plugin',
    color: '#f44336',

    load: () => {
        inter = setInterval(() => {
            $('.timestampCozy-2hLAPV').each((i,e) => {
                if($(e).hasClass('full-timestamps') || !$(e).attr('datetime')) return;
                let dat = new Date($(e).attr('datetime')).toLocaleString();
                if(dat == 'Invalid Date') dat = new Date(Number($(e).attr('datetime'))).toLocaleString();
                $(e).html(dat);
                $(e).addClass('full-timestamps');
            });
            $('.edited-DL9ECl').each((i,e) => {
                if($(e).hasClass('full-timestamps') || !$(e).attr('datetime')) return;
                let dat = new Date($(e).attr('datetime')).toLocaleString();
                if(dat == 'Invalid Date') dat = new Date(Number($(e).attr('datetime'))).toLocaleString();
                $(e).on('mouseenter', () => {
                    setTimeout(() => {
                        $('.tooltip-1OS-Ti').html(dat);
                    }, 1);
                });
                $(e).addClass('full-timestamps');
            });
        }, 500);
    },
    unload: () => {
        if(inter != undefined) clearInterval(inter);
    }
});