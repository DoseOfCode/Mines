import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from "react-bootstrap";

import "./Game.css";

function GameManager()
{
    const [score, setScore] = useState(0);
    const [board, setBoard] = useState([]);

    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);

    const AddScore   = () => setScore(score + 1);
    
    const SetupGame = () =>
    {
        setScore(0);

        setGameOver(false);
        setGameWon(false);

        let newBoard = [];
        
        let bombPositions = CalculateBombPositions(5, 25);

        for (let i = 0; i < 25; i++)
        {
            newBoard.push({ covered: true, bomb: bombPositions.some((x) => x === i) });
        }

        setBoard(newBoard);
    }

    const CalculateBombPositions = (amount, maxPosition) =>
    {
        let positions = [];

        for (let i = 0; i < amount * 3; i++)
        {
            if (positions.length >= amount) continue;

            let generatedPos = Math.floor(Math.random() * maxPosition);

            if (!positions.some((x) => x === generatedPos))
            {
                positions.push(generatedPos);
            }
        }

        return positions;
    }
    
    const UncoverPiece = (idx) =>
    {
        let newBoard = [...board];

        let piece = newBoard[idx];

        if (!piece.covered || gameOver || gameWon) return;
        if (!piece.bomb) AddScore();

        piece.covered = false;

        if (piece.bomb)
        {
            setGameOver(true);

            setTimeout(() => SetupGame(), 3000);

            for (let i = 0; i < newBoard.length; i++)
            {
                newBoard[i].covered = false;
            }
        }
        
        if (score >= 19) 
        {
            setGameWon(true);

            for (let i = 0; i < newBoard.length; i++)
            {
                newBoard[i].covered = false;
            }
        }

        setBoard(newBoard);
    }
    
    useEffect(() => 
    {
        SetupGame();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Container fluid>
            <Row className="p-4">
                <Col md="12">
                    <h3>Mines - Score: {score}</h3>

                    <br /><hr />

                    {gameOver && (
                        <h3 className="text-center pt-4">Game Over! You scored {score}</h3>
                    )}

                    {gameWon && (
                        <h3 className="text-center pt-4">Game Won! You win a cookie :p</h3>
                    )}

                    <div className="game-board">
                        {board.map((piece, idx) =>
                            <div className={"game-piece animate__animated animate__fadeIn"} key={idx} onClick={() => UncoverPiece(idx)}>
                                <span>
                                    {piece.covered && (
                                        <React.Fragment>?</React.Fragment>
                                    )}

                                    {!piece.covered && piece.bomb && (
                                        <span>❌</span>
                                    )}

                                    {!piece.covered && !piece.bomb && (
                                        <span>✔</span>
                                    )}
                                </span>
                            </div>
                        )}
                    </div>

                </Col>
            </Row>
        </Container>
    );
}

export default GameManager;