import React from "react";
import styled from "styled-components";

import { FiCircle, FiX } from "react-icons/fi";
import { useSelector } from "react-redux";

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
    p.isClickable &&
    `&:hover {
    cursor: pointer;
    //background:rgba(255,255,255,0.2);
  }`}

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
  pointer-events: none;
  ${(p) => {
    if (!p.active) {
      return `background: rgba(33, 34, 38, 0.7);`;
    } else {
      return `opacity:0.5;`;
    }
  }}

  transition: background 0.2;
`;

export default ({ size, pos, socket }) => {
  const gameState = useSelector((state) => state.gameState);
  const lps = useSelector((state) => state.lps);
  const [mouseInside, setMouseInside] = React.useState(false);
  const [mouseInsideSquare, setMouseInsideSquare] = React.useState([]);
  const smallGridData = gameState.field.field[pos[0]][pos[1]];
  const show = smallGridData.won;
  const isMyTurn =
    gameState.players.indexOf(lps.playerId) == gameState.currentPlayer;

  const currentActiveSmall =
    !gameState.activeSmall.length ||
    (gameState.activeSmall[0] == pos[0] && gameState.activeSmall[1] == pos[1]);

  const smallSize = size > 150 ? (size - 80) / 3 : size / 3;

  return (
    <WrapperWrapper
      size={size}
      /*onMouseEnter={() => {
        setMouseInside(true);
      }}
      onMouseLeave={() => {
        setMouseInside(false);
      }}*/
    >
      <Overlay active={currentActiveSmall}>
        {show == 1 && (
          <FiCircle
            style={{ pointerEvents: `none` }}
            size={size + 40}
            color={`#3498db`}
            strokeWidth={0.5}
          />
        )}
        {show == 2 && (
          <FiX
            style={{ pointerEvents: `none` }}
            size={size + 40}
            color={`#f14666`}
            strokeWidth={0.5}
          />
        )}
      </Overlay>
      <Wrapper>
        {smallGridData.field.map((_, i) => (
          <Row hover={mouseInside}>
            {smallGridData.field[i].map((__, j) => (
              <Column hover={mouseInside}>
                <InnerBlock
                  isClickable={
                    smallGridData.field[i][j] == 0 &&
                    isMyTurn &&
                    currentActiveSmall
                  }
                  size={size}
                  hover={mouseInside}
                  onClick={() => {
                    if (
                      smallGridData.field[i][j] == 0 &&
                      isMyTurn &&
                      currentActiveSmall
                    ) {
                      socket.emit("submit_move", {
                        position: [pos[0], pos[1], i, j],
                      });
                    }
                  }}
                  onMouseEnter={() => {
                    if (smallGridData.field[i][j] == 0)
                      setMouseInsideSquare([i, j]);
                  }}
                  onMouseLeave={() => {
                    if (
                      mouseInsideSquare[0] == i &&
                      mouseInsideSquare[1] == j
                    ) {
                      setMouseInsideSquare([]);
                    }
                  }}
                >
                  {(() => {
                    return (
                      <>
                        {smallGridData.field[i][j] == 0 &&
                          isMyTurn &&
                          currentActiveSmall &&
                          mouseInsideSquare[0] == i &&
                          mouseInsideSquare[1] == j && (
                            <>
                              {gameState.currentPlayer == 0 && (
                                <FiCircle
                                  size={smallSize}
                                  color={`rgba(52, 152, 219, 0.2)`}
                                />
                              )}
                              {gameState.currentPlayer == 1 && (
                                <FiX
                                  size={smallSize}
                                  color={`rgba(241, 70, 102, 0.2)`}
                                />
                              )}
                            </>
                          )}
                        {smallGridData.field[i][j] == 1 && (
                          <FiCircle size={smallSize} color={`#3498db`} />
                        )}
                        {smallGridData.field[i][j] == 2 && (
                          <FiX size={smallSize} color={`#f14666`} />
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
