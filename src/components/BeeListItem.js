import React               /**/ from 'react'
import _                        from 'lodash'
import { StyleSheet, Alert, View, Text, TouchableOpacity,
}                               from 'react-native'
import { Icon }                 from 'react-native-elements'
import { useMutation }          from '@apollo/client'
//
import Bee                      from '../lib/Bee'
import Ops                      from '../graphql/Ops'
import { beeDelUpdater,
}                               from '../graphql/methods'

const navToBee = (bee, event, navigation) => {
  navigation.navigate("Bee", { title: bee.letters, letters: bee.letters })
}

const BeeListItem = ({ item:bee, navigation }) => {
  const [beeDelMu] = useMutation(Ops.bee_del_mu, {
    update: beeDelUpdater,
  })

  const beeDelPlz = () => {
    Alert.alert(
      `Delete '${bee.letters}'?`,
      '',
      [
        { text: 'Cancel',
          style: 'cancel' },
        { text: 'Delete',
          style: 'destructive',
          onPress: () => beeDelMu({ variables: { letters: bee.letters } }) },
      ],
    )
  }
  // AllBees.forEach((letters) => (beeDelMu({ variables: { letters } })))

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.listRect]}
        onPress        = {(event) => navToBee(bee, event, navigation)}
      >
        <Text style={styles.listText}>
          {Bee.dispLtrs(bee.letters)}
        </Text>
        <Text style={styles.datestrText}>
          {bee.datestr}
        </Text>
        <Icon name="cancel" onPress={beeDelPlz} color="#aaa" />
      </TouchableOpacity>

    </View>
  )
}

// To find height, add this to the Wrapping TouchableOpacity above:
//   onLayout={(event) => (console.log(event.nativeEvent.layout))}
const LIST_ITEM_HEIGHT = 49 + 8 // height + padding
BeeListItem.getItemLayout = (_d, index) => (
  { length: LIST_ITEM_HEIGHT, offset: LIST_ITEM_HEIGHT * index, index }
)

export default React.memo(BeeListItem)

const styles = StyleSheet.create({
  container: {
    flex:               1,
    width:              '100%',
  },
  listText: {
    fontSize:           24,
    flex:               12,
  },
  datestrText: {
    fontSize:           16,
    flex:               5,
    paddingRight:       2,
    color:              '#aaa',
  },
  listRect: {
    flex:               1,
    flexDirection:      'row',
    alignItems:         'center',
    backgroundColor:    '#f0f0f0',
    paddingHorizontal:  14,
    paddingVertical:    10,
    marginHorizontal:   8,
    marginVertical:     4,
    borderRadius:       8,
    shadowColor:        '#222',
    shadowOffset:       { width: 0, height: 2 },
    shadowRadius:       2,
    shadowOpacity:      0.12,
  },
})
