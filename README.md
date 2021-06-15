# Usage:

This project is a webpage that shows emote streaks on the bottom left of the page. **_(Page dimensions are 1280px x 720px)_**  
It can also show emotes randomly on screen if a chatter does !showemote (emote*name)  
\_This overlay can be used in streaming software like OBS*
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

# Available Parameters:

To use these parameters, add them after the url with this format: "&(parameter)=(value)"
For example, if I wanted to add the "minStreak" parameter, my new URL would be "https://api.roaringiron.com/emoteoverlay?channel=forsen&minStreak=10&showEmoteSizeMultiplier=3"

- channel=(channel name) **_REQUIRED_**
- minStreak=(minimum emote streak needed to show up in overlay) _OPTIONAL - Defaults to 5 - Minimum value is 5_
- showEmoteEnabled=(1 for enabled, 0 for disabled) _OPTIONAL - Defaults to 1 (enabled)_
- streakEnabled=(1 for enabled, 0 for disabled) _OPTIONAL - Defaults to 1 (enabled)_
- showEmoteSizeMultiplier=(changes the size of the show emotes by the number provided) _OPTIONAL - Defaults to 2_
- 7tv=(1 for enabled, 0 for disabled) (enable or disable 7tv.app emotes support) _OPTIONAL - Defaults to 0 (disabled)_
