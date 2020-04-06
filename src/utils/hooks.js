import React               /**/ from 'react'
import _                        from 'lodash'

export const useToggler = (initial) => {
  const [state, setState] = React.useState(initial)
  const toggler = React.useCallback(() => (setState((val) => (! val))))
  return [state, toggler, setState]
}

// return:
//      [counter,
export const useCounter = (initial, { min, max, initFunc = (_.identity) }) => {
  const counter = React.useCallback((ct, { action, val }) => {
    let  count = ct
    switch (action) {
    case 'inc':   count += 1;                 break
    case 'dec':   count -= 1;                 break
    case 'add':   count += val;               break
    case 'set':   count  = val;               break
    case 'reset': count  = initFunc(initial); break
    default:
      throw new Error(`Unexpected action '${action}' in counter reducer`)
    }
    return _.clamp(count, min, max)
  })
  return React.useReducer(counter, initial, initFunc)
}

export default {
  useToggler,
  useCounter,
}
