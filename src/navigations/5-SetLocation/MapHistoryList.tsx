import React, { useState, useEffect } from 'react';
import { View, Dimensions, Text, StyleSheet, TouchableOpacity } from "react-native";
import Carousel from 'react-native-snap-carousel';

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = 80;

const MapHistoryList = (props) => {
  const [items, setItems] = useState(props.items);

  useEffect(() => {
    setItems(props.items);
  }, [props.items]);

  const onPressButton = (item) => () => {
    if (props.onSelectHistoryItem) {
      props.onSelectHistoryItem(item);
    }
  }

  const _renderButtonItem = ({ item }) => {
    return (
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onPressButton(item)}>
          <View style={styles.buttonItem}>
            <Text style={styles.buttonItemText}>{`${item.no}`}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Carousel
      data={items}
      renderItem={_renderButtonItem}
      sliderWidth={SLIDER_WIDTH}
      itemWidth={ITEM_WIDTH}
      inactiveSlideScale={1}
      activeSlideAlignment={'start'}
      inactiveSlideShift={0}
      swipeThreshold={0}
      removeClippedSubviews={false}
    />
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonItem: {
    margin: 10,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 40,
    width: ITEM_WIDTH - 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  buttonItemText: {
    color: '#000000',
    textAlign: 'center',
  }
})

export default MapHistoryList
