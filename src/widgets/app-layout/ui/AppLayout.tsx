import {
  Text,
  Box,
  useColorModeValue,
  useDisclosure,
  VStack,
  useChakra,
} from '@chakra-ui/react';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { UiDatebar } from '@/shared/ui/ui-datebar/UiDatebar';
import { DatebarContent } from '../datebar/DatebarContent';
import styles from './AppLayout.module.scss';
import { UiModal } from '@/shared/ui/ui-modal/UiModal';
import { AddGroupToFavourite } from '@/features';
import { SelectGroup } from '@/features';
import { useGroup, useSchedule } from '@/entities';
import { useScrollSpy } from '../lib/useScrollSpy';
import { parityTypes } from '@/shared/constants';
import { scrollToToday } from '@/shared/lib';

export type ContextType = [
  string,
  React.Dispatch<React.SetStateAction<string>>
];

export function AppLayout() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentDay, setCurrentDay] = useState<string>(
    DateTime.now().toFormat('yyyy-LL-dd')
  );
  const { currentGroup } = useGroup();
  const {
    schedule,
    parity,
    weekScheduleStatus,
    getSchedule,
    getFullWeekScheduleByName,
    getWeekParity,
  } = useSchedule();
  const swiperRef = useScrollSpy(schedule, setCurrentDay);
  const location = useLocation();
  useEffect(() => {
    getWeekParity();
    const weekAgo = DateTime.now()
      .startOf('week')
      .minus({ days: 7 })
      .toFormat('yyyy-LL-dd');
    const days_count = 21;

    if (currentGroup && weekScheduleStatus === 'idle') {
      getFullWeekScheduleByName(currentGroup.group_name).then(() => {
        getSchedule({
          date_from: weekAgo,
          days_count,
        }).then(() => {
          scrollToToday(false);
        });
      });
    }
  }, [
    currentGroup,
    weekScheduleStatus,
    getSchedule,
    getWeekParity,
    getFullWeekScheduleByName,
  ]);
  useEffect(() => {
    document.getElementById(currentDay)?.scrollIntoView();
  }, [location.pathname]);
  const { theme } = useChakra();
  const mainTextColor = useColorModeValue('light.main_text', 'dark.main_text');
  const mainColor = useColorModeValue(
    theme.colors.light.main,
    theme.colors.dark.main
  );
  const themeColor = useColorModeValue('#858585', '#0E1117');
  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      if (isOpen) {
        metaThemeColor.setAttribute('content', themeColor);
      } else {
        metaThemeColor.setAttribute('content', mainColor);
      }
      console.log(metaThemeColor.getAttribute('content'));
    }
  }, [themeColor, mainColor, isOpen]);
  const isNotDatebar =
    location.pathname.includes('teachers') ||
    location.pathname.includes('schedule/full') ||
    location.pathname.includes('schedule/exams');
  return (
    <div className={styles['app-layout']}>
      <Box className={styles['app-layout__header']} bgColor={mainColor}>
        <VStack
          alignItems={'flex-start'}
          fontWeight={'medium'}
          color={mainTextColor}
          gap={0.4}
          onClick={() => scrollToToday(true)}
        >
          <Text fontSize={22}>
            {DateTime.now().setLocale('ru').toFormat('d MMMM')}
          </Text>
          <Text>{parity && parityTypes[parity?.parity]}</Text>
        </VStack>
        <SelectGroup onOpen={onOpen} />
      </Box>
      <UiDatebar
        isNotDatebar={isNotDatebar}
        datebarContent={DatebarContent({
          currentDay,
          setCurrentDay,
          swiperRef,
        })}
      />
      <Outlet context={[currentDay, setCurrentDay] satisfies ContextType} />
      <UiModal
        isOpen={isOpen}
        onClose={onClose}
        modalActions={() => AddGroupToFavourite(onClose)}
      />
    </div>
  );
}
