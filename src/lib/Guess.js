import _                from 'lodash'
import { Dicts }        from './Dicts'

const Bowdlerizers = _.range(0, 15).map((len) => new RegExp(`^(.*?)(.{0,${len}})$`))

class Guess {
  constructor(wd, bee) {
    this.word    = wd.toLowerCase()
    this.len     = this.word.length
    this.isPan   = bee.isPan(this.word)
    this.scr     = Dicts.isScr(this.word)
    this.nyt     = Dicts.isNyt(this.word)
    this.valid   = (this.scr || this.nyt)
    this.hasMain = bee.hasMain(this.word)
    this.score   = this.getScore(this.word)
  }

  revealed(reveal) {
    if (! _.isNumber(reveal)) { return this.word }
    const stars   = _.padEnd('', (this.len - reveal), '*')
    if (reveal <= 0) { return stars }
    const bowler  = Bowdlerizers[reveal] || Bowdlerizers[15]
    return this.word.replace(
      bowler,
      (_m, hide, show) => (stars + show)) // eslint-disable-line
  }

  getScore() {
    if (this.nogo)      return 0
    if (! this.nyt)     return 0
    if (this.len === 4) return 1
    return this.len + (this.isPan ? 7 : 0)
  }

  get nogo() {
    return ((! this.valid) || (! this.hasMain) || (this.len < 4))
  }

  get color() {
    if (! this.valid) return '#eecccc'
    if (this.isPan)   return '#ddddff'
    if (this.nyt)     return '#cceecc'
    return 'dddddd'
  }

}
export default Guess
