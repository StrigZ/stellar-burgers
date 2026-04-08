import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { getBurgerConstructorSelector } from '../../services/burger-constructor/burger-constructor-slice';
import {
  closeOrderModal,
  getOrdersSelector
} from '../../services/order/order-slice';
import { useLocation, useNavigate } from 'react-router-dom';
import { makeOrder } from '../../services/order/order-actions';
import { getUserSelector } from '../../services/user/user-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const constructorItems = useSelector(getBurgerConstructorSelector);
  const { isOrdering: orderRequest, orderModalData } =
    useSelector(getOrdersSelector);
  const { isAuth } = useSelector(getUserSelector);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!isAuth) {
      navigate('/login', {
        state: { from: location.pathname }
      });
      return;
    }

    dispatch(makeOrder());
  };
  const closeModal = () => {
    dispatch(closeOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun?.price ?? 0) * 2 +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeModal}
    />
  );
};
