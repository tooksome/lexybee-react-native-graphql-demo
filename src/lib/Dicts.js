import _                        from 'lodash'
import ScrabbleWords            from '../../data/wl_us.json'
import NytWords                 from '../../data/dict_nyt.json'
import ObsWords                 from '../../data/dict_obs.json'

const Dicts = {
  scr: new Set(ScrabbleWords),
  nyt: new Set(NytWords),
  obs: new Set(ObsWords),
  scr_wds: ScrabbleWords,
  nyt_wds: NytWords,
}

Dicts.lexMatches = (lex, letters) => {
  const re = new RegExp(`^(?=.*${letters[0]})[${letters}]{4,}$`)
  //
  const words    = Dicts[`${lex}_wds`].filter((wd) => re.test(wd))
  const grouped  = _.groupBy(words, 'length')
  const topScore = words.reduce((tot, wd) => {
    if      (wd.length <   4) {
      return tot
    } else if (wd.length === 4) {
      return tot + 1
    } else {
      return tot + wd.length
    }
  }, 0)
  const nums     = {}
  _.range(4, 15).forEach((nn) => nums[nn] = (grouped[nn] || []).length) // eslint-disable-line
  //
  return { words, topScore, grouped, nums, num: words.length }
}

// export default Dicts
export {
  ScrabbleWords,
  NytWords,
  ObsWords,
  Dicts,
}
