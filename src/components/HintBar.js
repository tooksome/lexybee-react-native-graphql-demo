import React                    from 'react'
import _                        from 'lodash'
import { StyleSheet, Text, View,
}                               from 'react-native'
import { Button, Icon }         from 'react-native-elements'

const HintBar = ({ reveal, incReveal, showHints, setShowHints }) => (
  <View style = {[styles.hintsHeader]}>
    {
      showHints
        && (
          <View style={[styles.hintsHeader]}>
            <Button
              title       = "-"
              onPress     = {() => incReveal(-1)}
              buttonStyle = {styles.mutedButton}
              titleStyle  = {styles.hintsHeaderText}
            />
            <Text style   = {styles.hintsHeaderText}>({reveal})</Text>
            <Button
              title       = "+"
              onPress     = {() => incReveal(1)}
              buttonStyle = {styles.mutedButton}
              titleStyle  = {styles.hintsHeaderText}
            />
          </View>
        )
    }
    <Icon
      name        = {showHints ? 'visibility' : 'visibility-off'}
      iconStyle   = {styles.showHintsBtn}
      onPress     = {() => setShowHints(! showHints)}
    />
  </View>
)

export default HintBar

const styles = StyleSheet.create({
  hintsHeader: {
    flex:               1,
    flexDirection:      'row',
    justifyContent:     'flex-start',
    alignItems:         'center',
    flexWrap:           'nowrap',
  },
  hintsHeaderText: {
    color:              '#222',
    fontSize:           18,
  },
  mutedButton: {
    backgroundColor:    'transparent',
    padding:            5,
  },
  showHintsBtn: {
    fontSize:           30,
    paddingHorizontal:  10,
  },
})
