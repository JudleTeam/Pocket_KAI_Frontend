import {
  Input,
  Button,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useColorModeValue,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { useForm, SubmitHandler } from 'react-hook-form';
type IFormInput = {
  login: string;
  password: string;
};
import { useGroup, useUser } from '@/entities';
import { useEffect } from 'react';
export function Auth(onClose: () => void) {
  const { reset, handleSubmit, register } = useForm<IFormInput>();
  const { userStatus, login, getMe} = useUser();
  const {getGroupById, homeGroupStatus, addGroupToFavourite, setCurrentGroup} = useGroup()
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    await login(data);
    const user = await getMe();
    if(user.group_id && homeGroupStatus === 'idle'){
      const group = await getGroupById(user.group_id);
      if(group){
        addGroupToFavourite(group)
        setCurrentGroup(group)
      }
    }
    reset();
    onClose();
  };
  useEffect(() => {
    console.log(userStatus);
  }, [userStatus]);
  const mainTextColor = useColorModeValue('light.main_text', 'dark.main_text');
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DrawerHeader fontSize={'24px'} fontWeight={'600'} color={mainTextColor}>
        Вход в аккаунт
      </DrawerHeader>
      {userStatus === 'loading' ? (
        <DrawerBody
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          gap="20px"
        >
          <Spinner size="xl" />
          <Text>Ловим связь с КАИ...</Text>
        </DrawerBody>
      ) : userStatus === 'success' ? (
        <DrawerBody
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          gap="20px"
        >
          <CheckCircleIcon w="80px" h="80px" color="green.500" />
          <Text>Успешно</Text>
        </DrawerBody>
      ) : (
        <>
          <DrawerBody display="flex" flexDirection="column" gap="20px">
            <Input {...register('login')} placeholder="Введите логин" />
            <Input
              {...register('password')}
              type="password"
              placeholder="Введите пароль"
            />
          </DrawerBody>
          <DrawerFooter w="100%" display="flex" justifyContent="center">
            <Button w="50%" colorScheme="blue" mr={3} type="submit">
              Войти
            </Button>
            <Button
              w="50%"
              colorScheme="blue"
              variant="outline"
              onClick={onClose}
            >
              Отмена
            </Button>
          </DrawerFooter>
        </>
      )}
    </form>
  );
}
