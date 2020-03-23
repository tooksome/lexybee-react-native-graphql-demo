import * as React   from 'react'
import { StyleSheet, View, FlatList,
}                   from 'react-native'
import { Button, ListItem, Text, Icon,
}                   from 'react-native-elements'
import { useQuery, useMutation,
}                   from '@apollo/client'
//
import Bee          from '../lib/Bee'
import Ops          from '../graphql/Ops'
import NewBee       from '../components/NewBee'
// import AllBees   from '../../data/bees.json'

const BeeListScreen = ({ navigation }) => {
  const { loading, error, data, fetchMore } = useQuery(Ops.bee_list_ids_qy)
  if (loading)            return <Text>Loading...</Text>
  if (error && (!data))   return renderError(error)
  if (!data)              return <Text>No Data</Text>
  return (
    <View style={styles.container}>
      <NewBee />
      <FlatList
        style        = {styles.wordList}
        keyExtractor = {(letters, idx) => (letters + idx)}
        data         = {data.bee_list.bees}
        onEndReached = {fetcher(data, fetchMore)}
        renderItem   = {({ item }) => <BeeListItem item={item} navigation={navigation} />}
      />
    </View>
  )
}

const renderError = (error) => {
  console.log("Error in ListBees", JSON.stringify(error))
  return (
    <View  style={styles.container}>
      <Text>
        Error:
        {JSON.stringify(error)}
      </Text>
    </View>
  )
}

const BeeListItem = ({ item, navigation }) => {
  const bee = Bee.from(item)

  const [beeDelMu] = useMutation(Ops.bee_del_mu, {
    update: (cache, { data: { bee_del: { _dead_bee } } }) => {
      const old_data = cache.readQuery({ query: Ops.bee_list_ids_qy })
      const { bee_list: { bees } } = old_data
      const new_bees = bees.filter((bb) => (bb.letters !== bee.letters))
      const new_data = {
        ...old_data,
        bee_list: { ...old_data.bee_list, bees: new_bees },
      }
      // console.log(new_data)
      cache.writeQuery({
        query: Ops.bee_list_ids_qy,
        data:  new_data,
      })
    },
  })

  const beeDelPlz = () => beeDelMu({ variables: { letters: bee.letters } })
  // AllBees.forEach((letters) => (beeDelMu({ variables: { letters } })))

  return (
    <ListItem
      title          = {bee.dispLtrs}
      style          = {styles.listItemStyle}
      titleStyle     = {styles.listTextStyle}
      containerStyle = {styles.listItemContainerStyle}
      onPress        = {(event) => navToBee(bee, event, navigation)}
      rightIcon      = {{ name: 'cancel', onPress: beeDelPlz, color: '#222' }}
    />
  )
}

const navToBee = (bee, event, navigation) => {
  navigation.push("Bee", { title: bee.letters, letters: bee.letters })
}

const fetcher = (data, fetchMore) => (() => {
  if (!data.bee_list.cursor) { return }
  fetchMore({
    variables: {
      cursor: data.bee_list.cursor,
    },
    updateQuery: (prev, { fetchMoreResult, ...rest }) => {
      console.log('uq', 'prev', prev, 'more', fetchMoreResult, 'rest', rest)
      if (!fetchMoreResult) return prev
      const ret = ({
        ...fetchMoreResult,
        bee_list: {
          ...fetchMoreResult.bee_list,
          bees: [
            ...prev.bee_list.bees,
            ...fetchMoreResult.bee_list.bees,
          ],
        },
      })
      // console.log(ret)
      return ret
    },
  })
})

export default BeeListScreen

const styles = StyleSheet.create({
  container: {
    flex:                   1,
    alignItems:             'center',
  },
  wordList: {
    width:                  '100%',
    marginTop:              4,
  },
  listItemStyle: {
    paddingHorizontal:      8,
    paddingVertical:        4,
    borderRadius:           8,
  },
  listTextStyle: {
    fontSize: 24,
  },
  listItemContainerStyle: {
    paddingVertical:        12,
    borderRadius:           8,
    shadowColor:            '#222',
    shadowOffset:           { width: 0, height: 2 },
    shadowRadius:           2,
    shadowOpacity:          0.12,
  },
})
