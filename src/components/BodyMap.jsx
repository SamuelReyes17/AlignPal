import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BODY_PARTS = [
  { id: 'neck', label: 'Neck (Cervical)', icon: 'medical-outline', position: { top: '5%', left: '50%' } },
  { id: 'shoulders', label: 'Shoulders', icon: 'body-outline', position: { top: '12%', left: '50%' } },
  { id: 'upper back', label: 'Upper Back', icon: 'chevron-up-circle-outline', position: { top: '20%', left: '50%' } },
  { id: 'lower back', label: 'Lower Back', icon: 'chevron-down-circle-outline', position: { top: '35%', left: '50%' } },
  { id: 'hips', label: 'Hips / Pelvis', icon: 'git-merge-outline', position: { top: '50%', left: '50%' } },
  { id: 'knees', label: 'Knees', icon: 'walk-outline', position: { top: '70%', left: '50%' } },
];

export default function BodyMap({ selectedParts = [], onSelect }) {
  const togglePart = (partId) => {
    if (selectedParts.includes(partId)) {
      onSelect(selectedParts.filter((id) => id !== partId));
    } else {
      onSelect([...selectedParts, partId]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.selectionGrid}>
        {BODY_PARTS.map((part) => {
          const isSelected = selectedParts.includes(part.id);
          return (
            <TouchableOpacity
              key={part.id}
              style={[styles.selectionCard, isSelected && styles.selectionCardSelected]}
              onPress={() => togglePart(part.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.selectionIconContainer, isSelected && styles.selectionIconContainerSelected]}>
                <Ionicons
                  name={part.icon}
                  size={16}
                  color={isSelected ? '#5B8DFF' : '#7F8FA9'}
                />
              </View>
              <Text style={[styles.selectionText, isSelected && styles.selectionTextSelected]}>
                {part.label}
              </Text>
              <Ionicons
                name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                size={18}
                color={isSelected ? '#5B8DFF' : '#4B5B78'}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
    width: '100%',
    flex: 1,
    justifyContent: 'center',
  },
  selectionGrid: {
    width: '100%',
    alignSelf: 'center',
    maxWidth: 560,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  selectionCard: {
    width: '46%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 14,
    backgroundColor: '#1F2A3D',
    borderWidth: 1,
    borderColor: '#2A3547',
    marginHorizontal: 4,
    marginBottom: 10,
    // Soft “aesthetic” depth on RN Web.
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  selectionCardSelected: {
    backgroundColor: '#1F3A5F',
    borderColor: '#5B8DFF',
  },
  selectionIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0E1625',
    borderWidth: 1,
    borderColor: '#2A3547',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  selectionIconContainerSelected: {
    borderColor: '#5B8DFF',
    backgroundColor: '#1A2D4A',
  },
  selectionText: {
    flex: 1,
    fontSize: 13,
    color: '#7F8FA9',
    fontWeight: '600',
    marginLeft: 10,
  },
  selectionTextSelected: {
    color: '#FFFFFF',
  },
});
