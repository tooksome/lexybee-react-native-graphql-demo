import React, { useState } from 'react'
import { StyleSheet, View, Image, TouchableOpacity,
}                          from 'react-native'
import { Button, Input, Icon, Text,
}                          from 'react-native-elements'
import { useMutation }     from '@apollo/client'
import { Formik }          from 'formik'
import * as Yup            from 'yup'
//
import Layout              from '../lib/Layout'
import Ops                 from '../graphql/Ops'
import images         from '../constants/Images'

const LetterButton = ({ letter, handler }) => (
  <TouchableOpacity
    title={letter}
    onPress={() => handler(letter)}
    style={styles.letterButton}
    titleStyle={styles.letterButtonText}
  >
    <Text style={styles.letterButtonText}>{letter}</Text>
  </TouchableOpacity>
)

// bee_get({"letters":"CAIHLNP"}): {"__typename":"BeeGetResp","success":true,"message":"Bee 'CAIHLNP' gotten","bee":{"__ref":"Bee:{\"letters\":\"CAIHLNP\"}"}}


const GuessInput = ({ bee, addToBee }) => {
  const [entry, setEntry] = useState('');

  const addLetter  = (letter) => setEntry(entry + letter);
  const delLetter  = ()       => setEntry(entry.substring(0, entry.length - 1));
  const clearEntry = ()       => setEntry('');
  const [beePutMu] = useMutation(Ops.bee_put_mu);

  const addGuess = () => {
    if (bee.hasWord(entry)) { clearEntry(); return }
    bee.addGuess(entry);
    console.log('added', entry, bee.guesses);
    beePutMu({ variables: bee.serialize() });
    clearEntry()
  }

  return (
    <View style={styles.container}>
      <View style={styles.guessInputRow}>
        <View style={styles.guessInputFieldContainer}>
          <Input
            style={[styles.entryText]}
            inputStyle={styles.entryText}
            inputContainerStyle={{ borderBottomColor:'transparent' }}
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

          <Icon name="backspace" style={[styles.clearEntryTextButton]} onPress={delLetter} />
        </View>
        <TouchableOpacity
          style={entry.length === 0 ? styles.disabled : styles.entryIconContainer}
          onPress={addGuess}
          disabled={entry.length === 0}
        >
          <Icon name="check" iconStyle={styles.entryIcon} />
        </TouchableOpacity>

      </View>


      <View style={styles.buttonRow}>
        {
          bee.larry.map((ltr) => (
            <LetterButton key={ltr} letter={ltr} handler={addLetter} />))
        }
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    width:          '100%',
    alignItems:     'center',
    marginBottom:   24,
  },
  //
  entryBox: {
    flexDirection:  'row',
    justifyContent: 'flex-start',
  },
  guessInputRow: {
    width:          '100%',
    flexDirection:  'row',
    flexWrap:       'nowrap',
    justifyContent: 'flex-start',
    alignItems:     'center',
    alignSelf:      'flex-start',
    paddingHorizontal:16,
    paddingVertical: 8,
    backgroundColor:'#FFF',
  },
  guessInputFieldContainer: {
    flex: 1,
    flexDirection:  'row',
    justifyContent: 'flex-end',
    alignItems:     'center',
    paddingHorizontal:16,
    borderRadius:    8,
    backgroundColor: '#F8F8F8',
  },
  clearEntryTextButton: {
    padding:        10,
  },
  entryText: {
    fontSize:       24,
    flex:           4,
    marginVertical: 8,
    marginRight:    8,
    paddingLeft:    12,
  },
  entryIconContainer: {
    flexDirection:  'column',
    alignItems:     'center',
    marginLeft:     16,
    marginRight:    2,
    paddingVertical:16,
    paddingHorizontal:20,
    backgroundColor:'#27C16B',
    borderRadius:   8,
    shadowColor:    '#222',
    shadowOffset:   { width: 0, height: 2 },
    shadowRadius:   4,
    shadowOpacity:  0.12,
  },
  disabled: {
    flexDirection:  'column',
    alignItems:     'center',
    marginLeft:     16,
    marginRight:    2,
    paddingVertical:16,
    paddingHorizontal:20,
    backgroundColor:'#DDD',
    borderRadius:   8,
  },
  entryIcon: {
    color:          '#FFF',
  },
  letterButton: {
    padding:        5,
    margin:         5,
    width:          Layout.window.width / 8,
    fontSize:       34,
    backgroundColor:'#F7D476',
    borderRadius:   8,
    borderWidth:    2,
    borderColor:    '#DA8A49',
    borderStyle:    'solid',
  },
  letterButtonText: {
    fontSize:       34,
    fontWeight:     '600',
    textAlign:      'center',
    color:          '#5C3601',
  },
  buttonRow: {
    flexDirection:  'row',
    justifyContent: 'space-around',
    width:          '94%',
    alignItems:     'center',
  },
});

export default GuessInput
