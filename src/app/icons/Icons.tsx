import React from 'react';
import { Text, TextStyle } from 'react-native';
import {
  Menu,
  X,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Calendar,
  Clock,
  Award,
  Globe,
} from 'react-native-feather';
import { colors } from '../theme/colors';
import { fontSize, fontWeight } from '../theme/typography';

interface IconProps {
  size?: number;
  color?: string;
  testID?: string;
}

export const HamburgerIcon = ({
  size = fontSize.xxl,
  color = colors.text.primary,
  testID = 'hamburger-icon',
}: IconProps) => <Menu size={size} color={color} testID={testID} />;

export const CloseIcon = ({
  size = fontSize.xl,
  color = colors.white,
  testID = 'close-icon',
}: IconProps) => <X size={size} color={color} testID={testID} />;

export const ArrowUpIcon = ({
  size = fontSize.sm,
  color = colors.text.secondary,
  testID = 'arrow-up-icon',
}: IconProps) => <ArrowUp size={size} color={color} testID={testID} />;

export const ArrowDownIcon = ({
  size = fontSize.sm,
  color = colors.text.secondary,
  testID = 'arrow-down-icon',
}: IconProps) => <ArrowDown size={size} color={color} testID={testID} />;

export const LiveIcon = ({
  size = fontSize.base,
  color = colors.semantic.live,
  testID = 'live-icon',
}: IconProps) => {
  const style: TextStyle = {
    fontSize: size,
    color,
  };
  return (
    <Text style={style} testID={testID}>
      🔴
    </Text>
  );
};

export const FootballIcon = ({
  size = fontSize.base,
  color = colors.text.primary,
  testID = 'football-icon',
}: IconProps) => {
  const style: TextStyle = {
    fontSize: size,
    color,
  };
  return (
    <Text style={style} testID={testID}>
      ⚽
    </Text>
  );
};

export const ChartIcon = ({
  size = fontSize.base,
  color = colors.text.primary,
  testID = 'chart-icon',
}: IconProps) => {
  const style: TextStyle = {
    fontSize: size,
    color,
  };
  return (
    <Text style={style} testID={testID}>
      📈
    </Text>
  );
};

export const CalendarIcon = ({
  size = fontSize.base,
  color = colors.text.primary,
  testID = 'calendar-icon',
}: IconProps) => <Calendar size={size} color={color} testID={testID} />;

export const TrophyIcon = ({
  size = fontSize.base,
  color = colors.brand.yellow,
  testID = 'trophy-icon',
}: IconProps) => <Award size={size} color={color} testID={testID} />;

export const BackArrowIcon = ({
  size = fontSize.lg,
  color = colors.text.primary,
  testID = 'back-arrow-icon',
}: IconProps) => <ArrowLeft size={size} color={color} testID={testID} />;

export const ChevronRightIcon = ({
  size = fontSize.sm,
  color = colors.text.primary,
  testID = 'chevron-right-icon',
}: IconProps) => <ChevronRight size={size} color={color} testID={testID} />;

export const ChevronLeftIcon = ({
  size = fontSize.sm,
  color = colors.text.primary,
  testID = 'chevron-left-icon',
}: IconProps) => <ChevronLeft size={size} color={color} testID={testID} />;

export const ChevronUpIcon = ({
  size = fontSize.sm,
  color = colors.text.primary,
  testID = 'chevron-up-icon',
}: IconProps) => <ChevronUp size={size} color={color} testID={testID} />;

export const ChevronDownIcon = ({
  size = fontSize.sm,
  color = colors.text.primary,
  testID = 'chevron-down-icon',
}: IconProps) => <ChevronDown size={size} color={color} testID={testID} />;

export const GlobeIcon = ({
  size = fontSize.base,
  color = colors.text.primary,
  testID = 'globe-icon',
}: IconProps) => <Globe size={size} color={color} testID={testID} />;

export const SearchIcon = ({
  size = fontSize.base,
  color = colors.text.secondary,
  testID = 'search-icon',
}: IconProps) => {
  const style: TextStyle = {
    fontSize: size,
    color,
  };
  return (
    <Text style={style} testID={testID}>
      🔍
    </Text>
  );
};

