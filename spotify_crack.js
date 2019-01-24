const Plugin = require("../plugin");

module.exports = new Plugin({
    name: "Spotify Crack",
    author: "Juby210#2100",
    description: "Spotify listen along without premium!",
    color: "#0000ff",
    load: () => {
        let f = findModule('ActionTypes');
        monkeyPatch(findModule('getProfile'), 'getProfile', function (b) {
            let e = b.methodArguments[0];
            let t = b.methodArguments[1];
            return findModule("default").default.dispatch({
                type: f.ActionTypes.SPOTIFY_PROFILE_UPDATE,
                accountId: e,
                isPremium: true
            }), t;
        });
        monkeyPatch(findModule('isSpotifyPremium'), 'isSpotifyPremium', function () {
            return true;
        });
	},
    unload: () => {
        if(findModule('getProfile').getProfile.__monkeyPatched) findModule('getProfile').getProfile.unpatch();
        if(findModule('isSpotifyPremium').isSpotifyPremium.__monkeyPatched) findModule('isSpotifyPremium').isSpotifyPremium.unpatch();
    }
});