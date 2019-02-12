const Plugin = require('../plugin');
const {findModuleByDisplayName} = EDApi;

module.exports = new Plugin({
    name: 'BetterSearchPage',
    author: 'Juby210#2100',
    description: 'My remake of BetterSearchPage plugin',
    color: '#f44336',

    load: () => {
        const classes = findModule('searchResultsWrap');
        module.exports.injectCSS('BSPR-style', `
        .BSPR-pgbtn {
            background: url('data:image/svg+xml; utf8, <svg xmlns="http://www.w3.org/2000/svg" width="30" height="25"><g fill="#737f8d" fill-rule="evenodd" clip-rule="evenodd"><path xmlns="http://www.w3.org/2000/svg" d="M17.338 12.485c-4.156 4.156-8.312 8.312-12.468 12.467-1.402-1.402-2.805-2.804-4.207-4.206 2.756-2.757 5.513-5.514 8.27-8.27C6.176 9.72 3.419 6.963.663 4.207L4.87 0c-.058-.059 12.555 12.562 12.468 12.485z"/><path xmlns="http://www.w3.org/2000/svg" d="M17.338 12.485c-4.156 4.156-8.312 8.312-12.468 12.467-1.402-1.402-2.805-2.804-4.207-4.206 2.756-2.757 5.513-5.514 8.27-8.27C6.176 9.72 3.419 6.963.663 4.207L4.87 0c-.058-.059 12.555 12.562 12.468 12.485z" transform="translate(12 0)"/></g></svg>') 50%/9px 12px no-repeat;
            border: 1px solid rgba(79,84,92,.16);
            border-radius: 2px;
            cursor: pointer;
            height: 18px;
            left: 20px;
            opacity: .7;
            top: 20px;
            width: 18px;
        }
        .theme-dark.BSPR-pgbtn {
            background-image: url('data:image/svg+xml; utf8, <svg xmlns="http://www.w3.org/2000/svg" width="30" height="25"><g fill="#FFF" fill-rule="evenodd" clip-rule="evenodd"><path xmlns="http://www.w3.org/2000/svg" d="M17.338 12.485c-4.156 4.156-8.312 8.312-12.468 12.467-1.402-1.402-2.805-2.804-4.207-4.206 2.756-2.757 5.513-5.514 8.27-8.27C6.176 9.72 3.419 6.963.663 4.207L4.87 0c-.058-.059 12.555 12.562 12.468 12.485z" /><path xmlns="http://www.w3.org/2000/svg" d="M17.338 12.485c-4.156 4.156-8.312 8.312-12.468 12.467-1.402-1.402-2.805-2.804-4.207-4.206 2.756-2.757 5.513-5.514 8.27-8.27C6.176 9.72 3.419 6.963.663 4.207L4.87 0c-.058-.059 12.555 12.562 12.468 12.485z" transform="translate(12 0)"/></g></svg>');
            border: 1px solid hsla(0,0%,100%,.16);
        }
        .BSPR-pgbtn.BSPR-pgfirst {
            margin-right: 10px;
            transform: rotate(180deg);
        }
        .BSPR-pgbtn.BSPR-pglast {
            margin-left: 10px;
            margin-right: 10px;
        }
        .BSPR-pgbtn.${classes.disabled.split(' ')[0]} {
            cursor: default;
            opacity: .3;
        }
        .BSPR-pagination-button:not(.${classes.disabled.split(' ')[0]}):hover {
            opacity: 1;
        }
        `);

        monkeyPatch(findModuleByDisplayName('SearchResults').prototype, 'componentDidUpdate', b => {
            let instance = b.methodArguments[1];
            let render = b.callOriginalMethod(b.methodArguments);
            if(!instance && !instance.searchId) return render;
            module.exports.addNewControls($('.'+classes.pagination.split(' ')[0]), instance.searchId);
            return render;
        });

        const func = findModule('searchNextPage');
        monkeyPatch(func, 'searchNextPage', b => {
            let pg = $('.'+classes.pagination.split(' ')[0]);
            $(pg).remove();
            module.exports.addNewControls(pg, b.methodArguments[0]);
            return b.callOriginalMethod(b.methodArguments);
        });
        monkeyPatch(func, 'searchPreviousPage', b => {
            let pg = $('.'+classes.pagination.split(' ')[0]);
            $(pg).remove();
            module.exports.addNewControls(pg, b.methodArguments[0]);
            return b.callOriginalMethod(b.methodArguments);
        });
    },
    unload: () => {
        const func = findModule('searchNextPage');
        let m = findModuleByDisplayName('SearchResults').prototype.componentDidUpdate;
        if(m.__monkeyPatched) m.unpatch();
        m = func.searchNextPage;
        if(m.__monkeyPatched) m.unpatch();
        m = func.searchPreviousPage;
        if(m.__monkeyPatched) m.unpatch();
        module.exports.clearCSS('BSPR-style');
    },

    addNewControls: (pg, searchId) => {
        if (!pg || !searchId || document.querySelector(".BSPR-controls")) return;
        const classes = findModule('searchResultsWrap');
        let srw = $(pg).parent();
        if(!srw) return;
        let currentpage, maxpage;
		for (let word of $(pg).text().split(" ")) {
			let number = parseInt(word.replace(/\./g,""));
			if (!isNaN(number) && !currentpage) currentpage = number;
			else if (!isNaN(number)) {
				maxpage = number;
				break;
			}
        }
        if (!currentpage || !maxpage) return;
        let temppage = currentpage;
		currentpage = currentpage < maxpage ? currentpage : maxpage;
		maxpage = temppage < maxpage ? maxpage : temppage;
		if (maxpage > 201) {
			if (currentpage == 201) alert("Discord doesn't allow you to go further than page 201.");
			maxpage = 201;
        }
        if (currentpage == maxpage && maxpage == 201) $(pg).find('.'+classes.paginationNext.split(' ')[0]).addClass(classes.disabled);
        
        $(pg).children().first().before(`<div aria-label="First" class="${currentpage == 1 ? classes.disabled : ""} pagination-button BSPR-pgbtn BSPR-pgfirst"></div>`);
        $(pg).append(`<div aria-label="Last" class="${currentpage == maxpage ? classes.disabled : ""} pagination-button BSPR-pgbtn BSPR-pglast"></div>`);
        module.exports.addListeners(pg, searchId, maxpage, currentpage);
        let cust = $(pg).clone();
        $(cust).addClass('BSPR-controls');
        $(srw).first().before(cust);
        module.exports.addListeners(cust, searchId, maxpage, currentpage, true);//findModule('input').inputWrapper
    },
    addListeners: (pg, sid, maxpage, currentpage, full) => {
        const classes = findModule('searchResultsWrap');
        const func = findModule('searchNextPage');
        if(full) {
            $(pg).find('.'+classes.paginationNext.split(' ')[0]).click(() => {
                func.searchNextPage(sid);
            });
            $(pg).find('.'+classes.paginationPrevious.split(' ')[0]).click(() => {
                func.searchPreviousPage(sid);
            });
        }
        $(pg).find(`.BSPR-pgfirst:not(.${classes.disabled.split(' ')[0]})`).click(() => {
            for (let i = 0; currentpage - 1 - i > 0; i++) func.searchPreviousPage(sid);
        });
        $(pg).find(`.BSPR-pglast:not(.${classes.disabled.split(' ')[0]})`).click(() => {
            for (let i = 0; maxpage - currentpage - i > 0; i++) func.searchNextPage(sid);
        });
    },

    injectCSS: (id, css) => {
        $('head').append(`<style id=${id}>${css}</style>`);
    },
    clearCSS: id => {
        let css = document.getElementById(id);
        if(css) css.parentElement.removeChild(css);
    }
});