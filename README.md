# Usage:  
This project is a webpage that shows emote streaks on the bottom left of the page. ***(Page dimensions are 1280px x 720px)***  
It can also show emotes randomly on screen if a chatter does !showemote (emote_name)  
*This overlay can be used in streaming software like OBS*  
  
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
For example, if I wanted to add the "minStreak" parameter, my new URL would be "https://api.roaringiron.com/emoteoverlay?channel=forsen&minStreak=10"

- channel=(channel name) ***REQUIRED***
- minStreak=(minimum emote streak needed to show up in overlay) *OPTIONAL - Defaults to 5 - Minimum value is 5*
- showEmoteEnabled=(1 for enabled, 0 for disabled) *OPTIONAL - Defaults to 1 (enabled)*
- streakEnabled=(1 for enabled, 0 for disabled) *OPTIONAL - Defaults to 1 (enabled)*
- showEmoteSizeMultiplier=(changes the size of the show emotes by the number provided) *OPTIONAL - Defaults to 2*
