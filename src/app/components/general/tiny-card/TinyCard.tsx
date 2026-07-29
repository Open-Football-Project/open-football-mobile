import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius, breakpoints } from '../../../theme';

interface Section {
  label?: string;
  component: React.ReactNode;
}

interface TinyCardProps {
  title?: string;
  cardId?: string;
  sections: Section[];
}

const TinyCard = ({ title, sections, cardId }: TinyCardProps) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= breakpoints.tablet;
  return (
    <View
      testID={cardId || 'tiny-card'}
      style={[styles.container, { maxWidth: isTablet ? 480 : 320 }]}
    >
      {title && (
        <Text
          style={styles.title}
          numberOfLines={1}
          testID="tiny-card-title"
        >
          {title}
        </Text>
      )}
      <View
        style={[styles.sectionsContainer, isTablet && styles.sectionsContainerRow]}
      >
        {sections.map((section, idx) => (
          <View key={idx} style={[styles.section, isTablet && styles.sectionRow]}>
            {section.label && (
              <Text
                style={styles.label}
                testID={`section-label-${idx}`}
              >
                {section.label}
              </Text>
            )}
            <View style={styles.componentWrapper} testID={`section-component-${idx}`}>
              {section.component}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    width: '100%',
    alignSelf: 'center',
    borderRadius: borderRadius.lg,
  },
  title: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.brand.yellow,
    marginBottom: spacing.md,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  sectionsContainer: {
    flexDirection: 'column',
    gap: spacing.md,
    width: '100%',
    alignItems: 'center',
  },
  sectionsContainerRow: {
    flexDirection: 'row',
  },
  section: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
  },
  sectionRow: {
    width: undefined,
    flex: 1,
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  componentWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TinyCard;
