# Speedrun Leaderboard

Hi, I originally made this project for myself to add a leaderboard to my stream when I am speedrunning a game, it uses the [speedrun.com](speedrun.com) [API](https://github.com/speedruncomorg/api/tree/master?tab=readme-ov-file) 

### Features
- Configuration window that allow to chose the game and category you wish to display
- Display any number of name from 1 to the whole leaderboard
- Names are displayed in the color set by the user on speedrun.com
- Leaderboard can be animated to cycle through all the names on the leaderboard whilst limiting the number of names on screen

### Upcomming Features that I'd like to add
- Also display the time of every player on the leaderboard
- Optimization for the bigger leaderboards
- Add an option to have one color for every player
- Easier way to change the text font
- Add an option to add a specific player to the fixed names on the animated leaderboard (for when the runner want to be displayed at all time without having a top time)

## How to use

Download the project and then simply open the config.html in your browser, use the search bar to find your game then hover your mouse on the game and select the category. You can then choose your prefered options and submit for the leaderboard page to appear.
You need an internet connection for it to work.

### Use in OBS

On the leaderboard page, simply copy and paste the url to a browser source in obs 

### Options

- __Leaderboard size__ : the number of names you want to display, keep 0 to have the entire leaderboard (it can take a long time depending on the size of the leaderboard)
- __Animation__ : check this options to cycle through all the names on the leaderboard
- __Fixed Count__ : the number of non cycling names from the top (eg : 3 will keep the top 3 on the leaderboard at all time)
- __Specific Variables__ : some games have additionnal filtering options for their categories
- __Animated Count__ : the number of names that are displayed at the same time (eg : 7 will set 7 animated names and with 3 fixed names for a total of 10 names)
- __Speed__ : the time it takes to cycle through the names, the higher the number, the less time it takes

### Changing the font

Simply drag and drop your font file in the font folder and change the font name in leaderboard/style.css as follows :
```css
@font-face {
    font-family: "custom";
    src: url("./Fonts/[YOUR FONT NAME HERE.ttf]");
}
```
