import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { COLORS, FONT_FAMILY, FONT_SIZES } from '../../../styles'

export const LocationCount = (props) => {
  const [locationName, setLocationName] = useState(props.name)
  const [iconName, setIconName] = useState("")

  useEffect(() => {
    if (props.name === "home") {
      setIconName("home");
      setLocationName("ที่พัก");
    } else {
      setIconName("building");
      setLocationName("ที่ทำงาน");
    }
  }, [props.name]);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {iconName === 'building' && (<Text style={styles.textLabel}>{locationName}</Text>)}
      <View>
        <Icon name={iconName} size={25} color={COLORS.GRAY_2} />
        <View style={styles.badge}>
          <Text style={styles.textBadge}>{props.size}</Text>
        </View>
      </View>
      {iconName === 'home' && (<Text style={styles.textLabel}>{locationName}</Text>)}
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    minWidth: 20,
    height: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.DANGER
  },
  textBadge: {
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZES[400],
  },
  textLabel: {
    margin: 8,
    color: COLORS.GRAY_2,
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZES[500],
  }
})
