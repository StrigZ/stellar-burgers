import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getUserOrdersSelector } from '../../services/user-orders/user-orders-slice';
import { getUserOrders } from '../../services/user-orders/user-orders-actions';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const { orders, loading, error } = useSelector(getUserOrdersSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserOrders());
  }, []);

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return <p className='text text_type_main-default'>{error}</p>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
