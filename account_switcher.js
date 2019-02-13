const Plugin = require('../plugin');
const {loadData, saveData} = EDApi;

module.exports = new Plugin({
    name: 'Account Switcher',
    author: 'Juby210#2100',
    description: 'Lets you switch between multiple Discord accounts',
    color: '#f44336',

    load: () => {
        $('head').append(`<style id="accswitch-style">
        #accswitch {
            display: block;
            background-color: #36393f;
            color: #b1b2b4;
            padding: 10px;
        }
        .accswitchbtn {
            margin-top: 5px;
            margin-right: 5px;
        }
        #switcher-btn {
            margin-right: 20px;
            color: #a5a7a7;
            background: transparent;
        }</style>`);
        module.exports.load2();
        $('.'+findModule('winButtonMinMax').winButtonMinMax.split(' ')[0]).last().after(`<button type="button" id="switcher-btn" class="${findModule('winButtonMinMax').winButtonMinMax}">Switcher</button>`);
        $('#switcher-btn').click(() => {
            findModule('login').loginReset();
            setTimeout(() => module.exports.load2(),500);
        });
    },
    unload: () => {
        let s = document.getElementById('accswitch');
        if(s) s.parentElement.removeChild(s);   
        s = document.getElementById('accswitch-style');
        if(s) s.parentElement.removeChild(s);
        s = document.getElementById('switcher-btn');
        if(s) s.parentElement.removeChild(s);
    },

    load2: () => {
        let s = document.getElementById('accswitch');
        if(s) s.parentElement.removeChild(s);  
        let accounts = loadData(module.exports.id, 'accounts');
        if(!accounts) accounts = [];

        const btn = findModule('button');
        const l = findModule('login');

        $('.'+findModule('authBox').authBox.split(' ')[0]).after(`<div id="accswitch">Account Switcher:<br id="accswitch-aaaa"></div>`);
        accounts.forEach(a => {
            let el = $('.accswitchbtn');
            if(el.length == 0) el = $('#accswitch-aaaa');
            $(el).after(`<button type="button" class="accswitchbtn ${btn.button} ${btn.sizeMin} ${btn.grow} ${btn.lookFilled} ${btn.colorBrand}">${a.name}</button>`);
            $('#accswitch').find('.accswitchbtn').last().click(() => {
                if(a.email) {
                    l.login({email:a.emailv,password:a.pass,undelete:false});
                    setTimeout(() => {
                        if($('.'+btn.button.split(' ')[0]).length != 0) {
                            setInterval(() => {
                                if($('.'+btn.button.split(' ')[0]).length == 0) window.location.reload();
                            }, 200);
                        } else window.location.reload();
                    }, 1000);
                } else {
                    l.loginToken(a.token);
                    setTimeout(() => window.location.reload(),200);
                }
            });
        });
    },

    generateSettings: () => {
        let accounts = loadData(module.exports.id, 'accounts');
        if(!accounts) accounts = [];

        const inp = findModule('input');
        const btn = findModule('button');
        const h = window.ED.classMaps.headers;

        let list = '';
        accounts.forEach(a => {
            if(a.email) {
                let buttons = `<button type="button" class="${btn.button} ${btn.sizeMin} ${btn.grow} ${btn.lookFilled} ${btn.colorBrand} accswitcher-acc-rem" style="float:right;display:inline-block"><div class="contents-18-Yxp">Remove</div></button><button type="button" class="${btn.button} ${btn.sizeMin} ${btn.grow} ${btn.lookFilled} ${btn.colorBrand} accswitcher-acc-ctt" style="float:right;display:inline-block"><div class="contents-18-Yxp">Change to token</div></button>`;
                list += `<div class="accswitcher-acc" style="margin-top:5px"><input type="text" placeholder="Name" value="${a.name}" class="${inp.inputDefault} accswitcher-acc-name" style="width:100px;display:inline-block"><input type="text" placeholder="Email" value="${a.emailv}" class="${inp.inputDefault} accswitcher-acc-email" style="display:inline-block;width:300px"><input type="password" placeholder="Password" value="${a.pass}" class="${inp.inputDefault} accswitcher-acc-pass" style="display:inline-block;width:200px"><br><span class="${inp.errorMessage}">If you use mfa, it's better to use login via token</span>${buttons}</div><br>`;
            } else {
                let buttons = `<button type="button" class="${btn.button} ${btn.sizeMin} ${btn.grow} ${btn.lookFilled} ${btn.colorBrand} accswitcher-acc-rem" style="float:right;display:inline-block"><div class="contents-18-Yxp">Remove</div></button><button type="button" class="${btn.button} ${btn.sizeMin} ${btn.grow} ${btn.lookFilled} ${btn.colorBrand} accswitcher-acc-cte" style="float:right;display:inline-block"><div class="contents-18-Yxp">Change to email</div></button>`;
                list += `<div class="accswitcher-acc" style="margin-top:5px"><input type="text" placeholder="Name" value="${a.name}" class="${inp.inputDefault} accswitcher-acc-name" style="width:100px;display:inline-block"><input type="password" placeholder="Token" value="${a.token}" class="${inp.inputDefault} accswitcher-acc-token" style="display:inline-block;width:500px"><br>${buttons}</div><br>`;
            }
        });

        setTimeout(() => {
            module.exports.addListeners();
        }, 5);

        return `<div id='accswitcher-settings'>
            <div class="${h.defaultColor} ${h.h3}">Account List:</div>
            <div id='accswitcher-slist'>
                ${list}
            </div>
            <div style="margin-top:5px">
                <button type="button" id="accswitcher-addac" class="${btn.button} ${btn.sizeMin} ${btn.grow} ${btn.lookFilled} ${btn.colorBrand}" style="width:100px;display:inline-block"><div class="contents-18-Yxp">Add account</div></button>
                <button type="button" id="accswitcher-save" class="${btn.button} ${btn.sizeMin} ${btn.grow} ${btn.lookFilled} ${btn.colorBrand}" style="width:100px;display:inline-block"><div class="contents-18-Yxp">Save</div></button>   
            </div>
        </div>`;
    },
    listeners: {
        cte: e => {
            const inp = findModule('input');
            const btn = findModule('button');
            let ac = e.target.parentElement;
            if(ac.tagName == 'BUTTON') ac = ac.parentElement;
            $(ac).find('.accswitcher-acc-token').remove();
            $(ac).find('.accswitcher-acc-cte').remove();
            $(ac).find('.accswitcher-acc-name').after(`<input type="text" placeholder="Email" value="" class="${inp.inputDefault} accswitcher-acc-email" style="display:inline-block;width:300px"><input type="password" placeholder="Password" value="" class="${inp.inputDefault} accswitcher-acc-pass" style="display:inline-block;width:200px">`);
            $(ac).find('.accswitcher-acc-rem').before(`<span class="${inp.errorMessage}">If you use mfa, it's better to use login via token</span>`);
            $(ac).find('.accswitcher-acc-rem').after(`<button type="button" class="${btn.button} ${btn.sizeMin} ${btn.grow} ${btn.lookFilled} ${btn.colorBrand} accswitcher-acc-ctt" style="float:right;display:inline-block"><div class="contents-18-Yxp">Change to token</div></button>`);
            module.exports.addListeners(ac);
        },
        ctt: e => {
            const inp = findModule('input');
            const btn = findModule('button');
            let ac = e.target.parentElement;
            if(ac.tagName == 'BUTTON') ac = ac.parentElement;
            $(ac).find('.accswitcher-acc-email').remove();
            $(ac).find('.accswitcher-acc-pass').remove();
            $(ac).find('span').remove();
            $(ac).find('.accswitcher-acc-ctt').remove();
            $(ac).find('.accswitcher-acc-name').after(`<input type="password" placeholder="Token" value="" class="${inp.inputDefault} accswitcher-acc-token" style="display:inline-block;width:500px">`);
            $(ac).find('.accswitcher-acc-rem').after(`<button type="button" class="${btn.button} ${btn.sizeMin} ${btn.grow} ${btn.lookFilled} ${btn.colorBrand} accswitcher-acc-cte" style="float:right;display:inline-block"><div class="contents-18-Yxp">Change to email</div></button>`);
            module.exports.addListeners(ac);
        },
        rem: e => {
            let ac = e.target.parentElement;
            if(ac.tagName == 'BUTTON') ac = ac.parentElement;
            ac.parentElement.removeChild(ac);
        },
        addac: e => {
            const inp = findModule('input');
            const btn = findModule('button');
            let s = $('#accswitcher-settings');
            let buttons = `<button type="button" class="${btn.button} ${btn.sizeMin} ${btn.grow} ${btn.lookFilled} ${btn.colorBrand} accswitcher-acc-rem" style="float:right;display:inline-block"><div class="contents-18-Yxp">Remove</div></button><button type="button" class="${btn.button} ${btn.sizeMin} ${btn.grow} ${btn.lookFilled} ${btn.colorBrand} accswitcher-acc-cte" style="float:right;display:inline-block"><div class="contents-18-Yxp">Change to email</div></button>`;
            let list = `<div class="accswitcher-acc" style="margin-top:5px"><input type="text" placeholder="Name" value="" class="${inp.inputDefault} accswitcher-acc-name" style="width:100px;display:inline-block"><input type="password" placeholder="Token" value="" class="${inp.inputDefault} accswitcher-acc-token" style="display:inline-block;width:500px"><br>${buttons}</div><br>`;
            $(s).find('#accswitcher-slist').append(list);
            module.exports.addListeners($(s).find('#accswitcher-slist').find('.accswitcher-acc').last());
        },
        save: e => {
            let accounts = [];
            $('#accswitcher-settings').find('#accswitcher-slist').children().each((i,e) => {
                if(e.tagName == 'BR') return;
                let email = $(e).find('.accswitcher-acc-email').length != 0;
                if(email) {
                    accounts.push({email,emailv:$(e).find('.accswitcher-acc-email').val(),pass:$(e).find('.accswitcher-acc-pass').val(),name:$(e).find('.accswitcher-acc-name').val()});
                } else {
                    accounts.push({token:$(e).find('.accswitcher-acc-token').val(),name:$(e).find('.accswitcher-acc-name').val()})
                }
            });
            saveData(module.exports.id, 'accounts', accounts);
            e.target.innerText = 'Saved!';
            setTimeout(() => e.target.innerText = "Save", 1000);
        }
    },
    addListeners: a => {
        if(!a) a = $('#accswitcher-settings');
        $(a).find('.accswitcher-acc-cte').click(module.exports.listeners.cte);
        $(a).find('.accswitcher-acc-ctt').click(module.exports.listeners.ctt);
        $(a).find('.accswitcher-acc-rem').click(module.exports.listeners.rem);
        $(a).find('#accswitcher-addac').click(module.exports.listeners.addac);
        $(a).find('#accswitcher-save').click(module.exports.listeners.save);
    },
    config: {}
});