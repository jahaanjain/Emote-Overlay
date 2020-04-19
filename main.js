let debug = true;
function log(message) { if (debug) { console.log(message); } }

// Get URL Parameters (Credit to html-online.com)
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) { vars[key] = value; });
    return vars;
}
function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if (window.location.href.indexOf(parameter) > -1) { urlparameter = getUrlVars()[parameter]; }
    return urlparameter;
}

let channel = getUrlParam('channel','abc123');
log(channel);
let emotes = [];

async function getEmotes(check) {
    const proxyurl = 'https://cors-anywhere.herokuapp.com/';
    // first, we need to get the channels ID
    let res = await fetch('https://api.ivr.fi/twitch/resolve/' + channel, {
        method: "GET"
        }).then(function(response) { return response.json() },
        function(error) { log(error.message); }
    );
    let channelID = res.id;
    log(channelID)
    // next, we want to get a list of every channel sub emote, if any.
    res = await fetch(proxyurl + 'https://api.twitchemotes.com/api/v4/channels/' + channelID, {
        method: "GET"
        }).then(function(response) { return response.json() },
        function(error) { log(error.message); }
    );
    if (!res.error) {
        for(var i = 0; i < res.emotes.length; i++) {
            let emote = {
                emoteName : res.emotes[i].code,
                emoteURL : null
            };
            emotes.push(emote);
        }
    } else { log('Error getting twitch sub emotes'); }
    // now we want all the FFZ emotes
    res = await fetch(proxyurl + 'https://api.frankerfacez.com/v1/room/' + channel, {
        method: "GET"
        }).then(function(response) { return response.json() },
        function(error) { log(error.message); }
    );
    if (!res.error) {
        let setName = Object.keys(res.sets);
        for (var i = 0; i < res.sets[setName[0]].emoticons.length; i++) {
            let emote = {
                emoteName: res.sets[setName[0]].emoticons[i].name,
                emoteURL: res.sets[setName[0]].emoticons[i].urls['1']
            }
            emotes.push(emote);
        }
    } else { log('Error getting twitch ffz emotes'); }
    // finally, get all BTTV emotes 
    res = await fetch('https://api.betterttv.net/2/channels/' + channel, {
        method: "GET"
        }).then(function(response) { return response.json() },
        function(error) { log(error.message); }
    );
    if (!res.message) {
        for (var i = 0; i < res.emotes.length; i++) {
            let emote = {
                emoteName: res.emotes[i].code,
                emoteURL: `https://cdn.betterttv.net/emote/${res.emotes[i].id}/1x`
            }
            emotes.push(emote);
        }
        console.log(emotes);
    } else { log('Error getting twitch bttv emotes'); }
}

// Find Emotes and return name + link
function returnEmote(name) {
    if (emotes.length > 0) {
        // coming soon
    } else { log('emotes are still being processed'); }
}
let currentStreak = { streak: 0, emote: null }; // the current emote streak being used in chat
let currentEmote; // the current emote being used in chat
let showEmote; // the emote shown from using the !showemote <emote> command
let minStreak = 5; // minimum emote streak to trigger overlay effects

function findEmotes(message) {
    if (emotes.length !== 0) {
        message = message.split(' ');
        if (message.includes(currentStreak.emote)) { currentStreak.streak++; }
        else {
            currentStreak.streak = 0;
            currentStreak.emote = findEmoteInMessage(message);
        }

        function findEmoteInMessage(message) {
            for (const emote of emotes.map(a => a.emoteName)) {
                if (message.includes(emote)) { return emote; }
            }
            return null;
        }
        // add something to trigger streakEvent()
    }
}

function streakEvent() {
    if (currentStreak.streak >= minStreak) {
        // find a way to trigger animations
    }
}

// Connecting to twitch chat
function connect() {

    const chat = new WebSocket("wss://irc-ws.chat.twitch.tv");
    var timeout = setTimeout(function() {
        chat.close();
        chat.connect();
    }, 10 * 1000);

    chat.onopen = function() {
        clearInterval(timeout);
        chat.send("CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership");
        chat.send("PASS oauth:xd123");
        chat.send("NICK justinfan123");
        chat.send("JOIN #" + channel);
        getEmotes();
    };

    chat.onerror = function() {
        log("There was an error.. disconnected from the IRC");
        chat.close();
        chat.connect();
    };

    chat.onmessage = function(event) {
        let messageFull = event.data.split(/\r\n/)[0].split(`;`);
        // log(messageFull)
        if (messageFull.length > 12) {
            let messageBefore = messageFull[messageFull.length - 1].split(`${channel} :`).pop(); // gets the raw message
            let message = (messageBefore.split(' ').includes('ACTION')) ? messageBefore.split('ACTION ').pop().split('')[0] : messageBefore; // checks for the /me ACTION usage and gets the specific message
            // log(message)
            findEmotes(message)
        }
    };
}