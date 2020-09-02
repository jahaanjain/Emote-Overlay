let debug = false;
function log(message) {
  if (debug) {
    console.log(message);
  }
}

// Get URL Parameters (Credit to html-online.com)
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    vars[key] = value;
  });
  return vars;
}
function getUrlParam(parameter, defaultvalue) {
  var urlparameter = defaultvalue;
  if (window.location.href.indexOf(parameter) > -1) {
    urlparameter = getUrlVars()[parameter];
  }
  return urlparameter;
}

let channel = getUrlParam("channel", "abc123").toLowerCase();
log(channel);
let emotes = [];

async function getEmotes(check) {
  // const proxyurl = 'https://cors-anywhere.herokuapp.com/';
  const proxyurl = "https://tpbcors.herokuapp.com/";
  let twitchID;

  // get channel twitch ID
  let res = await fetch(proxyurl + "https://api.ivr.fi/twitch/resolve/" + channel, {
    method: "GET",
    headers: { "User-Agent": "api.roaringiron.com/emoteoverlay" },
  }).then(
    function (response) {
      return response.json();
    },
    function (error) {
      log(error.message);
    }
  );
  if (!res.error || res.status == 200) {
    twitchID = res.id;
  } else {
    console.log("Error getting twitch ID");
  }

  // get FFZ emotes
  res = await fetch(proxyurl + "https://api.frankerfacez.com/v1/room/" + channel, {
    method: "GET",
  }).then(
    function (response) {
      return response.json();
    },
    function (error) {
      log(error.message);
    }
  );
  if (!res.error) {
    let setName = Object.keys(res.sets);
    for (var k = 0; k < setName.length; k++) {
      for (var i = 0; i < res.sets[setName[k]].emoticons.length; i++) {
        let emote = {
          emoteName: res.sets[setName[k]].emoticons[i].name,
          emoteURL: "https://" + res.sets[setName[k]].emoticons[i].urls["1"].split("//").pop(),
        };
        emotes.push(emote);
      }
    }
  } else {
    console.log("Error getting twitch ffz emotes");
  }
  // get all global ffz emotes
  res = await fetch(proxyurl + "https://api.frankerfacez.com/v1/set/global", {
    method: "GET",
  }).then(
    function (response) {
      return response.json();
    },
    function (error) {
      log(error.message);
    }
  );
  if (!res.error) {
    let setName = Object.keys(res.sets);
    for (var k = 0; k < setName.length; k++) {
      for (var i = 0; i < res.sets[setName[k]].emoticons.length; i++) {
        let emote = {
          emoteName: res.sets[setName[k]].emoticons[i].name,
          emoteURL: "https://" + res.sets[setName[k]].emoticons[i].urls["1"].split("//").pop(),
        };
        emotes.push(emote);
      }
    }
  } else {
    console.log("Error getting twitch ffz emotes");
  }
  // get all BTTV emotes
  res = await fetch(proxyurl + "https://api.betterttv.net/3/cached/users/twitch/" + twitchID, {
    method: "GET",
  }).then(
    function (response) {
      return response.json();
    },
    function (error) {
      log(error.message);
    }
  );
  if (!res.message) {
    for (var i = 0; i < res.channelEmotes.length; i++) {
      let emote = {
        emoteName: res.channelEmotes[i].code,
        emoteURL: `https://cdn.betterttv.net/emote/${res.channelEmotes[i].id}/1x`,
      };
      emotes.push(emote);
    }
    for (var i = 0; i < res.sharedEmotes.length; i++) {
      let emote = {
        emoteName: res.sharedEmotes[i].code,
        emoteURL: `https://cdn.betterttv.net/emote/${res.sharedEmotes[i].id}/1x`,
      };
      emotes.push(emote);
    }
    log(emotes);
  } else {
    console.log("Error getting twitch bttv emotes");
  }
  // global bttv emotes
  res = await fetch(proxyurl + "https://api.betterttv.net/3/cached/emotes/global", {
    method: "GET",
  }).then(
    function (response) {
      return response.json();
    },
    function (error) {
      log(error.message);
    }
  );
  if (!res.message) {
    for (var i = 0; i < res.length; i++) {
      let emote = {
        emoteName: res[i].code,
        emoteURL: `https://cdn.betterttv.net/emote/${res[i].id}/1x`,
      };
      emotes.push(emote);
    }
    log(emotes);
  } else {
    console.log("Error getting twitch bttv emotes");
  }
}

