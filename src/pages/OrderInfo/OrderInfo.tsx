import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as S from './styled';
import { useResetRecoilState } from 'recoil';

import { CartItem } from '@type/cartItem';
import { ROUTER_URLS } from '@constants/constants';
import { discountAmountStore } from '@recoil/atoms';

import {
  ShoppingCartItemView,
  Coupon,
  IsolatedRegionShippingFee,
  PaymentTotalWithDiscount,
} from '@components/OrderInfo';
import ShoppingCartDescription from '@components/serviceCommon/ShoppingCartDescription/ShoppingCartDescription';
import FloatingButton from '@components/common/FloatingButton/FloatingButton';
import useMutation from '@hooks/useMutation';
import orderItems from '@api/post/orderItems';
import usePriceInfo from './../../hooks/usePriceInfo';
import useIsolatedRegion from '@hooks/useIsolatedRegion';
import useCoupon from '@hooks/coupon/useCoupon';

interface OrderInfoState {
  orderItems: CartItem[];
  kindCount: number;
  productCount: number;
  totalPrice: number;
}

const OrderInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isolatedRegion, handleIsolatedRegion } = useIsolatedRegion();
  const priceInfo = usePriceInfo(isolatedRegion);
  const couponLogic = useCoupon(isolatedRegion);

  const { mutate: orderItemsMutate, isPending } = useMutation<typeof orderItems>(orderItems, {
    onSuccess: () => {
      navigate(ROUTER_URLS.PAYMENT_INFO, { state: paymentInfo });
    },
    onError: () => alert('결제 실패! 관리자에게 문의하세요.'),
  });

  const onOrder = async () => {
    await orderItemsMutate(cartItemIds);
  };

  const resetDiscount = useResetRecoilState(discountAmountStore);
  const orderInfo = location.state as OrderInfoState | null;
  const totalPrice = priceInfo.total;

  useEffect(() => {
    if (orderInfo === undefined) navigate(ROUTER_URLS.ERROR);

    return () => {
      resetDiscount();
    };
  }, [navigate, orderInfo, resetDiscount]);

  const orderInfoNotNull = orderInfo as OrderInfoState;
  const cartItemIds = orderInfoNotNull.orderItems.map(item => item.id);
  const paymentInfo = {
    kindCount: orderInfoNotNull.kindCount,
    productCount: orderInfoNotNull.productCount,
    totalPrice,
  };

  return (
    <>
      <S.Container>
        <ShoppingCartDescription
          title="주문 확인"
          descriptionShowingCondition={true}
          description={`총 ${orderInfo?.kindCount}종류의 상품 ${orderInfo?.productCount}개를 주문합니다.
최종 결제 금액을 확인해 주세요.`}
        />
        {orderInfo?.orderItems.map(item => <ShoppingCartItemView key={item.id} cartItem={item} />)}
        <Coupon isolatedRegion={isolatedRegion} {...couponLogic} />
        <IsolatedRegionShippingFee
          isolatedRegion={isolatedRegion}
          handleIsolatedRegion={handleIsolatedRegion}
        />
        <PaymentTotalWithDiscount priceInfo={priceInfo} coupons={couponLogic.couponDetail} />
      </S.Container>
      <FloatingButton label="결제하기" onClick={onOrder} disabled={isPending} />
    </>
  );
};

export default OrderInfo;
