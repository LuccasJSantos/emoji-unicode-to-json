const fs = require('fs')
const { includes, match, pipe, head, map, cond, T, always, filter, isNil, complement, split, converge, objOf, tail, mergeAll } = require('ramda')
const str = fs.readFileSync('./emoji.txt', 'utf-8')

const isGroup = includes('group:')
const isEmoji = includes('fully-qualified     # ')
const getGroup = pipe(match(/(?<=# group: ).+/g), head)
const getEmoji = pipe(match(/(?<=fully-qualified     # ).+?(?= E)/g), head)

const fetchEmojis = pipe(
  match(/(?=# group).+?(?=(?:# group|# Flags subtotal:))/gs),
  map(pipe(
    split('\n'),
    map(cond([
      [isEmoji, getEmoji],
      [isGroup, getGroup],
      [T, always(undefined)]
    ])),
    filter(complement(isNil)),
    converge(objOf, [head, tail])
  )),
  mergeAll
)

fs.writeFile('emojis.json', JSON.stringify(fetchEmojis(str)), function (err) {
  if (err) return console.error('Error:', err)

  console.log('File created')
})