let currentStreak = { streak: 1, emote: null, emoteURL: null }; // the current emote streak being used in chat
let currentEmote; // the current emote being used in chat
let showEmoteCooldown = new Date(); // the emote shown from using the !showemote <emote> command
let minStreak = getUrlParam("minStreak", 5) > 4 ? getUrlParam("minStreak", 5) : 5; // minimum emote streak to trigger overlay effects
let streakEnabled = getUrlParam("streakEnabled", 1); // allows user to enable/disable the streak module
let showEmoteEnabled = getUrlParam("showEmoteEnabled", 1); // allows user to enable/disable the showEmote module
let showEmoteSizeMultiplier = getUrlParam("showEmoteSizeMultiplier", 2); // allows user to change the showEmote emote size multipler
log(`The streak module is ${streakEnabled} and the showEmote module is ${showEmoteEnabled}`);
let streakCD = new Date().getTime();

function findEmotes(message, messageFull) {
  if (emotes.length !== 0) {
    let emoteUsedPos = messageFull[4].startsWith("emotes=") ? 4 : 5;
    let emoteUsed = messageFull[emoteUsedPos].split("emotes=").pop();
    messageSplit = message.split(" ");
    if (messageSplit.includes(currentStreak.emote)) {
      currentStreak.streak++;
    } // add to emote streak
    else if (messageFull[emoteUsedPos].startsWith("emotes=") && emoteUsed.length > 1) {
      // default twitch emotes
      currentStreak.streak = 1;
      currentStreak.emote = message.substring(parseInt(emoteUsed.split(":")[1].split("-")[0]), parseInt(emoteUsed.split(":")[1].split("-")[1]) + 1);
      currentStreak.emoteURL = `https://static-cdn.jtvnw.net/emoticons/v1/${emoteUsed.split(":")[0]}/1.0`;
    } else {
      // find bttv/ffz emotes
      currentStreak.streak = 1;
      currentStreak.emote = findEmoteInMessage(messageSplit);
      currentStreak.emoteURL = findEmoteURLInEmotes(currentStreak.emote);
    }

    function findEmoteInMessage(message) {
      for (const emote of emotes.map((a) => a.emoteName)) {
        if (message.includes(emote)) {
          return emote;
        }
      }
      return null;
    }
    function findEmoteURLInEmotes(emote) {
      for (const emoteObj of emotes) {
        if (emoteObj.emoteName == emote) {
          return emoteObj.emoteURL;
        }
      }
      return null;
    }
    streakEvent();
  }
}

function streakEvent() {
  if (currentStreak.streak >= minStreak && streakEnabled == 1) {
    $("#main").empty();
    $("#main").css("position", "absolute");
    $("#main").css("top", "650");
    $("#main").css("left", "40");
    var img = $("<img />", { src: currentStreak.emoteURL, style: "transform: scale(1.5, 1.5)" });
    img.appendTo("#main");
    var streakLength = $("#main").append(" 󠀀  󠀀  x" + currentStreak.streak + " streak!");
    streakLength.appendTo("#main");
    gsap.to("#main", 0.15, { scaleX: 1.2, scaleY: 1.2, onComplete: downscale });
    function downscale() {
      gsap.to("#main", 0.15, { scaleX: 1, scaleY: 1 });
    }
    streakCD = new Date().getTime();
    setInterval(() => {
      if ((new Date().getTime() - streakCD) / 1000 > 4) {
        streakCD = new Date().getTime();
        gsap.to("#main", 0.2, { scaleX: 0, scaleY: 0, delay: 0.5, onComplete: remove });
        function remove() {
          streakCD = new Date().getTime();
        }
      }
    }, 1 * 1000);
  }
}

