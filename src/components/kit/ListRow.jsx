import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { KitColors, KitAccents, KitRadius } from '../../constants/brand';

/**
 * Kit ListCard + ListRow
 *
 * Single surface card with hairline-divided rows. No nesting, no inner bubbles.
 *
 * <ListCard>
 *   <ListRow icon="⌬" iconColor="violet" title="…" sub="…" trailing="…" onPress={…} />
 * </ListCard>
 */

export function ListCard({ children, style }) {
  const arr = React.Children.toArray(children);
  const decorated = arr.map((child, i) =>
    React.isValidElement(child)
      ? React.cloneElement(child, { isLast: i === arr.length - 1 })
      : child
  );
  return <View style={[styles.card, style]}>{decorated}</View>;
}

export function ListRow({
  icon,
  iconColor = 'violet',
  title,
  sub,
  trailing,
  onPress,
  isLast,
}) {
  const bg = KitAccents[iconColor] || KitAccents.violet;
  const isLight = iconColor === 'avocado';
  const iconFg = isLight ? '#1A2410' : '#FFFFFF';

  const Inner = (
    <View style={[styles.row, !isLast && styles.rowDivider]}>
      <View style={[styles.icon, { backgroundColor: bg }]}>
        <Text style={[styles.iconText, { color: iconFg }]}>{icon}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {!!sub && <Text style={styles.sub} numberOfLines={1}>{sub}</Text>}
      </View>
      {!!trailing && <Text style={styles.trail}>{trailing}</Text>}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {Inner}
      </TouchableOpacity>
    );
  }
  return Inner;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: KitColors.surface1,
    borderColor: KitColors.hairline,
    borderWidth: 1,
    borderRadius: KitRadius.lg,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 18, paddingVertical: 16, gap: 14,
  },
  rowDivider: { borderBottomColor: KitColors.hairline, borderBottomWidth: 1 },
  icon: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  iconText: { fontSize: 16, fontWeight: '700' },
  body: { flex: 1, minWidth: 0 },
  title: { fontSize: 14, fontWeight: '600', color: KitColors.text1, marginBottom: 2 },
  sub:   { fontSize: 12, color: KitColors.text3 },
  trail: { color: KitColors.text3, fontSize: 13, fontWeight: '500' },
});
