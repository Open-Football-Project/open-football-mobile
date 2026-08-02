import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BracketNode, LEAGUE_CUP_ROUNDS } from 'open-football-project-core';
import NoData from '../../../general/no-data/NoData';
import TieCard from '../tie-card/TieCard';
import TiePrediction from '../tie-prediction/TiePrediction';
import { colors, spacing, fontSize, fontWeight, borderRadius, borders } from '../../../../theme';

interface KnockoutBracketTreeProps {
  root: BracketNode | null;
}

type Predictions = Map<BracketNode, string | null>;

const collectNodesByRound = (root: BracketNode): Map<string, BracketNode[]> => {
  const columns = new Map<string, BracketNode[]>();
  const queue: BracketNode[] = [root];

  while (queue.length > 0) {
    const node = queue.shift()!;
    const column = columns.get(node.roundKey) ?? [];
    column.push(node);
    columns.set(node.roundKey, column);

    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }

  return columns;
};

const resolvedWinnerName = (node: BracketNode | undefined, predictions: Predictions): string | null => {
  if (!node?.tie) return null;

  const { t1, t2, aggregate } = node.tie;
  if (aggregate) {
    if (aggregate.t1Score > aggregate.t2Score) return t1;
    if (aggregate.t2Score > aggregate.t1Score) return t2;
    return null;
  }

  return predictions.get(node) ?? null;
};

const KnockoutBracketTree = ({ root }: KnockoutBracketTreeProps) => {
  const { t } = useTranslation();
  const [predictions, setPredictions] = useState<Predictions>(new Map());

  if (!root) return <NoData />;

  const columns = collectNodesByRound(root);
  const roundKeys = [...columns.keys()].sort(
    (a, b) => LEAGUE_CUP_ROUNDS.indexOf(a) - LEAGUE_CUP_ROUNDS.indexOf(b),
  );
  const pendingLabel = t('knockout.pending', { defaultValue: 'TBD' });

  const predictTie = (node: BracketNode) => (winner: string | null) =>
    setPredictions((prev) => new Map(prev).set(node, winner));

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} testID="bracket-scroll">
      <View style={styles.row}>
        {roundKeys.map((roundKey) => (
          <View key={roundKey} testID={`bracket-column-${roundKey}`} style={styles.column}>
            <Text style={styles.columnTitle} accessibilityRole="header">
              {t(`fixtures.${roundKey}`, { defaultValue: roundKey })}
            </Text>

            {columns.get(roundKey)!.map((node, index) => {
              const key = `${roundKey}-${index}`;

              if (!node.tie) {
                return (
                  <View key={key} testID="bracket-tie-pending" style={styles.pending}>
                    <Text style={styles.pendingText} testID="bracket-tie-pending-left">
                      {resolvedWinnerName(node.left, predictions) ?? pendingLabel}
                    </Text>
                    <Text style={styles.pendingText} testID="bracket-tie-pending-right">
                      {resolvedWinnerName(node.right, predictions) ?? pendingLabel}
                    </Text>
                  </View>
                );
              }

              return node.tie.aggregate ? (
                <TieCard key={key} tie={node.tie} />
              ) : (
                <TiePrediction
                  key={key}
                  t1={node.tie.t1}
                  t1logo={node.tie.t1logo}
                  t2={node.tie.t2}
                  t2logo={node.tie.t2logo}
                  onPredict={predictTie(node)}
                />
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.lg,
    paddingHorizontal: spacing.sm,
  } as ViewStyle,
  column: {
    flexDirection: 'column',
    gap: spacing.md,
    minWidth: 220,
  } as ViewStyle,
  columnTitle: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.brand.yellow,
  } as TextStyle,
  pending: {
    minHeight: 80,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: borderRadius.lg,
    borderWidth: borders.thin,
    borderStyle: 'dashed',
    borderColor: colors.text.secondary,
    backgroundColor: colors.background.dark,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  } as ViewStyle,
  pendingText: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    textAlign: 'center',
  } as TextStyle,
});

export default KnockoutBracketTree;
