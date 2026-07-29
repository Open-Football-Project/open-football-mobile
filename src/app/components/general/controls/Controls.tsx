import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  FlatList,
  Modal,
} from 'react-native';
import { getLocalISODate, DayTimeRange } from 'open-football-project-core';
import { useTranslation } from 'react-i18next';

import { colors, spacing, fontSize, fontWeight, borderRadius, borders } from '../../../theme';

interface SelectOption {
  id: string;
  value: string;
}

interface ControlsProps {
  useDrop0?: boolean;
  drop0Label?: string;
  isDrop0LabelRow?: boolean;
  selectedDrop0?: string;
  setDrop0?: (status: string) => void;
  drop0Options?: SelectOption[];

  useDrop1?: boolean;
  drop1Label?: string;
  isDrop1LabelRow?: boolean;
  selectedDrop1?: string;
  setDrop1?: (status: string) => void;
  drop1Options?: SelectOption[];

  useInputControl?: boolean;
  inputControlLabel?: string;
  useInputControlLabel?: boolean;
  inputControlLabelRow?: boolean;
  inputControlValue?: string;
  inputControlPlaceholder?: string;
  setInputControlValue?: (status: string) => void;

  useDatePicker?: boolean;
  datePickerLabel?: string;
  datePickerLabelRow?: boolean;
  selectedDate?: string;
  setSelectedDate?: (date: string) => void;

  useTimeRange?: boolean;
  timeRangeLabel?: string;
  timeRangeLabelRow?: boolean;
  selectedTimeRangeIndex?: number;
  setSelectedTimeRangeIndex?: (index: number) => void;
  timeRangeOptions?: DayTimeRange[];
}