function showEmote(message, messageFull) {
  if (emotes.length !== 0 && showEmoteEnabled == 1) {
    let emoteUsedPos = messageFull[4].startsWith("emotes=") ? 4 : 5;
    let emoteUsedID = messageFull[emoteUsedPos].split("emotes=").pop();
    messageSplit = message.split(" ");
    if (emoteUsedID.length == 0) {
      let emoteUsed = findEmoteInMessage(messageSplit);
      let emoteLink = findEmoteURLInEmotes(emoteUsed);
      if (emoteLink) {
        return showEmoteEvent({ emoteName: emoteUsed, emoteURL: emoteLink });
      }
    } else {
      let emoteUsed = message.substring(parseInt(emoteUsedID.split(":")[1].split("-")[0]), parseInt(emoteUsedID.split(":")[1].split("-")[1]) + 1);
      let emoteLink = `https://static-cdn.jtvnw.net/emoticons/v1/${emoteUsedID.split(":")[0]}/1.0`;
      return showEmoteEvent({ emoteName: emoteUsed, emoteURL: emoteLink });
    }
    function findEmoteInMessage(message) {
      for (const emote of emotes.map((a) => a.emoteName)) {
        if (message.includes(emote)) {
          return emote;
        }
      }
      return null;
    }
    function findEmoteURLInEmotes(emote) {
      for (const emoteObj of emotes) {
        if (emoteObj.emoteName == emote) {
          return emoteObj.emoteURL;
        }
      }
      return null;
    }
  }
}

function showEmoteEvent(emote) {
  const cooldownTime = 5; // seconds
  let secondsDiff = (new Date().getTime() - new Date(showEmoteCooldown).getTime()) / 1000;
  log(secondsDiff);
  if (secondsDiff > cooldownTime) {
    showEmoteCooldown = new Date();
    var image = emote.emoteURL;
    var max_height = 720;
    var max_width = 1280;
    function getRandomCoords() {
      var r = [];
      var x = Math.floor(Math.random() * max_width);
      var y = Math.floor(Math.random() * max_height);

      r = [x, y];
      return r;
    }
    function createImage() {
      $("#showEmote").empty();
      var xy = getRandomCoords();
      $("#showEmote").css("position", "absolute");
      $("#showEmote").css("top", xy[1] + "px");
      $("#showEmote").css("left", xy[0] + "px");
      log("creating showEmote");
      var img = $("<img />", { src: image, style: `transform: scale(${showEmoteSizeMultiplier}, ${showEmoteSizeMultiplier})` });
      img.appendTo("#showEmote");
      gsap.to("#showEmote", 1, { autoAlpha: 1, onComplete: anim2 });
      function anim2() {
        gsap.to("#showEmote", 1, { autoAlpha: 0, delay: 4, onComplete: remove });
      }
      function remove() {
        $("#showEmote").empty();
      }
    }
    createImage();
  }
}

// Connecting to twitch chat
function connect() {
  const chat = new WebSocket("wss://irc-ws.chat.twitch.tv");
  var timeout = setTimeout(function () {
    chat.close();
    chat.connect();
  }, 10 * 1000);

  chat.onopen = function () {
    clearInterval(timeout);
    chat.send("CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership");
    chat.send("PASS oauth:xd123");
    chat.send("NICK justinfan123");
    chat.send("JOIN #" + channel);
    getEmotes();
  };

  chat.onerror = function () {
    log("There was an error.. disconnected from the IRC");
    chat.close();
    chat.connect();
  };

  chat.onmessage = function (event) {
    let messageFull = event.data.split(/\r\n/)[0].split(`;`);
    log(messageFull);
    if (messageFull.length > 12) {
      let messageBefore = messageFull[messageFull.length - 1].split(`${channel} :`).pop(); // gets the raw message
      let message = messageBefore.split(" ").includes("ACTION") ? messageBefore.split("ACTION ").pop().split("")[0] : messageBefore; // checks for the /me ACTION usage and gets the specific message
      if (message.toLowerCase().startsWith("!showemote") || message.toLowerCase().startsWith("!#showemote")) {
        showEmote(message, messageFull);
      }
      findEmotes(message, messageFull);
    }
    if (messageFull.length == 1 && messageFull[0].startsWith("PING")) {
      log("sending pong");
      chat.send("PONG");
    }
  };
}
