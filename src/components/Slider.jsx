import React from 'react';
import { View, StyleSheet, PanResponder, Platform } from 'react-native';

export default function Slider({ value, onValueChange, minimumValue = 1, maximumValue = 10, step = 1 }) {
  const [sliderValue, setSliderValue] = React.useState(value);
  const [trackWidth, setTrackWidth] = React.useState(0);
  const [isDraggingWeb, setIsDraggingWeb] = React.useState(false);

  React.useEffect(() => {
    setSliderValue(value);
  }, [value]);

  const updateValueFromX = (x, widthOverride) => {
    if (!Number.isFinite(x)) return;
    const width = Number.isFinite(widthOverride) ? widthOverride : trackWidth;
    if (width <= 0) return;

    const percentage = Math.max(0, Math.min(1, x / width));
    const rawValue = minimumValue + percentage * (maximumValue - minimumValue);
    const steppedValue = Math.round(rawValue / step) * step;
    const clampedValue = Math.max(minimumValue, Math.min(maximumValue, steppedValue));

    setSliderValue(clampedValue);
    onValueChange(clampedValue);
  };

  const updateValueFromEvent = (evt) => {
    const nativeEvent = evt?.nativeEvent;
    let x = nativeEvent?.locationX ?? nativeEvent?.offsetX;

    // RN Web pointer events are more reliable with clientX + DOM rect.
    const clientX = nativeEvent?.clientX;
    const target = nativeEvent?.target ?? nativeEvent?.currentTarget ?? evt?.currentTarget;
    if (Number.isFinite(clientX) && target?.getBoundingClientRect) {
      const rect = target.getBoundingClientRect();
      x = clientX - rect.left;
      const w = rect?.width;
      updateValueFromX(x, w);
      return;
    }

    updateValueFromX(x);
  };

  const panResponder = React.useRef(
    PanResponder.create({
      // On native we keep PanResponder for dragging.
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => updateValueFromEvent(evt),
      onPanResponderMove: (evt) => updateValueFromEvent(evt),
      onPanResponderRelease: () => {},
    })
  ).current;

  const percentage = ((sliderValue - minimumValue) / (maximumValue - minimumValue)) * 100;

  return (
    <View style={styles.container}>
      <View
        style={styles.track}
        onLayout={(e) => {
          const w = e?.nativeEvent?.layout?.width;
          if (Number.isFinite(w)) setTrackWidth(w);
        }}
        {...(!isDraggingWeb && Platform.OS !== 'web' ? panResponder.panHandlers : {})}
        // Web: use pointer events to avoid interfering with ScrollView gestures.
        {...(Platform.OS === 'web'
          ? {
              onPointerDown: (evt) => {
                setIsDraggingWeb(true);
                updateValueFromEvent(evt);
              },
              onPointerMove: (evt) => {
                if (!isDraggingWeb) return;
                updateValueFromEvent(evt);
              },
              onPointerUp: () => setIsDraggingWeb(false),
              onPointerCancel: () => setIsDraggingWeb(false),
            }
          : {})}
      >
        <View style={[styles.fill, { width: `${percentage}%` }]} />
        <View
          style={[
            styles.thumb,
            { left: `${percentage}%` },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
  },
  track: {
    height: 4,
    backgroundColor: '#101A2E',
    borderRadius: 2,
    position: 'relative',
    width: '100%',
    borderWidth: 1,
    borderColor: '#2A3547',
    shadowColor: '#5B8DFF',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 1,
  },
  fill: {
    height: '100%',
    backgroundColor: '#5B8DFF',
    borderRadius: 2,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#5B8DFF',
    position: 'absolute',
    top: -10,
    marginLeft: -12,
    borderWidth: 3,
    borderColor: '#0E1625',
    shadowColor: '#5B8DFF',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
});
