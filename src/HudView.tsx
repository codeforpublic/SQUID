import React, { Component, useState, useMemo, useContext } from 'react'
import { ActivityIndicator, View, Animated, Easing, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { Icon } from 'react-native-elements'

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  hudContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})

class HudView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fadeDuration: props.fadeDuration,
      isVisible: false,
      isRotating: false,
      icon: null,
      fadeAnim: new Animated.Value(0),
      rotationAnim: new Animated.Value(0),
    }
  }

  componentDidMount() {
    const { isVisible, type } = this.props
    if (isVisible) {
      this.show(type)
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if ((nextProps.isVisible && !this.props.isVisible) || (nextProps.isVisible && nextProps.type !== this.props.type)) {
      this.show(nextProps.type)
    } else if (!nextProps.isVisible && this.props.isVisible) {
      this.hide()
    }
  }

  _hexToRgb(hex) {
    hex = hex.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return [r, g, b].join()
  }

  _fadeIn() {
    this.setState({ isVisible: true })
    Animated.timing(this.state.fadeAnim, {
      toValue: 1,
      duration: this.state.fadeDuration,
    }).start()
  }

  _fadeOut() {
    Animated.timing(this.state.fadeAnim, {
      toValue: 0,
      duration: this.state.fadeDuration,
    }).start(() => {
      this.setState({ isVisible: false })
    })
  }

  _initializeRotationAnimation(isRotating) {
    this.state.rotationAnim.setValue(0)
    if (!isRotating && !this.state.isVisible) {
      return
    }

    Animated.timing(this.state.rotationAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.linear,
    }).start(() => {
      this._initializeRotationAnimation()
    })
  }

  _getHudRgbaColor() {
    const opacity = this.props.hudOpacity
    const color = this.props.hudBackgroundColor
    const rgbColor = this._hexToRgb(color)
    return `rgba(${rgbColor},${opacity})`
  }

  _getSetName() {
    return this.props.setName ? this.props.setName.toLowerCase() : 'fontawesome'
  }

  // _getIconComponent(setName) {
  //   switch (setName) {
  //     case "foundation":
  //       return Foundation;
  //     case "zocial":
  //       return Zocial;
  //     case "octicons":
  //       return Octicons;
  //     case "materialicons":
  //       return MaterialIcons;
  //     case "ionicons":
  //       return Ionicons;
  //     case "evilicons":
  //       return EvilIcons;
  //     case "entypo":
  //       return Entypo;
  //     default:
  //       return FontAwesome;
  //   }
  // }

  _getInterpolatedRotateAnimation() {
    return this.state.rotationAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    })
  }

  _getHudContainerStyles() {
    return [
      styles.hudContainer,
      {
        opacity: this.state.fadeAnim,
        width: this.props.hudWidth,
        height: this.props.hudHeight,
        borderRadius: this.props.hudBorderRadius,
        backgroundColor: this._getHudRgbaColor(),
      },
      this.props.hudAdditionalStyles,
    ]
  }

  _getContainerStyles() {
    return [
      this.props.style,
      {
        flex: 1,
      },
    ]
  }

  _getIconWrapperStyles() {
    return this.state.isRotating ? { transform: [{ rotate: this._getInterpolatedRotateAnimation() }] } : {}
  }

  _renderIcon() {
    return <Animated.View style={this._getIconWrapperStyles()}>{this.state.icon}</Animated.View>
  }

  _renderDefaultSpinnerComponent() {
    return <Icon name='circle-o-notch' type='fontawesome' size={this.props.iconSize} color={this.props.iconColor} />
  }

  _renderDefaultSuccessComponent() {
    return <Icon name='check' type='fontawesome' size={this.props.iconSize} color={this.props.iconColor} />
  }

  _renderDefaultErrorComponent() {
    return (
      <Icon name='exclamation-triangle' type='fontawesome' size={this.props.iconSize} color={this.props.iconColor} />
    )
  }

  _showHud(icon, rotate, hideOnCompletion) {
    this.setState({ isVisible: false, icon: icon, isRotating: rotate })
    this._initializeRotationAnimation(rotate)
    this._fadeIn()

    return new Promise((resolve, reject) => {
      if (hideOnCompletion) {
        setTimeout(() => {
          this.hide()
          setTimeout(() => {
            resolve()
          }, this.state.fadeDuration)
        }, this.state.fadeDuration)
      }
    })
  }

  _renderHud() {
    if (!this.state.isVisible) {
      return
    }

    return (
      <View style={styles.mainContainer}>
        <Animated.View style={this._getHudContainerStyles()}>{this._renderIcon()}</Animated.View>
      </View>
    )
  }

  hide() {
    this._fadeOut()
  }

  showSpinner() {
    const icon = this.props.spinnerComponent || this._renderDefaultSpinnerComponent()
    return this._showHud(icon, true)
  }

  showSuccess() {
    const icon = this.props.successComponent || this._renderDefaultSuccessComponent()
    return this._showHud(icon, false, true)
  }

  showError() {
    const icon = this.props.errorComponent || this._renderDefaultErrorComponent()
    return this._showHud(icon, false, true)
  }

  showCustomIcon(setName, iconName, rotate, hideOnCompletion) {
    const _component = this._getIconComponent(setName)
    const icon = <_component name={iconName} size={this.props.iconSize} color={this.props.iconColor} />
    return this._showHud(icon, rotate, hideOnCompletion)
  }

  showCustomComponent(component, rotate, hideOnCompletion) {
    return this._showHud(component, rotate, hideOnCompletion)
  }

  show(type) {
    switch (type || this.props.type) {
      case 'success':
        return this.showSuccess()
      case 'error':
        return this.showError()
      // case "customIcon":
      //   return this.showCustomIcon();
      case 'customComponent':
        return this.showCustomComponent()
      default:
        return this.showSpinner()
    }
  }

  render() {
    return (
      <View {...this.props} style={this._getContainerStyles()}>
        {this.props.children}
        {this._renderHud()}
      </View>
    )
  }
}

