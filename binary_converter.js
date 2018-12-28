const Plugin = require("../plugin");
let jlSrc = "https://juby.cf/jl/JubyLib.js";
let jlVer = {min: 0.21, max: 0.29, tested: 0.231};
let live = false;

function BinToText(bin) {
    if(bin.match(/[10]{8}/g)){
        var text = bin.match(/([10]{8}|\s+)/g).map(function(fromBinary){
            return String.fromCharCode(parseInt(fromBinary, 2));
        }).join('');
        return text;
    }
}

function TextToBin(text) {
    let r = "";
    for (i = 0; i < text.length; i++) {
        var e = text[i].charCodeAt(0);
        var s = "";
        do {
          var a = e % 2;
          e = (e - a) / 2;
          s = a + s;
        } while (e != 0);
        while (s.length < 8) {
          s = "0" + s;
        }
        r += s;
    }
    return r;
}

function loadJL() {
    let jl = document.createElement("script");
    jl.id = "JubyLib-script";
    jl.src = jlSrc;
    document.head.appendChild(jl);

    jl.onload = () => {
        if(jlVer.max <= JubyLib.version.v || (jlVer.min >= JubyLib.version.v && jlVer.min != JubyLib.version.v)) {
            jlSrc = `https://juby.cf/jl/JubyLib-${jlVer.tested}.js`;
            JubyLib.unload();
            loadJL();
        } else {
            JubyLib.load();
            checkUpdate();
        }
    };
}

function checkUpdate() {
    JubyLib.updatesModule.check("https://raw.githubusercontent.com/juby210-PL/EnhancedDiscord-plugins/master/plugins_versions.json", "Binary Converter", 1.0, "https://raw.githubusercontent.com/juby210-PL/EnhancedDiscord-plugins/master/binary_converter.js");
}

module.exports = new Plugin({
    name: "Binary converter",
    author: "Juby210#2100",
    description: "Binary converter",
    color: "#0000ff",
    load: () => {
        try {
            if(!hasJubyLib) loadJL(); else checkUpdate();
        } catch(e) {loadJL();}

        const style = `
			#bc-button {
				cursor: pointer;
				padding: 2px;
                transition: background 100ms ease;
                margin-bottom: 10px;
                margin-top: 0px;
			}
			#bc-button:hover {
				background: rgba(255,255,255,0.1);
			}
			#bc-button:active {
				background: rgba(255,255,255,0.3);
            }
            .bc-b {
                padding-top: 10px;
                padding-bottom: 10px;
                padding-left: 20px;
                padding-right: 20px;
            }
        `;
        
        const css = document.createElement("style");
		css.id = "bc-style";
		css.innerHTML = style;
        document.head.append(css);

        const friendsOnline = window.findModule("friendsOnline").friendsOnline;
        const guildClasses = window.findModule("guildsWrapper");
        const button = document.createElement("div");
		button.id = "bc-button";
		button.textContent = "Bin";
        button.classList.add(friendsOnline);
        button.addEventListener("click", () => {
            const cb = window.ED.classMaps.checkbox;
            const sw = window.ED.classMaps.switchItem;
            const content = `Bin to text:
                <textarea placeholder="Bin" class="JL-input inputDefault-_djjkz input-cIJ7To size14-3iUx6q" style="resize: none; height: 70px;" id="bc-bin1" />
                <center><button id="bc-convert1" type="button" class="bc-b button-38aScr lookFilled-1Gx00P colorBrand-3pXr91 size16-14cGz5 grow-q77ONN">Convert</button></center>
                <textarea placeholder="Converted Text" class="JL-input inputDefault-_djjkz input-cIJ7To size14-3iUx6q" style="resize: none; height: 70px;" id="bc-text1" readonly/>
                <br><br>Text to bin:
                <textarea placeholder="Text" class="JL-input inputDefault-_djjkz input-cIJ7To size14-3iUx6q" style="resize: none; height: 70px;" id="bc-text2" />
                <center><button id="bc-convert2" type="button" class="bc-b button-38aScr lookFilled-1Gx00P colorBrand-3pXr91 size16-14cGz5 grow-q77ONN">Convert</button></center>
                <textarea placeholder="Converted Bin" class="JL-input inputDefault-_djjkz input-cIJ7To size14-3iUx6q" style="resize: none; height: 70px;" id="bc-bin2" readonly/>
                <div id="bc-livecb" class="${cb.switchEnabled} ${live ? cb.valueChecked : cb.valueUnchecked} ${cb.sizeDefault} ${cb.themeDefault}">
                    <input type="checkbox" class="${cb.checkboxEnabled}" value="on">
                </div>Live convert (when sending message)`;

            JubyLib.popup("Binary Converter", content);
            $("#bc-convert1").click(() => {
                let nv = BinToText($("#bc-bin1").val());
                if(!nv) nv = "Invalid binary code";
                $("#bc-text1").val(nv);
            });
            $("#bc-convert2").click(() => {
                let nv = TextToBin($("#bc-text2").val());
                $("#bc-bin2").val(nv);
            });
            $("#bc-livecb").click(() => {
                if(live) {
                    live = false;
                    document.getElementById("bc-livecb").className = document.getElementById("bc-livecb").className.replace(cb.valueChecked, cb.valueUnchecked);
                } else {
                    live = true;
                    document.getElementById("bc-livecb").className = document.getElementById("bc-livecb").className.replace(cb.valueUnchecked, cb.valueChecked);
                }
            });
        });

        if (!document.querySelector(`.${guildClasses.guildSeparator}`)) setTimeout(() => {
            document.querySelector(`.${guildClasses.guildSeparator}`).insertAdjacentElement("afterend", button);
        }, 100); else document.querySelector(`.${guildClasses.guildSeparator}`).insertAdjacentElement("afterend", button);

        monkeyPatch(findModule('post'), 'post', function (b) {
            if(!b.methodArguments[0].url || !live) return b.callOriginalMethod(b.methodArguments);
            if (b.methodArguments[0].url.endsWith('/messages')) {
                b.methodArguments[0].body.content = TextToBin(b.methodArguments[0].body.content);
            }
            return b.callOriginalMethod(b.methodArguments);
        });
	},
    unload: () => {
        if(findModule('post').post.__monkeyPatched) findModule('post').post.unpatch();
        const css = document.getElementById("bc-style");
        if(css) {
            document.head.removeChild(css);
        }
        const button = document.getElementById("bc-button");
        if(button) {
            button.parentElement.removeChild(button);
        }
    }
});