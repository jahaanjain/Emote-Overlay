Usage:  
This project is a webpage that shows emote streaks on the bottom left of the page. (Page dimensions are 1280px x 720px)  
It can also show emotes randomly on screen if a chatter does !showemote (emote_name)  
*This overlay can be used in streaming software like OBS*  
  
This project took direct inspiration from pajlada's pajbot, although I believe my version is easier to setup and use.  

Available Parameters:
- channel=(CHANNEL_NAME) ***REQUIRED***
- minStreak=(MINIMUM_EMOTE_STREAK_TO_SHOW_IN_OVERLAY) *OPTIONAL - Defaults to 5 - Minimum value is 5*
- showEmoteEnabled=(1 FOR TRUE, 0 FOR FALSE) *OPTIONAL - Defaults to 1 (true)*
- streakEnabled=(1 FOR TRUE, 0 FOR FALSE) *OPTIONAL - Defaults to 1 (true)*

Example + Live Version (You can put this URL into your streaming software and use it!):  
https://api.roaringiron.com/emoteoverlay?channel=forsen&minStreak=5&showEmoteEnabled=1&streakEnabled=1