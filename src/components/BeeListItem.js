import React                    from 'react'
import _                        from 'lodash'
import { StyleSheet, Alert }    from 'react-native'
import { ListItem }             from 'react-native-elements'
import { useMutation }          from '@apollo/client'
//
import Bee                      from '../lib/Bee'
import Ops                      from '../graphql/Ops'
import { beeDelUpdater,
}                               from '../graphql/methods'

const navToBee = (bee, event, navigation) => {
  navigation.navigate("Bee", { title: bee.letters, letters: bee.letters })
}

const BeeListItem = React.memo(({ item, navigation }) => {
  const bee = Bee.from(item)

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
    <ListItem
      title          = {bee.dispLtrs}
      style          = {styles.listItemStyle}
      titleStyle     = {styles.listTextStyle}
      containerStyle = {styles.listItemContainerStyle}
      onPress        = {(event) => navToBee(bee, event, navigation)}
      rightIcon      = {{ name: 'cancel', onPress: beeDelPlz, color: '#222' }}
    />
  )
})

export default BeeListItem

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
