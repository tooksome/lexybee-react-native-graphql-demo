import React          from 'react'
import { StyleSheet, Text, View, FlatList, SectionList,
}                     from 'react-native'
import { Icon,
}                     from 'react-native-elements'

const validStyle = (guess) => {
  if (! guess.valid)  return styles.entryBad
  if (guess.nogo)    return styles.nogo
  if (guess.isPan)   return styles.entryPangram
  if (guess.nyt)     return styles.entryValid
  if (guess.scr)     return styles.entryScrabble
  return styles.entryOther
}

const guessItem = ({ item, showScore = true, delGuess, reveal = null }) => {
  const guess = item
  const vStyle = validStyle(guess)
  return (
    <View style={[styles.guessBox, vStyle]}>
      { (showScore)
        && (
          <Text
            numberOfLines={1}
            style={[styles.guessInfo, (guess.score < 1 ? styles.guessInfoInvalid : styles.guessInfoGood)]}
          >
            {(guess.score > 0) ? guess.score : ' '}
          </Text>
        )}

      <Text style={styles.guess}>
        {guess.revealed(reveal)}
      </Text>
      { delGuess
        && (
          <Icon
            name="cancel"
            iconStyle={[styles.clearEntry]}
            onPress={() => delGuess(guess.word)}
          />
        )}
    </View>
  )
}

const GuessList = ({ guesses, delGuess, wordListRef }) => (
  <SectionList
    style               = {[styles.wordList]}
    keyExtractor        = {(guess) => (guess.word)}
    sections            = {guesses}
    renderItem          = {(info) => guessItem({ delGuess, ...info })}
    ListEmptyComponent  = {(<Text style={styles.emptyGuessListTitle}>Guess your first word</Text>)}
    renderSectionHeader = {({ section }) => (<Text style={styles.glHeader}>{section.title}</Text>)}
    ref={wordListRef}
  />
)

const NogosList = ({ nogos, delGuess }) => (
  <FlatList
    ListHeaderComponent = {<Text style={styles.glHeader}>Invalid</Text>}
    style               = {[styles.wordList, styles.nogosList]}
    keyExtractor        = {(word, idx) => (idx.toString())}
    data                = {nogos}
    renderItem          = {(info) => guessItem({ delGuess, showScore: false, ...info })}
  />
)


const HintsList = ({ hints, reveal }) => (
  <FlatList
    ListHeaderComponent = {<Text style={styles.glHeader}>Hints ({reveal})</Text>}
    style               = {[styles.wordList, styles.nogosList]}
    keyExtractor        = {(word, idx) => (idx.toString())}
    data                = {hints}
    renderItem          = {(info) => guessItem({ showScore: false, reveal, ...info })}
  />
)


const WordLists = ({ guesses, nogos, hints, delGuess, wordListRef, reveal, showHints }) => (
  <View style={styles.wordListBox}>
    <GuessList guesses={guesses}  delGuess={delGuess} wordListRef={wordListRef} />
    {(showHints
      ? (<HintsList hints={hints} reveal={reveal} />)
      : (<NogosList nogos={nogos}     delGuess={delGuess} />)
    )}
  </View>
)

//

const styles = StyleSheet.create({
  wordListBox: {
    width:             '100%',
    flex:              6,
    flexDirection:     'row',
  },
  wordList: {
    flex:              5,
  },
  nogosList: {
    flex:              1,
    backgroundColor:   '#EEE',
  },
  guessBox: {
    flexDirection:     'row',
    justifyContent:    'flex-start',
    alignItems:        'center',
    flexWrap:          'nowrap',
    paddingVertical:   1,
    marginHorizontal:  4,
    backgroundColor:   '#ccc',
    borderRadius:      0,
  },
  emptyGuessListTitle: {
    paddingTop:        6,
    textAlign:         'center',
    fontSize:          18,
  },
  guess: {
    fontSize:          18,
    flex:              6,
    padding:           2,
    paddingLeft:       5,
  },
  guessInfo: {
    fontSize:          16,
    flex:              2,
    flexWrap:          'nowrap',
    textAlign:         'center',
    /* borderRadius:   8,
     * borderWidth:    2,
     * borderStyle:    'solid', */
  },
  guessInfoGood: {
    borderColor:       '#51F097',
  },
  guessInfoInvalid: {
    borderColor:       '#eee',
  },
  glHeader: {
    flex:              1,
    fontSize:          20,
    textAlign:         'center',
    padding:           4,
    backgroundColor:   '#FFF',
    borderRadius:      8,
    shadowColor:       '#222',
    shadowOffset: {
      width:           0,
      height:          2,
    },
    shadowRadius:      4,
    shadowOpacity:     0.12,
  },
  entryValid: {
    backgroundColor:   '#ccf0df',
  },
  entryScrabble: {
    backgroundColor:   '#ddebdd',
  },
  entryOther: {
    backgroundColor:   '#eee',
  },
  entryBad: {
    backgroundColor:   '#eedddd',
  },
  entryPangram: {
    backgroundColor:   '#ddddee',
  },
  clearEntry: {
    color: "#c8c8c8",
  },
})

export default WordLists
