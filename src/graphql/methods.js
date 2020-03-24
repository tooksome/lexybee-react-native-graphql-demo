import _                        from 'lodash'
import Ops                      from './Ops'

export const moreBees = (data, fetchMore, refreshing, setRefreshing) => (() => {
  if (! data.bee_list.cursor) { return }
  if (refreshing)             {
    // console.log('skipping fetchMore', data.bee_list.cursor);
    return
  }
  if (! fetchMore)            { return }
  setRefreshing(true)
  setTimeout(() => { setRefreshing(false) }, 3000)
  // console.log(`starting fetchMore ${data.bee_list.cursor}`, refreshing)
  fetchMore({
    variables: {
      cursor: data.bee_list.cursor,
    },
    updateQuery: (prev, { fetchMoreResult, ..._rest }) => {
      // console.log(`update for fetchMore ${data.bee_list.cursor}`, refreshing)
      if (! fetchMoreResult) return prev
      let new_bees = [
        ...prev.bee_list.bees,
        ...fetchMoreResult.bee_list.bees,
      ]
      new_bees = _.sortedUniqBy(_.sortBy(new_bees, 'letters'), 'letters')
      // console.log(new_bees.map((bb) => bb.letters))
      const ret = ({
        ...fetchMoreResult,
        bee_list: {
          ...fetchMoreResult.bee_list,
          bees: new_bees,
        },
      })
      // console.log(ret)
      return ret
    },
  }).finally(() => {
    // console.log(`done fetchMore ${data.bee_list.cursor}`, refreshing)
    setRefreshing(false)
  })
})

export const beeDelUpdater = (cache, { data: { bee_del: { bee:dead_bee } } }) => {
  const old_data = cache.readQuery({ query: Ops.bee_list_ids_qy })
  const { bee_list: { bees } } = old_data
  const new_bees = bees.filter((bb) => (bb.letters !== dead_bee.letters))
  const new_data = {
    ...old_data,
    bee_list: { ...old_data.bee_list, bees: new_bees },
  }
  cache.writeQuery({
    query: Ops.bee_list_ids_qy,
    data:  new_data,
  })
}

export default {
  moreBees,
}
