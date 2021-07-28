import React, { memo, useCallback, useRef, useState, useEffect } from 'react'
import { Dimensions, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'

const { width: windowWidth } = Dimensions.get('window')

const styles = StyleSheet.create({
  slide: {
    width: windowWidth,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  pagination: {
    position: 'absolute',
    top: 0,
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 99,
    marginHorizontal: 8,
  },
  paginationDotActive: { backgroundColor: '#10A7DC' },
  paginationDotInactive: { backgroundColor: '#C1C1C1' },

  carousel: { flex: 1, marginTop: 4 },
  carouselView: { flex: 1 },
})

const Slide = memo(({ children }: any) => {
  return <View style={styles.slide}>{children}</View>
})

function Pagination({
  index,
  data,
  setPageIndex,
}: {
  index: number
  data: unknown[]
  setPageIndex: (index: number) => void
}) {
  return (
    <View style={styles.pagination} pointerEvents='none'>
      {data.map((_, i) => {
        return (
          <TouchableOpacity onPress={() => setPageIndex(i)}>
            <View
              key={i}
              style={[styles.paginationDot, index === i ? styles.paginationDotActive : styles.paginationDotInactive]}
            />
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

type CarouselType<T> = {
  renderItem: (obj: T) => React.ReactElement
  data: T[]
  pageIndex: number
  setPageIndex: (index: number) => void
}

export default function Carousel<T>({ renderItem, data, pageIndex, setPageIndex }: CarouselType<T>) {
  const indexRef = useRef({ pageIndex, setPageIndex, scrolling: 0 })
  indexRef.current.setPageIndex = setPageIndex
  const listRef = useRef<FlatList>(null)

  const onScroll = useCallback((event) => {
    const slideSize = windowWidth //event.nativeEvent.layoutMeasurement.width
    const idx = event.nativeEvent.contentOffset.x / slideSize
    const roundIndex = Math.round(idx)

    const distance = Math.abs(roundIndex - idx)
    console.log('onScroll', idx, roundIndex, slideSize)

    // Prevent one pixel triggering setIndex in the middle
    // of the transition. With this we have to scroll a bit
    // more to trigger the index change.
    const isNoMansLand = distance > 0.4

    if (roundIndex !== indexRef.current.pageIndex && !isNoMansLand) {
      indexRef.current.pageIndex = roundIndex
      indexRef.current.setPageIndex(roundIndex)
    }
    if (indexRef.current.scrolling) clearTimeout(indexRef.current.scrolling)
    indexRef.current.scrolling = setTimeout(() => {
      indexRef.current.scrolling = 0
    }, 500)
  }, [])

  const render = useCallback(
    ({ item }) => {
      return <Slide key={item}>{renderItem(item)}</Slide>
    },
    [renderItem],
  )

  useEffect(() => {
    if (indexRef.current.scrolling) return
    listRef.current?.scrollToOffset({ offset: pageIndex * windowWidth })
  }, [pageIndex])

  return (
    <View style={styles.carouselView}>
      <Pagination index={pageIndex} data={data} setPageIndex={setPageIndex} />
      <FlatList
        ref={listRef}
        data={data}
        style={styles.carousel}
        renderItem={render}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={onScroll}
        initialNumToRender={0}
        maxToRenderPerBatch={1}
        removeClippedSubviews={true}
        scrollEventThrottle={16}
        windowSize={2}
        getItemLayout={useCallback(
          (_, index: number) => ({
            index,
            length: windowWidth,
            offset: index * windowWidth,
          }),
          [],
        )}
      />
    </View>
  )
}
