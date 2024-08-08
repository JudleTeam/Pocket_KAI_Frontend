import {
    DrawerHeader,
    Text,
    Box,
    Avatar,
    useColorModeValue,
    useChakra,
  } from '@chakra-ui/react';
  import { ExamType } from '@/shared';
  import { Link } from 'react-router-dom';
  import { DateTime } from 'luxon';
  import { getLessonBuilding } from '@/shared/lib';
  export function ExamDrawer({ exam }: { exam: ExamType }) {
    const {theme} = useChakra()
    const tab = useColorModeValue(theme.colors.light.tab, theme.colors.dark.tab)
    const mainTextColor = useColorModeValue('light.main_text', 'dark.main_text');
    const mainElementColor = useColorModeValue('light.main_element', 'dark.main_element')
    const tabTeacherColor = useColorModeValue('light.tab_teacher', 'dark.tab_teacher')
    return (
      <DrawerHeader
        w="95%"
        padding="25px 0 0 0"
        color={mainTextColor}
        display="flex"
        flexDirection="column"
        gap="5px"
      >
        <Text fontSize="24px" fontWeight="bold">
          {exam.discipline.name}
        </Text>
        <Text fontSize="24px" fontWeight="medium">
          {exam.time.slice(0, -3)}
        </Text>
        <Box
          display="flex"
          justifyContent="space-between"
          fontSize="16px"
          padding="10px 0"
        >
            <Text>
              {getLessonBuilding(exam.building_number, exam.audience_number)}
            </Text>
        </Box>
        {exam.parsed_date ? (
            <Text fontWeight="medium" fontSize="18px">
              Дата проведения экзамена:{' '}
              {DateTime.fromISO(exam.parsed_date).setLocale('ru').toFormat('d MMMM yyyy')}
            </Text>
          ) : (
            <Text fontWeight="medium" fontSize="18px">
              Дата проведения экзамена: {exam.original_date}
            </Text>
          )}
        <Text
          as={Link}
          padding="10px 0"
          fontSize="14px"
          fontWeight="medium"
          color="orange.300"
          to="/account/report"
        >
          Сообщить об ошибке
        </Text>
        {exam.teacher && (
          <Box
            as={Link}
            to={'/teachers'}
            boxShadow={`0px 0px 5px 0px ${tab}`}
            bgColor={tab}
            borderRadius="16px"
            padding="14px"
            display="flex"
            alignItems="center"
            gap="15px"
            transition="0.2s"
            _active={{bgColor: tabTeacherColor, transition: "0.2s"}}
          >
            <Avatar bg={mainElementColor}/>
            <Box>
              <Text fontSize="16px" fontWeight="medium">
                {exam?.teacher?.name}
              </Text>
            </Box>
          </Box>
        )}
      </DrawerHeader>
    );
  }
  