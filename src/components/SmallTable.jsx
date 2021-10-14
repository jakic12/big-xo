import React from "react";
import styled from "styled-components";

import { FiCircle, FiX } from "react-icons/fi";


const WrapperWrapper = styled.div`
  padding:20px;
`;

const Wrapper = styled.table`
  margin: 0 auto;
  border-collapse: collapse;
  border-style: hidden;
`;

const Row = styled.tr`
  border: 3px solid rgba(255,255,255,0.2);
  ${p => p.hover && `
    border-color:white;
  `}
  transition:border .2s;
`;

const Column = styled.td`
  border: 3px solid rgba(255,255,255,0.2);
  ${p => p.hover && `
    border-color:white;
  `}
  transition:border .2s;
`;

const InnerBlock = styled.div`
  display:flex;
  justify-content: center;
  align-items: center;
  ${props => props.size && `
    width:${(props.size - 10)/3}px;
    height:${(props.size - 10)/3}px;
  `}

  ${p => p.hover && props.size && `
    width:${(props.size)/3}px !important;
    height:${(props.size)/3}px !important;
  `}

  transition:width height .5s;
`;

export default ({size}) => {

  const [mouseInside, setMouseInside] = React.useState(false);

  

  return (<WrapperWrapper onMouseEnter={() => {setMouseInside(true)}} onMouseLeave={() => {setMouseInside(false)}}><Wrapper >
    {
      new Array(3).fill(0).map(() => <Row hover={mouseInside}>
        {
          new Array(3).fill(0).map(() => <Column hover={mouseInside}>
            <InnerBlock size={size}>
              {(() => {
                const isX = Math.random() < 0.5;
                return <>{!isX && <FiCircle size={(size - 80)/3} color={`#3498db`}/>}
                {isX && <FiX size={(size - 80)/3} color={`#f14666`}/>}</>
              })()}
            </InnerBlock>
          </Column>)
        }  
      </Row>)
    }
  </Wrapper></WrapperWrapper>)
}
;