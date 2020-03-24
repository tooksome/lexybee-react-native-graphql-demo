import React, { useState }      from 'react'
import _                        from 'lodash'
import { StyleSheet, View, FlatList,
}                               from 'react-native'
import { Text }                 from 'react-native-elements'
import { useQuery }             from '@apollo/client'
//
import Bee                      from '../lib/Bee'
import Ops                      from '../graphql/Ops'
//
import { moreBees }             from '../graphql/methods'
import BeeListItem              from '../components/BeeListItem'
import NewBee                   from '../components/NewBee'

const BeeListScreen = ({ navigation }) => {
  const [filter,     setFilter]     = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const { loading, error, data, fetchMore } = useQuery(Ops.bee_list_ids_qy)
  if (loading)            return <Text>Loading...</Text>
  if (error && (! data))  return renderError(error)
  if (! data)             return <Text>No Data</Text>
  const filter_re = Bee.makePangramRe(filter)

  return (
    <View style={styles.container}>
      <NewBee
        onChangeLtrs = {(text) => setFilter(text.toUpperCase())}
      />
      <FlatList
        style        = {styles.beeList}
        keyExtractor = {(letters, idx) => (letters + idx)}
        data         = {data.bee_list.bees.filter((bb) => filter_re.test(bb.letters))}
        onEndReached = {moreBees(data, fetchMore, refreshing, setRefreshing)}
        onEndReachedThreshold = {1.2}
        renderItem   = {({ item }) => <BeeListItem item={item} navigation={navigation} />}
      />
    </View>
  )
}

const renderError = (error) => {
  console.log("Error in ListBees", JSON.stringify(error)) // eslint-disable-line
  return (
    <View  style={styles.container}>
      <Text>
        Error:
        {JSON.stringify(error)}
      </Text>
    </View>
  )
}

export default BeeListScreen

const styles = StyleSheet.create({
  container: {
    flex:               1,
    alignItems:         'center',
  },
  beeList: {
    width:              '100%',
    marginTop:          4,
  },
})
