const fs = require('fs')
const str = fs.readFileSync('./emoji.txt', 'utf-8')
const arr = str.split('\n')
const result = {}

let activeGroup = ''

arr.forEach((line) => {
  const isGroupLine = line.includes(' group: ')
  const isEmojiLine = line.includes('fully-qualified')

  if (isGroupLine) {
    activeGroup = /(?<=# group: ).+/g.exec(line)[0]
    activeGroup = activeGroup.toLowerCase()
    activeGroup = activeGroup.split(' ').join('_')
    activeGroup = activeGroup.replace('&', 'and')
    if (!result[activeGroup])
      result[activeGroup] = {
        group_img: '',
        emojis: []
      }
  } else if (isEmojiLine) {
    const emoji = /(?<=fully-qualified     # )(.+)(?= E)/g.exec(line)[0]
    result[activeGroup].emojis.push(emoji)
  }
})

fs.writeFile('emojis.json', JSON.stringify(result), function (err) {
  if (err) return console.error('Error:', err)

  console.log('File created')
})