import React from "react";
import styled from "styled-components";

import { FiCircle, FiX } from "react-icons/fi";

const WrapperWrapper = styled.div`
  position: relative;
`;

const Wrapper = styled.table`
  margin: 0 auto;
  border-collapse: collapse;
  border-style: hidden;
`;

const Row = styled.tr`
  border: 3px solid rgba(255, 255, 255, 0.2);
  ${(p) =>
    p.hover &&
    `
    border-color:white;
  `}
  transition:border .2s;
`;

const Column = styled.td`
  border: 3px solid rgba(255, 255, 255, 0.2);
  ${(p) =>
    p.hover &&
    `
    border-color:white;
  `}
  transition:border .2s;
`;

const InnerBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  ${(p) =>
    p.hover
      ? `
    width:${p.size / 3}px;
    height:${p.size / 3}px;
  `
      : `
    width:${(p.size - 10) / 3}px;
    height:${(p.size - 10) / 3}px;
  `}
  transition: width height 0.5s;
`;

const Overlay = styled.div`
  left: 0;
  top: 0;
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(33, 34, 38, 0);
  ${(p) => {
    if (!p.active) {
      return `background: rgba(33, 34, 38, 0.7);`;
    } else {
      return `opacity:0.5;`;
    }
  }}

  transition: background 0.2;
`;

export default ({ size }) => {
  const [mouseInside, setMouseInside] = React.useState(false);
  const show = true;

  return (
    <WrapperWrapper
      size={size}
      onMouseEnter={() => {
        setMouseInside(true);
      }}
      onMouseLeave={() => {
        setMouseInside(false);
      }}
    >
      <Overlay active={mouseInside}>
        <FiX
          style={!show && { display: `none` }}
          size={size + 40}
          color={`#f14666`}
          strokeWidth={0.5}
        />
      </Overlay>
      <Wrapper>
        {new Array(3).fill(0).map(() => (
          <Row hover={mouseInside}>
            {new Array(3).fill(0).map(() => (
              <Column hover={mouseInside}>
                <InnerBlock size={size} hover={mouseInside}>
                  {(() => {
                    const isX = Math.random() < 0.5;
                    return (
                      <>
                        {!isX && (
                          <FiCircle size={(size - 80) / 3} color={`#3498db`} />
                        )}
                        {isX && (
                          <FiX size={(size - 80) / 3} color={`#f14666`} />
                        )}
                      </>
                    );
                  })()}
                </InnerBlock>
              </Column>
            ))}
          </Row>
        ))}
      </Wrapper>
    </WrapperWrapper>
  );
};
