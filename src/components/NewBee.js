import React, { useState, useRef,
}                               from 'react'
import { StyleSheet, View, ActivityIndicator,
}                               from 'react-native'
import { Button, Input, Icon }  from 'react-native-elements'
import { useMutation }          from '@apollo/client'
import * as Yup                 from 'yup'
import { useNavigation }        from '@react-navigation/native'
//
import Bee                      from '../lib/Bee'
import Ops                      from '../graphql/Ops'

const validator = Yup.object().shape({
  entry: Yup
    .string()
    .label('Letters')
    .min(7, "Enter 7 letters")
    .matches(/^([a-zA-Z][^a-zA-Z]*){7}$/, "Enter 7 letters"),
})


const NewBee = ({ onChangeLtrs }) => {
  const [entry,        setEntry]       = useState('')
  const [isSubmitting, setSubmitting]  = useState(false)
  const navigation   = useNavigation()
  const lettersInput = useRef(null)
  //
  const [beeAddMu] = useMutation(Ops.bee_put_mu, {
    onCompleted({ bee_put: { bee } }) {
      setSubmitting(false)
      navigation.push("Bee", { title: bee.letters, letters: bee.letters })
    },
    update: (cache, { data: { bee_put: { bee } } }) => {
      const old_data = cache.readQuery({ query: Ops.bee_list_ids_qy })
      let  { bee_list: { bees } } = old_data
      bees = bees.filter((bb) => (bb.letters !== bee.letters))
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
    if (! validator.isValidSync({ entry })) {
      lettersInput.current.shake()
      return
    }
    setSubmitting(true)
    beeAddMu({ variables: { letters: entry } })
    updateEntry('')
  }

  const updateEntry = (text) => {
    const normText = Bee.normalize(text).toUpperCase()
    onChangeLtrs(normText)
    setEntry(normText)
  }

  return (
    <View style={styles.container}>
      <Input
        containerStyle   = {styles.lettersInput}
        value            = {entry}
        placeholder      = "Letters (Key Letter 1st)"
        autoCapitalize   = "none"
        autoCorrect      = {false}
        autoCompleteType = "off"
        onChangeText     = {updateEntry}
        onSubmitEditing  = {addBeePlz}
        ref              = {lettersInput}
        rightIcon = {
              <Icon
        name      = "clear"
        style     = {styles.clearEntryTextButton}
        onPress   = {() => updateEntry('')}
        />
        }
      />

      {(isSubmitting
        ? (<ActivityIndicator />)
        : (
          <Button
            disabled         = {! validator.isValidSync({ entry })}
            title            =" New"
            icon             ={<Icon name="add-circle-outline" color="#FFF" />}
            onPress          ={addBeePlz}
            style            ={styles.newBeeBtn}
          />
        )
      )}
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
  clearEntryTextButton: {
    padding:           5,
  },
})

export default NewBee