export const XIcon = ({
  size = fontSize.base,
  color = colors.text.primary,
  testID = 'x-icon',
}: IconProps) => {
  const style: TextStyle = {
    fontSize: size,
    color,
    fontWeight: fontWeight.bold,
  };
  return (
    <Text style={style} testID={testID}>
      𝕏
    </Text>
  );
};

export const TimerIcon = ({
  size = fontSize.base,
  color = colors.brand.yellow,
  testID = 'timer-icon',
}: IconProps) => <Clock size={size} color={color} testID={testID} />;

export const RefreshIcon = ({
  size = fontSize.base,
  color = colors.text.primary,
  testID = 'refresh-icon',
}: IconProps) => {
  const style: TextStyle = {
    fontSize: size,
    color,
  };
  return (
    <Text style={style} testID={testID}>
      🔄
    </Text>
  );
};

export const CorrectIcon = ({
  size = fontSize.base,
  color = colors.brand.success,
  testID = 'correct-icon',
}: IconProps) => {
  const style: TextStyle = {
    fontSize: size,
    color,
  };
  return (
    <Text style={style} testID={testID}>
      ✓
    </Text>
  );
};

export const IncorrectIcon = ({
  size = fontSize.base,
  color = colors.brand.danger,
  testID = 'incorrect-icon',
}: IconProps) => {
  const style: TextStyle = {
    fontSize: size,
    color,
  };
  return (
    <Text style={style} testID={testID}>
      ✗
    </Text>
  );
};

export const HintIcon = ({
  size = fontSize.base,
  color = colors.brand.yellow,
  testID = 'hint-icon',
}: IconProps) => {
  const style: TextStyle = {
    fontSize: size,
    color,
  };
  return (
    <Text style={style} testID={testID}>
      💡
    </Text>
  );
};

export const PlayerIcon = ({
  size = fontSize.base,
  color = colors.text.primary,
  testID = 'player-icon',
}: IconProps) => {
  const style: TextStyle = {
    fontSize: size,
    color,
  };
  return (
    <Text style={style} testID={testID}>
      👟
    </Text>
  );
};

export const StadiumIcon = ({
  size = fontSize.base,
  color = colors.text.primary,
  testID = 'stadium-icon',
}: IconProps) => {
  const style: TextStyle = {
    fontSize: size,
    color,
  };
  return (
    <Text style={style} testID={testID}>
      🏟️
    </Text>
  );
};

export const LocationPinIcon = ({
  size = fontSize.base,
  color = colors.text.secondary,
  testID = 'location-pin-icon',
}: IconProps) => {
  const style: TextStyle = {
    fontSize: size,
    color,
  };
  return (
    <Text style={style} testID={testID}>
      📍
    </Text>
  );
};

export const MinusIcon = ({
  size = fontSize.base,
  color = colors.text.darker,
  testID = 'minus-icon',
}: IconProps) => {
  const style: TextStyle = {
    fontSize: size,
    color,
    fontWeight: fontWeight.bold,
  };
  return (
    <Text style={style} testID={testID}>
      —
    </Text>
  );
};

export const CelebrationIcon = ({
  size = fontSize.base,
  color = colors.brand.yellow,
  testID = 'celebration-icon',
}: IconProps) => {
  const style: TextStyle = {
    fontSize: size,
    color,
  };
  return (
    <Text style={style} testID={testID}>
      🎉
    </Text>
  );
};

export const SparkleIcon = ({
  size = fontSize.base,
  color = colors.brand.yellow,
  testID = 'sparkle-icon',
}: IconProps) => {
  const style: TextStyle = {
    fontSize: size,
    color,
  };
  return (
    <Text style={style} testID={testID}>
      ✨
    </Text>
  );
};

export const TableIcon = ({
  size = fontSize.base,
  color = colors.text.primary,
  testID = 'table-icon',
}: IconProps) => {
  const style: TextStyle = {
    fontSize: size,
    color,
  };
  return (
    <Text style={style} testID={testID}>
      📊
    </Text>
  );
};

