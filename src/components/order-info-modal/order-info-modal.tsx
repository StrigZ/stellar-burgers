import { useParams } from 'react-router-dom';
import { Modal } from '../modal';
import { OrderInfo } from '../order-info/order-info';

type Props = { onClose: () => void };
export function OrderInfoModal({ onClose }: Props) {
  const { number } = useParams<{ number: string }>();

  return (
    <Modal title={`#${number}`} onClose={onClose}>
      <OrderInfo />
    </Modal>
  );
}
