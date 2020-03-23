import * as React     from 'react';
import { StyleSheet, Text, View, FlatList, SectionList,
}                     from 'react-native';
import { Icon,
}                     from 'react-native-elements'

const validStyle = (guess) => {
  if (!guess.valid)  return styles.entryBad
  if (guess.nogo)    return styles.nogo
  if (guess.isPan)   return styles.entryPangram
  if (guess.nyt)     return styles.entryValid
  return styles.entryOther
};

const guessItem = ({ item, showScore = true, delGuess }) => {
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
            {guess.score}
          </Text>
        )
      }
      
      <Text style={styles.guess}>
        {guess.word}
      </Text>
      <Icon
        name="cancel"
        style={[styles.clearEntry]}
        onPress={() => delGuess(guess.word)}
      />
    </View>
  )
};

const GuessList = ({ guesses, delGuess }) => (
  <SectionList
    style               = {[styles.wordList]}
    keyExtractor        = {(guess) => (guess.word)}
    sections            = {guesses}
    renderItem          = {(info) => guessItem({ delGuess, ...info })}
    ListEmptyComponent  = {(<Text style={styles.emptyGuessListTitle}>Guess your first word</Text>)}
    renderSectionHeader = {({ section }) => (<Text style={styles.guessHeader}>{section.title}</Text>)}
  />
);

const NogosList = ({ nogos, delGuess }) => (
  <FlatList
    ListHeaderComponent = {<Text style={styles.guessHeader}>Invalid</Text>}
    style               = {[styles.wordList, styles.nogosList]}
    keyExtractor        = {(word, idx) => (idx.toString())}
    data                = {nogos}
    renderItem          = {(info) => guessItem({ delGuess, showScore: false, ...info })}
  />
);

const WordLists = ({ guesses, nogos, delGuess }) => (
  <View style={styles.wordListBox}>
    <GuessList guesses={guesses} delGuess={delGuess} />
    <NogosList nogos={nogos} delGuess={delGuess} />
  </View>
);


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
    /* borderRadius:      8,
     * borderWidth:       2,
     * borderStyle:       'solid', */
  },
  guessInfoGood: {
    borderColor:       '#51F097',
  },
  guessInfoInvalid: {
    borderColor:       '#eee',
  },
  guessHeader: {
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
    backgroundColor:   '#ddeedd',
    padding:           4,
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
  },
})

export default WordLists