export const RankingIcon = ({
  size = fontSize.base,
  color = colors.brand.yellow,
  testID = 'ranking-icon',
}: IconProps) => {
  const style: TextStyle = {
    fontSize: size,
    color,
  };
  return (
    <Text style={style} testID={testID}>
      🏅
    </Text>
  );
};

export const ListIcon = ({
  size = fontSize.base,
  color = colors.text.primary,
  testID = 'list-icon',
}: IconProps) => {
  const style: TextStyle = {
    fontSize: size,
    color,
  };
  return (
    <Text style={style} testID={testID}>
      📋
    </Text>
  );
};

export const ShieldIcon = ({
  size = fontSize.base,
  color = colors.text.secondary,
  testID = 'shield-icon',
}: IconProps) => {
  const style: TextStyle = {
    fontSize: size,
    color,
  };
  return (
    <Text style={style} testID={testID}>
      🛡️
    </Text>
  );
};

export const TransferArrowIcon = ({
  size = fontSize.base,
  color = colors.brand.orange,
  testID = 'transfer-arrow-icon',
}: IconProps) => {
  const style: TextStyle = {
    fontSize: size,
    color,
    fontWeight: fontWeight.bold,
  };
  return (
    <Text style={style} testID={testID}>
      ➜
    </Text>
  );
};

export const InjuredIcon = ({
  size = fontSize.base,
  color = colors.brand.red,
  testID = 'injured-icon',
}: IconProps) => {
  const style: TextStyle = {
    fontSize: size,
    color,
  };
  return (
    <Text style={style} testID={testID}>
      🏥
    </Text>
  );
};

export const PersonIcon = ({
  size = fontSize.base,
  color = colors.text.primary,
  testID = 'person-icon',
}: IconProps) => {
  const style: TextStyle = {
    fontSize: size,
    color,
  };
  return (
    <Text style={style} testID={testID}>
      👤
    </Text>
  );
};

export const YellowCardIcon = ({
  size = fontSize.base,
  color = colors.text.primary,
  testID = 'yellow-card-icon',
}: IconProps) => (
  <Text style={{ fontSize: size, color }} testID={testID}>🟨</Text>
);

export const RedCardIcon = ({
  size = fontSize.base,
  color = colors.text.primary,
  testID = 'red-card-icon',
}: IconProps) => (
  <Text style={{ fontSize: size, color }} testID={testID}>🟥</Text>
);

export const VideoIcon = ({
  size = fontSize.base,
  color = colors.text.primary,
  testID = 'video-icon',
}: IconProps) => (
  <Text style={{ fontSize: size, color }} testID={testID}>🎬</Text>
);

export const FireIcon = ({
  size = fontSize.base,
  color = colors.brand.red,
  testID = 'fire-icon',
}: IconProps) => (
  <Text style={{ fontSize: size, color }} testID={testID}>🔥</Text>
);

export const SnowflakeIcon = ({
  size = fontSize.base,
  color = colors.brand.bluelight,
  testID = 'snowflake-icon',
}: IconProps) => (
  <Text style={{ fontSize: size, color }} testID={testID}>❄️</Text>
);

export const SubstitutionIcon = ({
  size = fontSize.base,
  color = colors.brand.success,
  testID = 'substitution-icon',
}: IconProps) => (
  <Text style={{ fontSize: size, color }} testID={testID}>↕</Text>
);

const Icons = {
  HamburgerIcon,
  CloseIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  LiveIcon,
  FootballIcon,
  ChartIcon,
  CalendarIcon,
  TrophyIcon,
  BackArrowIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  GlobeIcon,
  SearchIcon,
  XIcon,
  TimerIcon,
  RefreshIcon,
  CorrectIcon,
  IncorrectIcon,
  HintIcon,
  PlayerIcon,
  StadiumIcon,
  LocationPinIcon,
  MinusIcon,
  CelebrationIcon,
  SparkleIcon,
  TableIcon,
  RankingIcon,
  ListIcon,
  ShieldIcon,
  TransferArrowIcon,
  InjuredIcon,
  PersonIcon,
  YellowCardIcon,
  RedCardIcon,
  VideoIcon,
  SubstitutionIcon,
  FireIcon,
  SnowflakeIcon,
};

export default Icons;
