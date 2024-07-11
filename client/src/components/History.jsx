import { useEffect, useState } from "react";
import API from "../API";
import "../styles/History.css";
import { useNavigate } from "react-router-dom";

const IMAGES_URL = "http://localhost:3001/";


function History (props) {
    
    // props
    const { user } = props;

    const navigate = useNavigate();

    // states
    const [history, setHistory] = useState([]);

    // useEffect for retrieving the history data from the server
    useEffect(() => {
        async function getHistory () {
            const data = [];
            const response = await API.getUserHistory(user.id);
            for (let i = 0; i < response.length; i = i + 3) {
                data.push([response[i], response[i + 1], response[i + 2]]);
            }
            setHistory(data);
        }
        getHistory()
    }, []);


    return (
        <>
        <h1 id="history-title">Cronologia utente</h1>

        {/* Alert message displayed when the history is empty */}
        {history.length === 0 &&
        <div id="alert-option">
            <img id="alert-img" src="/alert.png" />
            <p className="alert-message">Sembra che tu non abbia ancora giocato ad alcuna partita</p>
        </div>
        }

        {/* Table showing the history data */}
        {history.length > 0 &&
        <div id="history-table-container">
            {history.map((row, index) => {
            return <table key={index}>
                <tbody>
                    <tr>
                        <td className="history-match-row" colSpan={3}>
                            <span>Partita {index + 1}</span>
                        </td>
                    </tr>
                    <tr> 
                        <td colSpan={3}>
                            <span>Punteggio complessivo: {row[0].score + row[1].score + row[2].score}</span>
                        </td>
                    </tr>
                    <tr>
                        <td><img className="history-img" src={IMAGES_URL + row[0].imageId + ".jpg"} /></td>
                        <td><img className="history-img" src={IMAGES_URL + row[1].imageId + ".jpg"} /></td>
                        <td><img className="history-img" src={IMAGES_URL + row[2].imageId + ".jpg"} /></td>
                    </tr>
                    <tr>
                        <td className="history-round-col"><span>Round 1</span></td>
                        <td className="history-round-col"><span>Round 2</span></td>
                        <td className="history-round-col"><span>Round 3</span></td>
                    </tr>
                    <tr>
                        <td>Punteggio: {row[0].score}</td>
                        <td>Punteggio: {row[1].score}</td>
                        <td>Punteggio: {row[2].score}</td>
                    </tr>
                </tbody>
            </table>
            })}
        </div>
        }

        {/* Button leading to home page */}
        <button id="home-button" onClick={() => navigate(`/users/${user.id}`)}>Torna alla home</button>
        </>
    );
}

export default History;