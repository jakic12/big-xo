import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import SmallTable from "./SmallTable";

const WrapperWrapper = styled.div`
  padding: 20px;
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
  border: 5px solid white; ;
`;

const InnerBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  ${(props) =>
    props.size &&
    `
    width:${props.size}px;
    height:${props.size}px;
  `}
  box-sizing:border-box;
`;

const TurnDisplay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  padding: 2em;
  color: white;
`;

export default ({ socket }) => {
  const { gameState, lps } = useSelector((state) => state);
  const isMyTurn =
    gameState.players.indexOf(lps.playerId) == gameState.currentPlayer;

  const smallSize =
    (Math.min(window.innerHeight, window.innerWidth) - 10 - 20 * 2) / 3;

  console.log(gameState);
  return (
    <WrapperWrapper>
      <TurnDisplay current={gameState.currentPlayer}>
        {lps.playerId == `spectator`
          ? `spectator`
          : isMyTurn
          ? `your turn`
          : `not your turn`}
      </TurnDisplay>
      <Wrapper>
        {gameState.field.field &&
          gameState.field.field.map((_, big_i) => (
            <Row>
              {(() => {
                return gameState.field.field[big_i].map((__, big_j) => (
                  <Column>
                    <InnerBlock size={smallSize}>
                      <SmallTable
                        socket={socket}
                        pos={[big_i, big_j]}
                        size={smallSize - 40}
                      />
                    </InnerBlock>
                  </Column>
                ));
              })()}
            </Row>
          ))}
      </Wrapper>
    </WrapperWrapper>
  );
};
