import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getUserSelector } from '../../services/user/user-slice';
import { updateUser } from '../../services/user/user-actions';
import { TUser } from '@utils-types';

export const Profile: FC = () => {
  const userState = useSelector(getUserSelector);

  // неавторизованный пользователь не может попасть
  // на эту страницу
  const user = userState.user as TUser;

  const [formValue, setFormValue] = useState({
    name: user.name,
    email: user.email,
    password: ''
  });
  const dispatch = useDispatch();

  const isFormChanged =
    formValue.name !== user.name ||
    formValue.email !== user.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(updateUser(formValue)).then(() =>
      setFormValue((pv) => ({ ...pv, password: '' }))
    );
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
