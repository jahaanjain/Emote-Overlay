# Overview:

This project is an overlay that shows emote streaks on the bottom left of the page. **_(Page dimensions are 1280px x 720px)_**  
It can also show emotes randomly on screen if a chatter does !showemote (*emote_name*)  
*This overlay can be used in streaming software like OBS*   
The emotes are taken from Twitch, FFZ, BTTV, and optionally, 7TV.

This project took direct inspiration from pajlada's pajbot, although I believe my version is easier to setup and use.

# Example + Live Version

## Emote Combo:

![Emote Combo](https://i.imgur.com/gOETm6Z.gif)

## Show Emote:

![Show Emote](https://i.imgur.com/987NJzD.gif)

## Live Version:

(You can put this URL into your streaming software and use it!):

https://api.roaringiron.com/emoteoverlay?channel=forsen

# Usage & Available Parameters:

To use these parameters, add them after the url with this format: "&(parameter)=(value)"
For example, if I wanted to add the "minStreak" and the "7tv" parameter, my new URL would be "https://api.roaringiron.com/emoteoverlay?channel=forsen&minStreak=10&7tv=1"

#### REQUIRED PARAMETERS:
-   channel=(channel name)

#### OPTIONAL PARAMETERS:
-   minStreak=*(number)*
    - Minimum emote streak needed to show up in overlay
    - Defaults to 5 - Minimum value allowed is 3
-   showEmoteEnabled=*(1 for enabled, 0 for disabled)*
    - Enable or disable the show emote module
    - Defaults to 1 (enabled)
-   streakEnabled=*(1 for enabled, 0 for disabled)*
    - Enable or disable the emote streak module
    - Defaults to 1 (enabled)
-   showEmoteSizeMultiplier=*(multipler)*
    - Changes the size of the show emotes by the number provided
    - Defaults to 2
-   showEmoteCooldown=*(seconds)*
    - Cooldown in seconds between usage of !showemote command
    - Defaults to 5
-   7tv=*(1 for enabled, 0 for disabled)*
    - Enable or disable 7tv.app emotes support
    - Defaults to 0 (disabled)
-   emoteStreakText=*(text (without quotes))*
    - Sets the ending text for the emote streak
    - For no text, add an empty `emoteStreakText=` to the end of the URL
    - Defaults to `Streak!`
