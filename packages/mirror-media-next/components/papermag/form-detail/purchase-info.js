import styled from 'styled-components'

const Wrapper = styled.div`
  border-radius: 12px;
  background: #f2f2f2;
  padding: 16px;
`

const Title = styled.h2`
  color: rgba(0, 0, 0, 0.87);
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 16px;
`

const ItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  :not(:last-child) {
    margin-bottom: 8px;
  }
`
const Item = styled.div`
  color: rgba(0, 0, 0, 0.5);
  font-size: 18px;
  font-weight: 400;
  margin-right: 16px;
`

const Price = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-size: 18px;
  font-weight: 400;
`

const Hr = styled.hr`
  margin: 16px 0;
`
const DiscountMsg = styled.div`
  margin-top: 8px;
  border-radius: 12px;
  background: #f2f2f2;
  padding: 14px 16px;
  color: #054f77;
  font-size: 14px;
  font-weight: 400;
  display: flex;
  justify-content: space-between;
`

export default function PurchaseInfo() {
  return (
    <>
      <Wrapper>
        <Title>訂單資訊</Title>
        <ItemWrapper>
          <Item>鏡週刊紙本雜誌 52 期</Item>
          <Price>NT$ 2,880</Price>
        </ItemWrapper>
        <ItemWrapper>
          <Item>運費</Item>
          <Price>NT$ 0</Price>
        </ItemWrapper>
        <Hr />
        <ItemWrapper>
          <Item>費用總計</Item>
          <Price>NT$ 8,160</Price>
        </ItemWrapper>
      </Wrapper>
      <DiscountMsg>
        <span>符合一年方案優惠</span>
        <span>贈送 5 期</span>
      </DiscountMsg>
    </>
  )
}