import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Recap.css";

const IMAGES_URL = "http://localhost:3001/";


function Recap (props) {

    // props
    const { user } = props;

    const location = useLocation();
    const { recapData } = location.state;

    const navigate = useNavigate();

    // current match score 
    const score = (5 * recapData.length);


    return (
        <>
        <h1 id="score"><span>Punteggio</span>: {score}</h1>

        {/* Alert displayed when no answer was correct */}
        {score === 0 &&
        <div id="alert-option">
            <img id="alert-img" src="/alert.png" />
            <p className="alert-message">Sembra che tu non abbia vinto nessun round</p>
        </div>
        }

        {/* Table listing the correct answers with the related meme images and captions */}
        {score > 0 &&
        <>
        <p className="alert-message">Meme abbinati correttamente:</p>
        <div id="table-container">
            <table>
                <tbody>
                {recapData.map((answer, index) => {
                    return <tr key={index}>
                    <td><img id="meme-img" src={IMAGES_URL + answer.imageId + ".jpg"} /></td>
                    <td><p id="caption-content">{answer.captionContent}</p></td>
                    </tr>
                })}
                </tbody>
            </table>
        </div>
        </>
        }

        {/* Button leading to home page */}
        <button id="home-button" onClick={() => navigate(`/users/${user.id}`)}>Torna alla home</button>
        </>
    )
}

export default Recap;