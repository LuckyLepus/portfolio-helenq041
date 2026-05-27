const fs = require('fs');
const filePath = 'public/podcast/index.html';
let text = fs.readFileSync(filePath, 'utf8');

const searchStr = 'id:"ep-01"';
const start = text.indexOf(searchStr);
const arrStart = text.lastIndexOf('[', start);
const arrEnd = text.indexOf(']', start);

const oldArrayStr = text.substring(arrStart, arrEnd + 1);

// Evaluate as a javascript array
const episodes = eval('(' + oldArrayStr + ')');

episodes.push({
  id: "ep-07",
  episode: "Episode 07",
  title: "别被游戏算法PUA了",
  subtitle: "Don't Be PUA'd By Game Algorithms",
  color: "sky-blue",
  duration: "--:--",
  currentTime: "00:00",
  audioSrc: "audio/别被游戏算法PUA了.m4a"
});

// Stringify without quotes for keys to match the original style (Vite minifier output).
// We'll write our own simple stringifier for this shallow array of objects.
const newArrayStr = '[' + episodes.map(ep => {
  return '{' + Object.keys(ep).map(key => {
    return key + ':"' + ep[key] + '"';
  }).join(',') + '}';
}).join(',') + ']';

text = text.substring(0, arrStart) + newArrayStr + text.substring(arrEnd + 1);

fs.writeFileSync(filePath, text, 'utf8');
console.log('Successfully added episode 7!');