HudView.propTypes = {
  isVisible: PropTypes.bool,
  type: PropTypes.string,
  fadeDuration: PropTypes.number,
  hudBackgroundColor: PropTypes.string,
  hudOpacity: PropTypes.number,
  iconSize: PropTypes.number,
  hudWidth: PropTypes.number,
  hudHeight: PropTypes.number,
  hudBorderRadius: PropTypes.number,
  hudAdditionalStyles: PropTypes.object,
  iconColor: PropTypes.string,
  successComponent: PropTypes.object,
  errorComponent: PropTypes.object,
  spinnerComponent: PropTypes.object,
}

HudView.defaultProps = {
  isVisible: false,
  type: 'success',
  fadeDuration: 700,
  hudBackgroundColor: '#000000',
  hudOpacity: 0.8,
  iconSize: 42,
  hudWidth: 80,
  hudHeight: 80,
  hudBorderRadius: 5,
  hudAdditionalStyles: {},
  iconColor: '#FFFFFF',
}

export const HUDContext = React.createContext('HudContainer')

export const useHUD = () => {
  const hud = useContext(HUDContext)
  return useMemo(() => {
    if (!hud) {
      return {}
    }
    return {
      showSpinner: hud.showCustomComponent.bind(hud, <ActivityIndicator size='large' color='white' />),
      showSuccess: hud.showSuccess.bind(hud),
      hide: hud.hide.bind(hud),
      showError: hud.showError.bind(hud),
      showCustomIcon: hud.showCustomIcon.bind(hud),
      showCustomComponent: hud.showCustomComponent.bind(hud),
    }
  }, [hud])
}

export const HUDProvider = ({ children }) => {
  const [hudRef, setHUDRef] = useState(null)

  return (
    <HUDContext.Provider value={hudRef}>
      <HudView
        hudWidth={72}
        hudHeight={72}
        ref={(ref) => {
          setHUDRef(ref)
        }}
      >
        {children}
      </HudView>
    </HUDContext.Provider>
  )
}