const Controls = ({
  useDrop0 = false,
  drop0Label = 'Select Option',
  isDrop0LabelRow = false,
  selectedDrop0 = '',
  setDrop0 = () => {},
  drop0Options = [],
  useDrop1 = false,
  drop1Label = 'Select Option',
  isDrop1LabelRow = false,
  selectedDrop1 = '',
  setDrop1 = () => {},
  drop1Options = [],
  useInputControl = false,
  inputControlLabel = 'Input Control',
  inputControlLabelRow = false,
  inputControlValue = '',
  inputControlPlaceholder = 'Type here...',
  setInputControlValue = () => {},

  useDatePicker = false,
  datePickerLabel = 'Select Date',
  datePickerLabelRow = false,
  selectedDate = '',
  setSelectedDate = () => {},

  useTimeRange = false,
  timeRangeLabel = 'Select Time Range',
  timeRangeLabelRow = false,
  selectedTimeRangeIndex = 0,
  setSelectedTimeRangeIndex = () => {},
  timeRangeOptions,
}: ControlsProps) => {
  const { t } = useTranslation();
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [showDrop0Modal, setShowDrop0Modal] = useState(false);
  const [showDrop1Modal, setShowDrop1Modal] = useState(false);
  const [showTimeRangeModal, setShowTimeRangeModal] = useState(false);
  const [tempDate, setTempDate] = useState(selectedDate);

  const openDatePickerModal = () => {
    setTempDate(selectedDate);
    setShowDatePickerModal(true);
  };

  const closeDatePickerModal = () => {
    setSelectedDate(tempDate || getLocalISODate());
    setShowDatePickerModal(false);
  };

  const renderLabel = (label: string, isRow: boolean) => (
    <Text
      testID="control-label"
      style={[
        styles.label,
        isRow ? styles.labelRowLayout : styles.labelColumnLayout,
      ]}
    >
      {label}
    </Text>
  );

  const renderControl = (
    label: string,
    isLabelRow: boolean,
    control: React.ReactNode
  ) => (
    <View
      style={[
        styles.controlContainer,
        isLabelRow ? styles.controlRowLayout : styles.controlColumnLayout,
      ]}
    >
      {renderLabel(label, isLabelRow)}
      {control}
    </View>
  );

  const renderDropdownModal = (
    visible: boolean,
    onClose: () => void,
    options: SelectOption[],
    selectedValue: string,
    onSelect: (value: string) => void
  ) => (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.dropdownModalContent}>
          <FlatList
            data={options}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  onSelect(item.id);
                  onClose();
                }}
                style={[
                  styles.dropdownOption,
                  selectedValue === item.id && styles.dropdownOptionSelected,
                ]}
              >
                <Text
                  style={[
                    styles.dropdownOptionText,
                    selectedValue === item.id &&
                      styles.dropdownOptionTextSelected,
                  ]}
                >
                  {item.value}
                </Text>
              </Pressable>
            )}
          />
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>{t('common.close')}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.contentContainer}>
      
      {useDatePicker &&
        renderControl(
          datePickerLabel,
          datePickerLabelRow,
          <View>
            <Pressable
              testID="date-picker"
              onPress={openDatePickerModal}
              style={styles.pickerButton}
            >
              <Text style={styles.pickerButtonText}>
                {selectedDate || getLocalISODate()}
              </Text>
            </Pressable>
            <Modal
              visible={showDatePickerModal}
              transparent
              animationType="fade"
            >
              <View style={styles.modalOverlay}>
                <View style={styles.dateModalContent}>
                  <Text style={styles.modalTitle}>{datePickerLabel}</Text>
                  <TextInput
                    style={styles.dateInput}
                    placeholder="YYYY-MM-DD"
                    value={tempDate}
                    onChangeText={setTempDate}
                    placeholderTextColor={colors.text.secondary}
                  />
                  <Pressable
                    onPress={closeDatePickerModal}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>{t('common.close')}</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </View>
        )}

      {useTimeRange &&
        renderControl(
          timeRangeLabel,
          timeRangeLabelRow,
          <View>
            <Pressable
              testID="time-range"
              onPress={() => setShowTimeRangeModal(true)}
              style={styles.pickerButton}
            >
              <Text style={styles.pickerButtonText}>
                {timeRangeOptions?.[selectedTimeRangeIndex]?.name ||
                  'Select Time Range'}
              </Text>
            </Pressable>
            {renderDropdownModal(
              showTimeRangeModal,
              () => setShowTimeRangeModal(false),
              timeRangeOptions?.map((opt, idx) => ({
                id: String(idx),
                value: opt.name,
              })) || [],
              String(selectedTimeRangeIndex),
              (value) => setSelectedTimeRangeIndex(parseInt(value, 10))
            )}
          </View>
        )}

      {useDrop0 &&
        renderControl(
          drop0Label,
          isDrop0LabelRow,
          <View>
            <Pressable
              testID="drop-0"
              onPress={() => setShowDrop0Modal(true)}
              style={styles.pickerButton}
            >
              <Text style={styles.pickerButtonText}>
                {drop0Options.find((opt) => opt.id === selectedDrop0)?.value ||
                  drop0Label}
              </Text>
            </Pressable>
            {renderDropdownModal(
              showDrop0Modal,
              () => setShowDrop0Modal(false),
              drop0Options,
              selectedDrop0,
              setDrop0
            )}
          </View>
        )}

      {useDrop1 &&
        renderControl(
          drop1Label,
          isDrop1LabelRow,
          <View>
            <Pressable
              testID="drop-1"
              onPress={() => setShowDrop1Modal(true)}
              style={styles.pickerButton}
            >
              <Text style={styles.pickerButtonText}>
                {drop1Options.find((opt) => opt.id === selectedDrop1)?.value ||
                  drop1Label}
              </Text>
            </Pressable>
            {renderDropdownModal(
              showDrop1Modal,
              () => setShowDrop1Modal(false),
              drop1Options,
              selectedDrop1,
              setDrop1
            )}
          </View>
        )}

      {useInputControl &&
        renderControl(
          inputControlLabel,
          inputControlLabelRow,
          <TextInput
            testID="input-control"
            placeholder={inputControlPlaceholder}
            value={inputControlValue}
            onChangeText={setInputControlValue}
            style={styles.textInput}
            placeholderTextColor={colors.text.secondary}
          />
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: spacing.md,
  },
  contentContainer: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.md,
  },
  controlContainer: {
    gap: spacing.xs,
    marginBottom: spacing.lg,
    width: '100%',
  },
  controlRowLayout: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlColumnLayout: {
    flexDirection: 'column',
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    color: colors.brand.cream,
  },
  labelRowLayout: {
    minWidth: 120,
    marginRight: spacing.sm,
  },
  labelColumnLayout: {
    marginBottom: spacing.sm,
  },
  pickerButton: {
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.secondary.border,
    backgroundColor: colors.background.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  pickerButtonText: {
    color: colors.text.primary,
    fontSize: fontSize.base,
  },
  textInput: {
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.secondary.border,
    backgroundColor: colors.background.card,
    color: colors.text.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.sm,
  },
  dateInput: {
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.secondary.border,
    backgroundColor: colors.background.card,
    color: colors.text.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.sm,
    marginBottom: spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.background.overlay,
    justifyContent: 'flex-end',
  },
  dropdownModalContent: {
    backgroundColor: colors.background.card,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    maxHeight: '80%',
    paddingBottom: spacing.lg,
  },
  dateModalContent: {
    backgroundColor: colors.background.card,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  dropdownOption: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: borders.thin,
    borderBottomColor: colors.secondary.border,
  },
  dropdownOptionSelected: {
    backgroundColor: colors.background.dark,
  },
  dropdownOptionText: {
    color: colors.text.primary,
    fontSize: fontSize.sm,
  },
  dropdownOptionTextSelected: {
    fontWeight: fontWeight.semibold,
    color: colors.brand.orange,
  },
  closeButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.brand.orange,
    borderRadius: borderRadius.sm,
    margin: spacing.lg,
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.text.primary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  modalTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
});

export default Controls;
