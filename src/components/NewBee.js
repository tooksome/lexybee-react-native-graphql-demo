import React, { useState } from 'react'
import { StyleSheet, View,
}                          from 'react-native'
import { Button, Input, Icon,
}                          from 'react-native-elements'
import { useMutation,
}                          from '@apollo/client';
import * as Yup            from 'yup'
//
import Bee                 from '../lib/Bee'
import Ops                 from '../graphql/Ops'

const validationSchema = Yup.object().shape({
  letters: Yup
    .string()
    .label('Letters')
    .min(7, "Enter 7 letters")
    .matches(/^([a-zA-Z][^a-zA-Z]*){7}$/, "Enter 7 letters"),
})


const NewBee = () => {
  const [entry, setEntry]  = useState('')
  const [beeAddMu] = useMutation(Ops.bee_put_mu, {
    update: (cache, { data: { bee_put: { bee } } }) => {
      const old_data = cache.readQuery({ query: Ops.bee_list_ids_qy })
      const { bee_list: { bees } } = old_data
      const new_bees = bees.concat([bee])
      new_bees.sort((aa, bb) => ((aa.letters < bb.letters) ? -1 : 1))
      const new_data = { ...old_data,
        bee_list: { ...old_data.bee_list, bees: new_bees },
      }
      // console.log(new_data)
      cache.writeQuery({
        query: Ops.bee_list_ids_qy,
        data:  new_data,
      })
    },
  })

  const addBeePlz = () => {
    beeAddMu({ variables: { letters: entry } })
    setEntry('')
  }

  return (
    <View style={styles.container}>
      <Input
        containerStyle   = {styles.lettersInput}
        inputContainerStyle= {{ borderBottomColor:'transparent' }}
        value            = {entry}
        placeholder      = "New Letters; Main Letter First"
        autoCapitalize   = "none"
        autoCorrect      = {false}
        autoCompleteType = "off"
        onChangeText     = {(text) => setEntry(Bee.normalize(text).toUpperCase())}
        onSubmitEditing  = {addBeePlz}
      />
      <Button
        title            =" New"
        icon             ={<Icon name="add-circle-outline" color="#FFF" />}
        onPress          ={addBeePlz}
        style            ={styles.newBeeBtn}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width:            '100%',
    alignItems:       'center',
    padding:          8,
    flexDirection:    'row',
    backgroundColor:  '#FFF',
  },
  lettersInput: {
    flex:             1,
    marginRight:      16,
    backgroundColor:  '#F8F8F8',
  },
  newBeeBtn: {
    flex:             10,
    borderRadius:     8,
  },
});

export default NewBee
