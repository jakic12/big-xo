import React from "react";
import styled from "styled-components"
import SmallTable from "./SmallTable";

const WrapperWrapper = styled.div`
  padding:20px;
`;

const Wrapper = styled.table`
  margin: 0 auto;
  border-collapse: collapse;
  border-style: hidden;
`;

const Row = styled.tr`
  border: 5px solid white;
`;

const Column = styled.td`
  border: 5px solid white;;
  
`;

const InnerBlock = styled.div`
  display:flex;
  justify-content: center;
  align-items: center;
  ${props => props.size && `
    width:${props.size}px;
    height:${props.size}px;

  `}
  box-sizing:border-box;
`;

export default () => {
  
  const smallSize = (Math.min(window.innerHeight, window.innerWidth) - 10 - 20 * 2)/3;

  return (<WrapperWrapper><Wrapper>
    {
      new Array(3).fill(0).map(() => <Row>
        {(() => {
          return new Array(3).fill(0).map(() => <Column>
            <InnerBlock size={smallSize}>
              <SmallTable size={smallSize - 40}/>
            </InnerBlock>
          </Column>)
        })()
        }  
      </Row>)
    }
  </Wrapper></WrapperWrapper>)
}
;