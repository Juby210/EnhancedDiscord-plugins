const Plugin = require('../plugin');
let inter;

module.exports = new Plugin({
    name: 'Full Timestamps',
    author: 'Juby210#2100',
    description: 'My remake of CompleteTimestamps plugin',
    color: '#f44336',

    load: () => {
        inter = setInterval(() => {
            $('.'+findModule('timestampCozy').timestampCozy.split(' ')[0]).each((i,e) => {
                if($(e).hasClass('full-timestamps') || !$(e).attr('datetime')) return;
                let dat = new Date($(e).attr('datetime')).toLocaleString();
                if(dat == 'Invalid Date') dat = new Date(Number($(e).attr('datetime'))).toLocaleString();
                $(e).html(dat);
                $(e).addClass('full-timestamps');
            });
            $('.'+findModules('timestamp')[3].timestamp.split(' ')[0]).each((i,e) => {
                if($(e).hasClass('full-timestamps') || !$(e).attr('datetime')) return;
                let dat = new Date($(e).attr('datetime')).toLocaleString();
                if(dat == 'Invalid Date') dat = new Date(Number($(e).attr('datetime'))).toLocaleString();
                $(e).html(dat);
                $(e).addClass('full-timestamps');
            });
            $('.'+findModule('edited').edited.split(' ')[0]).each((i,e) => {
                if($(e).hasClass('full-timestamps') || !$(e).attr('datetime')) return;
                let dat = new Date($(e).attr('datetime')).toLocaleString();
                if(dat == 'Invalid Date') dat = new Date(Number($(e).attr('datetime'))).toLocaleString();
                $(e).on('mouseenter', () => {
                    setTimeout(() => {
                        $('.'+findModules('tooltip')[1].tooltip.split(' ')[0]).html(dat);
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