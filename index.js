const fs = require('fs')
const { includes, match, pipe, head, map, cond, T, always, filter, split, converge, objOf, tail, mergeAll, identity } = require('ramda')
const str = fs.readFileSync('./emoji.txt', 'utf-8')

const regexMatch = (regex) => pipe(match(regex), head)

const isGroup = includes('group:')
const isEmoji = includes('fully-qualified     # ')
const getGroup = regexMatch(/(?<=# group: ).+/g)
const getEmoji = regexMatch(/(?<=fully-qualified     # ).+?(?= E)/g)

const fetchEmojis = pipe(
  match(/(?=# group).+?(?=(?:# group|# Flags subtotal:))/gs),
  map(pipe(
    split('\n'),
    map(cond([
      [isEmoji, getEmoji],
      [isGroup, getGroup],
      [T, always(undefined)]
    ])),
    filter(identity),
    converge(objOf, [head, tail])
  )),
  mergeAll
)

fs.writeFile('emojis.json', JSON.stringify(fetchEmojis(str)), function (err) {
  if (err) return console.error('Error:', err)

  console.log('File created')
})