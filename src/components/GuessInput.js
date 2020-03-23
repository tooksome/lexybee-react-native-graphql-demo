import React, { useState } from 'react'
import { StyleSheet, View,
}                          from 'react-native'
import { Button, Input, Icon, Text,
}                          from 'react-native-elements'
import { useMutation }     from '@apollo/client'
//
import Layout              from '../lib/Layout'
import Ops                 from '../graphql/Ops'

const LetterButton = ({ letter, handler }) => (
  <Button
    title       = {letter}
    onPress     = {() => handler(letter)}
    buttonStyle = {styles.letterButton}
    titleStyle  = {styles.letterButtonText}
  />
)

// Example response
//
// bee_get({"letters":"CAIHLNP"}): {
//   "__typename":"BeeGetResp","success":true,
//   "message":"Bee 'CAIHLNP' gotten",
//   "bee":{"__ref":"Bee:{\"letters\":\"CAIHLNP\"}"
// }}

const GuessInput = ({ bee }) => {
  const [entry, setEntry] = useState('')

  const addLetter  = (letter) => setEntry(entry + letter)
  const delLetter  = ()       => setEntry(entry.substring(0, entry.length - 1))
  const clearEntry = ()       => setEntry('')
  const [beePutMu] = useMutation(Ops.bee_put_mu)

  const addGuess = () => {
    if (bee.hasWord(entry)) { clearEntry(); return }
    bee.addGuess(entry)
    beePutMu({ variables: bee.serialize() })
    clearEntry()
  }

  return (
    <View style={styles.container}>
      <View style={styles.guessInputRow}>
        <View style={styles.guessInputFieldContainer}>
          <Input
            style={[styles.entryText]}
            inputStyle={styles.entryText}
            autoCapitalize  = "none"
            autoCorrect     = {false}
            autoCompleteType = "off"
            value={entry}
          /*
            leftIcon={(
              <View style={styles.entryBox}>
                <Icon name="backspace" iconStyle={styles.entryIcon} onPress={delLetter} />
                <Icon name="cancel"    iconStyle={styles.entryIcon} onPress={clearEntry} />
              </View>
            )}
            */
            onChangeText={(text) => setEntry(bee.normEntry(text))}
          /*
            rightIcon={(
              <View style={[styles.entryIconContainer]}>
                <Icon name="check" iconStyle={styles.entryIcon} onPress={addGuess} />
              </View>
            )}
            */
            onSubmitEditing ={addGuess}
          />

          <Icon
            name    = "backspace"
            style   = {[styles.clearEntryTextButton]}
            onPress = {delLetter}
          />
        </View>
        <Button
          buttonStyle={[ styles.addEntryBtn, ((entry.length === 0) && styles.disabled), ]}
          onPress={addGuess}
          disabled={entry.length === 0}
          icon={<Icon name="check" iconStyle={styles.entryIcon} />}
        />
      </View>

      <View style={styles.buttonRow}>
        {
          bee.larry.map((ltr) => (
            <LetterButton key={ltr} letter={ltr} handler={addLetter} />))
        }
      </View>
    </View>
          )
}

let btnWidth = ((Layout.window.width - 65) / 7)
if (btnWidth < 32) { btnWidth = 32 }

const styles = StyleSheet.create({
  container: {
    width:             '100%',
    alignItems:        'center',
    // marginBottom:      24,
  },
  //
  guessInputRow: {
    width:             '100%',
    flexDirection:     'row',
    flexWrap:          'nowrap',
    justifyContent:    'flex-start',
    alignItems:        'center',
    alignSelf:         'flex-start',
    paddingHorizontal: 16,
    paddingVertical:   8,
    backgroundColor:   '#FFF',
  },
  guessInputFieldContainer: {
    flex:              1,
    flexDirection:     'row',
    justifyContent:    'flex-end',
    alignItems:        'center',
    paddingHorizontal: 12,
    borderRadius:      8,
    backgroundColor:   '#F8F8F8',
  },
  clearEntryTextButton: {
    padding:           5,
  },
  entryText: {
    flex:              4,
  },
  addEntryBtn: {
    marginLeft:        12,
    marginRight:       2,
    paddingVertical:   16,
    paddingHorizontal: 16,
    backgroundColor:   '#27C16B',
    borderRadius:      8,
    shadowColor:       '#222',
    shadowOffset:   { width: 0, height: 2 },
    shadowRadius:      4,
    shadowOpacity:     0.12,
  },
  addEntryButton: {
    flexDirection:     'column',
    alignItems:        'center',
    marginLeft:        12,
    marginRight:       2,
    paddingVertical:   16,
    paddingHorizontal: 16,
    backgroundColor:   '#27C16B',
    borderRadius:      8,
    shadowColor:       '#222',
    shadowOffset:   { width: 0, height: 2 },
    shadowRadius:      4,
    shadowOpacity:     0.12,
  },
  disabled: {
    backgroundColor:   '#DDD',
  },
  entryIcon: {
    color:             '#FFF',
  },
  letterButton: {
    padding:           3,
    margin:            5,
    width:             btnWidth,
    backgroundColor:   '#eef',
    borderRadius:      8,
    borderWidth:       2,
    borderColor:       '#99b',
    borderStyle:       'solid',
  },
  letterButtonText: {
    fontSize:          (btnWidth <= 32 ? 24 : 34),
    fontWeight:        '600',
    textAlign:         'center',
    color:             '#5C3601',
  },
  buttonRow: {
    flexDirection:     'row',
    justifyContent:    'space-around',
    width:             '94%',
    alignItems:        'center',
  },
})

export default GuessInput
