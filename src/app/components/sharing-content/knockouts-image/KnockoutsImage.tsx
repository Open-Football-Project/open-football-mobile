import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import RNShare from 'react-native-share';
import ViewShot from 'react-native-view-shot';
import { SvgXml } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { LeagueFixture, useLeagueFixtureBinaryTree } from 'open-football-project-core';
import { useLeagueKnockoutsSvg, SVG_W } from './image-hooker/knockouts-image-hooker';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../../theme';
import NoData from '../../general/no-data/NoData';

interface KnockoutBracketImageProps {
  fixtures: LeagueFixture;
  leagueName: string;
}

const KnockoutBracketImage = ({ fixtures, leagueName }: KnockoutBracketImageProps) => {
  const { t } = useTranslation();
  const root = useLeagueFixtureBinaryTree(fixtures);
  const { svgString, svgH } = useLeagueKnockoutsSvg(root, leagueName);
  const viewShotRef = useRef<ViewShot>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!svgString || downloading) return;
    setDownloading(true);
    try {
      const uri = await viewShotRef.current!.capture!();
      await RNShare.open({
        url: uri,
        type: 'image/png',
        title: `${leagueName} ${t('knockout.brackets', { defaultValue: 'Matchups' })}`,
        failOnCancel: false,
      });
    } catch {
      console.info('Knockout stage image download cancelled or failed');
    } finally {
      setDownloading(false);
    }
  }, [svgString, downloading, leagueName, t]);

  if (!svgString) return <NoData />;

  return (
    <View testID="knockout-bracket-image">
      <View style={styles.toolbar}>
        <Pressable
          style={[styles.downloadButton, downloading && styles.downloadButtonDisabled]}
          onPress={handleDownload}
          disabled={downloading}
          testID="bracket-download-button"
        >
          <Text style={styles.downloadButtonText}>
            {downloading
              ? t('knockout.downloading', { defaultValue: '…' })
              : t('knockout.download', { defaultValue: 'Download PNG' })}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ViewShot
          ref={viewShotRef}
          options={{ format: 'png', quality: 1 }}
        >
          <SvgXml xml={svgString} width={SVG_W} height={svgH} />
        </ViewShot>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  downloadButton: {
    backgroundColor: colors.brand.yellow,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  downloadButtonDisabled: {
    opacity: 0.5,
  },
  downloadButtonText: {
    color: colors.background.dark,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  scrollContent: {
    paddingBottom: spacing.sm,
  },
});

export default KnockoutBracketImage;
