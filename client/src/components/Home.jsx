import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Home.css";


function Home (props) {

    // props
    const { isLoggedIn, user, handleLogout } = props;

    // states
    const [showOpt1, setShowOpt1] = useState(false);
    const [showOpt3, setShowOpt3] = useState(false);

    const navigate = useNavigate();


    return (
        <>
            <div id="home-options-container">

                {/* Left panel of the home page */}
                {!showOpt3 &&
                <div className="home-image-container">
                    {!isLoggedIn &&
                    <>
                    <img className="home-img" src="/fast-match.png"></img>  
                    <p className="image-subtext">Gioca una partita veloce senza effettuare l'accesso</p>
                    </>
                    }
                    {isLoggedIn &&
                    <>
                    <img className="home-img" src="/classic-match.png"></img>  
                    <p className="image-subtext">Gioca una partita nella modalità classica a round</p>
                    </>
                    }
                    { !showOpt1 && !isLoggedIn &&
                    <button className="home-button blue" onClick={() => setShowOpt1(true)}>Partita veloce</button> 
                    }
                    { !showOpt1 && isLoggedIn &&
                    <button className="home-button blue" onClick={() => setShowOpt1(true)}>Partita classica</button> 
                    }
                    { showOpt1 && <MatchConfirmation isLoggedIn={isLoggedIn} user={user} setShowOpt1={setShowOpt1}/> }
                </div>
                }

                {/* Central panel of the home page */}
                {(!showOpt1 && !showOpt3 && !isLoggedIn) && 
                <div className="home-image-container">
                    <img className="home-img" src="/login.png"></img>
                    <p className="image-subtext">Effettua il login per accedere a più contenuti di gioco</p>
                    <button className="home-button red" onClick={() => {navigate("/login")}}>Accedi</button>
                </div>
                }
                {(!showOpt1 && !showOpt3 && isLoggedIn) &&
                <div className="home-image-container">
                    <div id="user-info">
                        <img className="home-img" id="user-info-img" src="/user.png"></img>
                        <p id="username">{user.username}</p>
                        <Link to={`/users/${user.id}/history`} id="history-link">Cronologia utente</Link>
                    </div>
                    <button className="home-button red" onClick={handleLogout}>Logout</button>
                </div>
                }

                {/* Right panel of the home page */}
                { !showOpt1 &&
                <div className="home-image-container">
                    <img className="home-img" src="/rules.png"></img>
                    { !showOpt3 && <p className="image-subtext">Visualizza le regole e le modalità di gioco disponibili</p> }
                    { !showOpt3 && <button className="home-button blue" onClick={() => setShowOpt3(true)}>Regole</button> }
                    { showOpt3 && <GameRules setShowOpt3={setShowOpt3}/> }
                </div>
                }
            </div>
        </>
    );
}

function MatchConfirmation (props) {

    // props
    const { isLoggedIn, user, setShowOpt1 } = props;

    const navigate = useNavigate();


    return (
        <div>
            <button className="match-button blue" type="button"
                    onClick={() => {setShowOpt1(false)}}>Indietro</button>
            {!isLoggedIn &&
            <button className="match-button red" type="button"
            onClick={() => {navigate("/play")}}>Avvia</button>
            }
            {isLoggedIn &&
            <button className="match-button red" type="button"
            onClick={() => {navigate(`/users/${user.id}/play`)}}>Avvia</button>
            }
        </div>
    );
}

function GameRules (props) {
    return (
        <>
        <p className="rules-subtext">
            Il gioco consiste nell'associare ad ogni immagine proposta una didascalia appropriata in base
            al meme rappresentato. In ogni round vi sono 7 didascalie fra cui scegliere, di cui 2 sono corrette e 5 sono errate.
            Il tempo massimo concesso per scegliere una fra le didascalie proposte è di 30 secondi.
            Ad ogni round verranno assegnati 5 punti in caso di risposta corretta o 0 punti in caso
            di risposta errata o non data.<br/>
            Le modalità di gioco disponibili sono le seguenti:<br/><br/>
            <span>Partita veloce</span><br/>
            Modalità di gioco accessibile esclusivamente da utenti non registrati.<br/>
            La partita è composta da 1 round ed è anonima, pertanto nessun dato o statistica verrà salvato.<br/><br/>
            <span>Partita classica</span><br/>
            Modalità di gioco accessibile esclusivamente da utenti registrati e autenticati.<br/>
            La partita è composta da 3 round successivi e distinti. I dati dei singoli round saranno disponibili 
            nella cronologia di gioco dell'utente.
        </p>
        <button className="home-button blue"
                onClick={() => {props.setShowOpt3(false)}}>Indietro</button>
        </>
    )
}

export default Home;