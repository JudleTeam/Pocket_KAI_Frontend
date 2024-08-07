import { memo } from 'react';
import {
  HStack,
  Text,
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react';
import { DateTime } from 'luxon';
import { Lesson } from '@/shared';
import LessonDrawer from '../LessonDrawer/LessonDrawer';
import { lessonStateIcons } from '@/shared/constants';
import { lessonStateLine } from '../../constants/lessonStateLine';
import { LessonTypes } from '@/shared/constants';
import { getLessonState } from '../../lib/getLessonState';
import { getLessonBuilding } from '@/shared/lib';
import { sliceLessonName } from '../../lib/sliceLessonName';
import { UiDrawer } from '@/shared/ui/ui-drawer/UiDrawer';
import styles from './LessonCard.module.scss';

const LessonCard = memo(
  ({ lesson, dayDate }: { lesson: Lesson; dayDate: string }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const mainTextColor = useColorModeValue(
      'light.main_text',
      'dark.main_text'
    );
    const blueLightElementColor = useColorModeValue(
      'light.blue_light_element',
      'dark.blue_light_element'
    );
    return (
      <>
        <HStack
          onClick={onOpen}
          className={styles['lesson-card']}
          alignItems="flex-start"
        >
          <div className={styles['lesson-card__time']}>
            <Text
              className={styles['lesson-card__time--start']}
              color={mainTextColor}
            >
              {lesson.start_time
                ? DateTime.fromISO(lesson.start_time).toFormat('HH:mm')
                : 'Н/Д'}
            </Text>
            <Text
              className={styles['lesson-card__time--end']}
              color={blueLightElementColor}
            >
              {lesson.end_time &&
                DateTime.fromISO(lesson.end_time).toFormat('HH:mm')}
            </Text>
          </div>
          <div className={styles['lesson-card__timeline']}>
            {lessonStateIcons[getLessonState(lesson, dayDate).state]}
            {lessonStateLine(getLessonState(lesson, dayDate).color)}
          </div>
          <div className={styles['lesson-card__info']}>
            <Text
              color={mainTextColor}
              fontWeight="bold"
              lineHeight={1.3}
              className={styles['lesson-card__name']}
            >
              {sliceLessonName(lesson.discipline.name)}
            </Text>
            <Text color={mainTextColor} fontWeight={'medium'}>
              {getLessonBuilding(
                lesson.building_number,
                lesson.audience_number
              )}
            </Text>
            <Text fontWeight={'meduim'}>
              {lesson.parsed_lesson_type &&
                LessonTypes[lesson.parsed_lesson_type]}
            </Text>
          </div>
        </HStack>
        <UiDrawer
          isOpen={isOpen}
          onClose={onClose}
          drawerActions={
            <LessonDrawer dayDate={dayDate} lesson={lesson} isOpen={isOpen}/>
          }
        />
      </>
    );
  }
);
export default LessonCard;
