import React, { useState }      from 'react'
import _                        from 'lodash'
import { StyleSheet, View, FlatList,
}                               from 'react-native'
import { Text, Icon }           from 'react-native-elements'
import { useQuery }             from '@apollo/client'
//
import Bee                      from '../lib/Bee'
import Ops                      from '../graphql/Ops'
//
import { moreBees }             from '../graphql/methods'
import BeeListItem              from '../components/BeeListItem'
import NewBee                   from '../components/NewBee'
import { useToggler }           from '../utils/hooks'

const SORTABLES = ['datestr', 'nytFrac', 'nytMax', 'letters', 'updatedAt']

const rotateArray = (arr) => ([...(_.drop(arr)), arr[0]])
const sortIcons = {
  datestr:      'today',
  letters:      'sort-by-alpha',
  nytFrac:      'bubble-chart',
  nytMax:       'gavel',
  updatedAt:    'history',
}
const BeeListScreen = ({ navigation }) => {
  const [sortRev,       togSortRev,    setSortRev]  = useToggler(true)
  const [sortFieldArr,  setSortFieldArr] = useState([...SORTABLES])
  const [filter,        setFilter]       = useState('')
  const [refreshing,    setRefreshing]   = useState(false)
  const rotSortFieldArr = () => {
    setSortFieldArr((sfs) => {
      const newSF = rotateArray(sfs)
      setSortRev(! (newSF[0] === 'letters'))
      return newSF
    })
  }
  //
  const { loading, error, data, fetchMore } = useQuery(
    Ops.bee_list_ids_qy,
    {  variables: { sortby: (sortFieldArr[0]), sortRev } },
  )

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={styles.row}>
          <Icon
            name        = {sortIcons[sortFieldArr[0]]}
            iconStyle   = {styles.showHintsBtn}
            onPress     = {() => { rotSortFieldArr() }}
          />
          <Icon
            name        = {sortRev ? 'arrow-downward' : 'arrow-upward'}
            iconStyle   = {styles.showHintsBtn}
            onPress     = {() => { togSortRev() }}
          />
        </View>
      ),
    })
  }, [navigation, sortRev, togSortRev, sortFieldArr, setSortFieldArr])

  // console.log(sortFieldArr, sortIcons[sortFieldArr[0]])

  if (loading)            return <Text>Loading...</Text>
  if (error && (! data))  return renderError(error)
  if (! data)             return <Text>No Data</Text>
  const result = data.bee_list
  if (! result.success)   return <Text>Upstream Error: {JSON.stringify(data)}</Text>
  const filter_re = Bee.makePangramRe(filter)

  const renderItem   = ({ item }) => (<BeeListItem item={item} navigation={navigation} />)
  const keyExtractor = (bee, _idx) => (bee.letters)
  // console.log(data)
  const beeData      = result.bees.filter((bb) => filter_re.test(bb.letters))

  return (
    <View style={styles.container}>
      <NewBee
        onChangeLtrs = {(text) => setFilter(text.toUpperCase())}
      />
      {/* <Text>{beeData.length}</Text> */}
      <FlatList
        style         = {styles.beeList}
        keyExtractor  = {keyExtractor}
        data          = {beeData}
        onEndReached  = {moreBees(data, fetchMore, refreshing, setRefreshing)}
        getItemLayout = {BeeListItem.getItemLayout}
        renderItem    = {renderItem}
        onEndReachedThreshold = {1.2}
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
  row: {
    flex:               1,
    flexDirection:      'row',
    alignItems:         'center',
  },
  beeList: {
    width:              '100%',
    marginTop:          4,
  },
  showHintsBtn: {
    fontSize:           30,
    marginLeft:         10,
    color:              '#ccf',
  },
})
