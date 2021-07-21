import React, { useEffect, useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { FONT_FAMILY, FONT_SIZES } from '../styles'

export interface ProgressLabel {
  label: string
  color: string
}

export interface BarProgressQuarantine {
  // progresses
  progresses: number[]
  progressLabel: ProgressLabel[]
  progressHeight?: number
  progressRadius?: number
  progressBackgroundColor?: string
  // grid
  showGrid?: boolean
  gridLabel?: string[]
  marginTop?: number
  marginBottom?: number
  marginLeft?: number
  marginRight?: number
}

export const BarProgressQuarantine: React.FC<BarProgressQuarantine> = (
  props,
) => {
  const [progressHeight, setProgressHeight] = useState<number>(12)
  const [progressRadius, setProgressRadius] = useState<number>(6)
  const [progresses, setProgresses] = useState<number[]>([])
  const [progressLabel, setProgressLabel] = useState<ProgressLabel[]>([])
  const [gridLabel, setGridLabel] = useState<string[]>([])
  const containerStyle = useMemo(() => {
    return StyleSheet.flatten([
      styles.container,
      {
        marginTop: props.marginTop,
        marginBottom: props.marginBottom,
        marginLeft: props.marginLeft,
        marginRight: props.marginRight,
      },
    ])
  }, [props.marginBottom, props.marginLeft, props.marginRight, props.marginTop])

  const barContainerStyle = useMemo(() => {
    return StyleSheet.flatten([styles.barContainer, { height: progressHeight }])
  }, [progressHeight])
  const barContainerOverflowStyle = useMemo(() => {
    return StyleSheet.flatten([
      styles.barContainerOverflow,
      {
        height: progressHeight,
        backgroundColor: props.progressBackgroundColor || '#E1E1E1',
        borderRadius: progressRadius,
      },
    ])
  }, [progressHeight, progressRadius, props.progressBackgroundColor])
  const barOverflowStyle = useMemo(() => {
    return StyleSheet.flatten([
      styles.barOverflow,
      { borderRadius: progressRadius },
    ])
  }, [progressRadius])

  useEffect(() => {
    setProgressHeight(props.progressHeight || 12)
    setProgressRadius(props.progressRadius || 12)
    setProgresses(props.progresses || [])
    setGridLabel(props.gridLabel || [])
    setProgressLabel(props.progressLabel || [])
  }, [
    props.progressHeight,
    props.progressRadius,
    props.progresses,
    props.gridLabel,
    props.progressLabel,
  ])

  return (
    <View style={containerStyle}>
      {props.showGrid && (
        <View style={styles.grid}>
          {gridLabel.map((label, i) => {
            const last = i === gridLabel.length - 1
            const gridLabelStyle = StyleSheet.flatten([
              { borderRightColor: 'rgba(0, 0, 0, 0.4)' },
              { width: `${100 / gridLabel.length}%` },
              { paddingBottom: progressHeight + 10 },
              { borderRightWidth: last ? 0 : 1 },
            ])
            return (
              <View style={gridLabelStyle}>
                <Text style={styles.gridLabel}>{label}</Text>
              </View>
            )
          })}
        </View>
      )}
      <View style={barContainerStyle}>
        <View style={barContainerOverflowStyle}>
          <View style={barOverflowStyle}>
            {progressLabel.map((label, i) => {
              const size = progresses[i] || 0
              return (
                <View
                  style={{
                    width: `${size}%`,
                    height: progressHeight,
                    backgroundColor: label.color,
                  }}
                />
              )
            })}
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    display: 'flex',
  },
  grid: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    zIndex: 1,
    flex: 1,
    flexDirection: 'row',
  },
  gridLabel: {
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZES[400],
    textAlign: 'center',
    fontWeight: '400',
    marginTop: -5,
  },
  barContainer: {
    position: 'relative',
    width: '100%',
  },
  barContainerOverflow: {
    position: 'absolute',
    width: '100%',
  },
  barOverflow: {
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
  },
  barProgress: {
    display: 'flex',
    flexDirection: 'row',
    flexShrink: 0,
    flexGrow: 0,
  },
})
