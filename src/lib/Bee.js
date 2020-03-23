import _                from 'lodash'
import Guess            from './Guess'
import { Dicts }        from './Dicts'

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u'])

class Bee {
  constructor(ltrs) {
    this.letters     = Bee.normalize(ltrs)
    this.mainLetter  = this.letters[0]  //eslint-disable-line
    this.pangramRe   = Bee.makePangramRe(this.letters)
    this.rejectRe    = Bee.makeRejectRe(this.letters)
    this.guesses     = []
    this.nogos       = []
    this._lexMatches = {}
    this._allWords   = null
    this.hints   = this.getHints()
  }

  getHints() {
    return (this
      .allWords
      .filter((wd) => (wd.length >= 4))
      .filter((wd) => (! this.hasWord(wd)))
      .map((wd) => new Guess(wd.toLowerCase(), this))
    )
  }

  get allWords() {
    if (! this._allWords) {
      const nyt = this.lexMatches('nyt')
      const scr = this.lexMatches('scr')
      this._allWords   = _.sortedUniq(
        _.sortBy(scr.words.concat(nyt.words), ['length', _.identity]),
      )
    }
    return this._allWords
  }
      

  static normalize(ltrs) {
    const lonly = ltrs.replace(/[^A-Za-z]/g, '')
    const larr  = lonly.toLowerCase().split('')
    const luniq = [...new Set(larr)].slice(0, 7)
    const firl  = luniq.shift()
    luniq.sort((aa, bb) => {
      if (VOWELS.has(aa) && ! VOWELS.has(bb)) return -1
      if (VOWELS.has(bb) && ! VOWELS.has(aa)) return 1
      return ((aa > bb) ? 1 : -1)
    })
    return [firl, ...luniq].join('')
  }

  get dispLtrs() {
    const la = this.letters.toUpperCase().split('')
    return [la.shift(), '/', ...la].join(' ')
  }

  get larry() {
    return this.letters.split('')
  }

  isPan(word) {
    return this.pangramRe.test(word)
  }

  static makePangramRe(letters) {
    return new RegExp(letters.split('').map((ltr) => `(?=.*${ltr})`).join(''), 'i')
  }

  static makeRejectRe(letters) {
    return new RegExp(`[^${letters}]`, 'g')
  }

  hasWord = (word) => (
    this.guesses.some((guess) => (guess.word === word))
    || this.nogos.some((guess)  => (guess.word === word))
  )

  normEntry = (text) => (
    text.toLowerCase().replace(this.rejectRe, '')
  )

  addGuess(wd) {
    if (wd.length === 0) { return {} }
    const word = wd.toLowerCase()
    const guess = new Guess(word, this)
    if (this.hasWord(word)) { return guess }
    if (guess.nogo) {
      this.nogos = this.nogos.concat(guess)
      this.nogos.sort(Bee.byAlpha)
    } else {
      this.guesses   = this.guesses.concat(guess)
      this.hints = this.getHints()
      this.guesses.sort(Bee.byAlpha)
    }
    return guess
  }

  delGuess(wd) {
    this.guesses   = this.guesses.filter((guess) => guess.word !== wd)
    this.nogos     = this.nogos.filter((guess)   => guess.word !== wd)
    this.hints = this.getHints()
  }

  static byAlpha(aa, bb) {
    return (aa.word < bb.word ? -1 : 1)
  }

  static byScore(aa, bb) {
    return (aa.score < bb.score ? -1 : Bee.byAlpha(aa, bb))
  }

  guessesByScore = () => {
    const { nums:nyt_nums } = this.lexMatches('nyt')
    const { nums:scr_nums } = this.lexMatches('scr')
    return _(this.guesses)
      .groupBy('len')
      .map((gs, len) => ({
        title: `${len}s (${gs.length}/${scr_nums[len]} | ${gs.filter((gg) => gg.nyt).length}/${nyt_nums[len]})`,
        data: gs,
      }))
      .value()
  }

  lexMatches = (lex) => {
    if (! this._lexMatches[lex]) {
      this._lexMatches[lex] = Dicts.lexMatches(lex, this.letters.toLowerCase())
    }
    return this._lexMatches[lex]
  }

  sectionForGuess = (guess) => {
    const gBS          = this.guessesByScore()
    const lens         = gBS.map((ll) => (ll.data[0].len))
    const sectionIndex = _.findIndex(lens, (len) => (len === guess.len))
    if (sectionIndex < 0) return null
    let itemIndex    = _.findIndex(gBS[sectionIndex].data, (gg) => (gg.word === guess.word))
    if (itemIndex < 0) { itemIndex = 0 }
    // console.log(lens, sectionIndex, gBS[sectionIndex], itemIndex)
    return ({ sectionIndex, itemIndex, viewPosition: 0.25 })
  }

  summary(lex) {
    const { grouped, topScore, num } = this.lexMatches(lex)
    const beeHist = this.wordHist(lex)
    const totHist = Object
      .entries(grouped)
      .map(([kk, vv]) => [kk, vv.length])
      .map(([kk, vv]) => `${kk}:${beeHist[kk]}/${vv}`)
      .join(' ')
    return `${this.totScore()}/${topScore} (${this.guesses.length}/${num}): ${totHist}`
  }

  wordHist(lex) {
    const hist = {}
    _.range(0, 15).forEach((nn) => (hist[nn] = 0)) // eslint-disable-line
    this.guesses.forEach((guess) => {
      if (guess[lex]) {
        hist[guess.len] = 1 + hist[guess.len]
      }
    })
    return hist
  }

  totScore() {
    return this.guesses.reduce((tot, guess) => (tot + guess.score), 0)
  }

  serialize() {
    return {
      letters: this.letters,
      datestr: this.datestr,
      guesses: this.guesses.map((gg) => gg.word),
      nogos:   this.nogos.map((gg) => gg.word),
    }
  }

  static from(obj) {
    const bee   =  Object.assign(new Bee(obj.letters), obj)
    bee.guesses = bee.guesses.map((gg) => new Guess(gg, bee))
    bee.nogos   = bee.nogos.map((gg)   => new Guess(gg, bee))
    bee.hints   = bee.getHints()
    return bee
  }

}

export default Bee
