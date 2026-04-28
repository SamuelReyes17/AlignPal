import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/brand';

export function StepHeader({ step, total, onBack }) {
  return (
    <View style={s.wrap}>
      {/* Back button */}
      <TouchableOpacity style={s.back} onPress={onBack} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
        <Ionicons name="chevron-back" size={20} color={Colors.purplePale} />
      </TouchableOpacity>

      {/* Progress pill track */}
      <View style={s.track}>
        <View style={[s.fill, { width: `${(step / total) * 100}%` }]} />
      </View>

      {/* Step label */}
      <View style={s.labelWrap}>
        <Text style={s.labelText}>{step}<Text style={s.labelOf}>/{total}</Text></Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 14,
  },
  back: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.purple,
    borderRadius: 4,
  },
  labelWrap: {
    minWidth: 30,
    alignItems: 'flex-end',
  },
  labelText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.purple,
  },
  labelOf: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textMuted,
  },
});
