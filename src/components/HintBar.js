import React                    from 'react'
import _                        from 'lodash'
import { StyleSheet, Text, View,
}                               from 'react-native'
import { Button, Icon }         from 'react-native-elements'

const HintBar = ({ reveal, incReveal, showHints, toggleHints }) => (
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
              type = "outline"
            />
            <Text style   = {styles.hintsHeaderText}>({reveal})</Text>
            <Button
              title       = "+"
              onPress     = {() => incReveal(1)}
              buttonStyle = {styles.mutedButton}
              titleStyle  = {styles.hintsHeaderText}
              type = "outline"
            />
          </View>
        )
    }
    <Icon
      name        = {showHints ? 'visibility' : 'visibility-off'}
      iconStyle   = {styles.showHintsBtn}
      onPress     = {() => { toggleHints() }}
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
    fontSize:           20,
  },
  mutedButton: {
    backgroundColor:    'transparent',
    paddingHorizontal:  10,
  },
  showHintsBtn: {
    fontSize:           30,
    marginHorizontal:  4,
  },
})
