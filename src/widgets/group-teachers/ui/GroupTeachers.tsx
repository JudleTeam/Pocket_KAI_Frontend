import { useGroup } from '@/entities';
import { Box, Text } from '@chakra-ui/react';
import { TeacherCard } from '@/entities';
import { useEffect, useRef, useState } from 'react';
import { sliceLessonName } from '@/entities';
import { ArrowIcon } from '@/shared/assets';
import { Loader } from '@/shared/ui/loader/Loader';
import { useColor } from '@/shared/lib';

export function GroupTeachers() {
  const { mainTextColor, mainElementColor } = useColor();
  const {
    currentGroup,
    groupDisciplines,
    groupDisciplinesStatus,
    getGroupDisciplines,
  } = useGroup();

  const [showButton, setShowButton] = useState(false);
  const teacherRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentRef = teacherRef.current;
    const handleScroll = () => {
      if (currentRef && currentRef.scrollTop > 200) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);
  useEffect(() => {
    if (currentGroup && groupDisciplinesStatus === 'idle') {
      getGroupDisciplines(currentGroup.id);
    }
  }, [currentGroup, groupDisciplinesStatus, getGroupDisciplines]);
  return (
    <Loader status={groupDisciplinesStatus} idleMessage="Выберите группу">
      <Box id="teacher" ref={teacherRef}>
        <Box
          padding="50px 0 10px 0"
          display="flex"
          flexDirection="column"
          gap="10px"
        >
          {groupDisciplines &&
            groupDisciplines.map((discipline) => (
              <Box key={discipline.id}>
                <Text color={mainTextColor} fontWeight="bold" fontSize="16px">
                  {sliceLessonName(discipline.name)}
                </Text>
                {discipline.types.map((disciplineType, index) => (
                  <TeacherCard
                    disciplineType={disciplineType}
                    disciplineName={discipline.name}
                    key={index}
                  />
                ))}
              </Box>
            ))}
        </Box>
        {showButton && (
          <Box
            as="button"
            onClick={() => teacherRef.current?.scrollTo(0, 0)}
            w="40px"
            h="40px"
            borderRadius="8px"
            position="fixed"
            bottom="80px"
            right="5%"
            bgColor={mainElementColor}
            zIndex={'50'}
          >
            <ArrowIcon w="20px" h="20px" color="white"></ArrowIcon>
          </Box>
        )}
      </Box>
    </Loader>
  );
}
