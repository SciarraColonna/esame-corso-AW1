import { useEffect, useState } from "react";
import API from "../API.js";
import "../styles/Match.css";
import { useNavigate } from "react-router-dom";

const IMAGES_URL = "http://localhost:3001/";


function Match (props) {
    // props
    const { rounds, user } = props;

    // states
    // state storing the number of the current round
    const [round, setRound] = useState(1);
    // state storing the value of the round timer
    const [timer, setTimer] = useState(30);
    // state storing the value of the timer bar width
    const [barWidth, setBarWidth] = useState(600);
    // state storing the array of images to use during the entire match
    const [images, setImages] = useState(null);
    // state storing the array of captions to use during the current round
    const [captions, setCaptions] = useState(null);

    // state storing the content of the text message of the current round
    const [message, setMessage] = useState("");
    // state storing the color of the text message of the current round
    const [messageColor, setMessageColor] = useState("");
    // state storing the content of the button of the current round
    const [button, setButton] = useState("");
    // state storing the visibility value of the round button
    const [hiddenButton, setHiddenButton] = useState(true);
    // state storing the boolean value expressing whether a caption was selected during the current round
    const [answer, setAnswer] = useState(false);
    // state storing the color of the selected answer based on its correctness
    const [answerColor, setAnswerColor] = useState(null);
    // state storing the key value of the selected caption
    const [selectedKey, setSelectedKey] = useState(null);
    // state storing the match data to be passed to the server
    const [matchData, setMatchData] = useState([]);
    // state storing the recap data to be showed at the end of the match
    const [recapData, setRecapData] = useState([]);

    const navigate = useNavigate();



    // function for shuffling the captions array coming from the server
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // useEffect for managing the round timer
    const [timerId, setTimerId] = useState(null);
    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimer((old) => {
                if (old === 1) {
                    clearInterval(intervalId);
                }
                if ((old - 1) === 0) {
                    handleRoundEnding();
                }
                return old - 1;
            });
        }, 1000);
        setTimerId(intervalId);


        return () => {
            clearInterval(intervalId);
        }
    }, [round, images]);

    // useEffect for managing the timer animated bar
    const [barId, setBarId] = useState(null);
    useEffect(() => {
        const intervalId = setInterval(() => {
            setBarWidth((old) => {
                if (barWidth == 0)  {
                    clearInterval(intervalId);
                }
                return (old - 2);
            });
        }, 100);
        setBarId(intervalId);

        return () => {
            clearInterval(intervalId);
        }
    }, [round]);

    // useEffect for managing the round image retrieval
    useEffect(() => {
        async function retrieveImages () {
            const resources = await API.getImages(rounds);
            setImages(resources);
        }
        retrieveImages();
    }, []);

    // useEffect for managing the round captions retrieval (based on the current image)
    useEffect(() => {
        async function retrieveCaptions () {
            const resources = await API.getCaptions(images[round - 1].id);
            setCaptions(shuffleArray(resources));
        }
        if (images) {
            retrieveCaptions();
        }
    }, [images, round]);

    // function managing the round button when the round ends
    // (either the timer reaches the end or a caption is selected)
    function handleRoundEnding () {
        setAnswer(true);
        setMessageColor("rgb(240, 110, 110)");
        setMessage("Tempo Scaduto!");
        setHiddenButton(false);

        if (rounds === 3) {
            setMatchData([...matchData, {
                userId: user.id,
                imageId: images[round - 1].id,
                score: 0
            }]);
        }

        if (rounds === 1) {
            setButton("Termina partita");
        } else if (rounds === 3) {
            if (round < 3) {
                setButton("Prossimo round");
            } else {
                setButton("Termina partita");
            }
        }
    }

    // function for handling the behavior of the round button, that is, the route redirect
    async function handleButton () {
        if (rounds === 1) {
            navigate("/");
        } else if (rounds === 3) {
            if (button === "Prossimo round") {
                setAnswer(false);
                setHiddenButton(true);
                setMessage("");
                setSelectedKey(null);
                setRound((old) => old + 1);
                setTimer(30);
                setBarWidth(600);
            } else if (button === "Termina partita") {
                await API.storeMatchData(matchData);
                navigate(`/users/${user.id}/play/recap`, { state: { recapData, user } });
            }
        }
    }

    // function for handling the selection of one of the captions during a round
    function handleCaptionSelection (caption) {
        if (!answer) {
            setAnswer(true);
            clearInterval(timerId);
            clearInterval(barId);

            const response = (caption.correct === 1) ? true : false;

            if (response) {
                setAnswerColor("rgb(6, 122, 6)");
            } else {
                setAnswerColor("rgb(173, 54, 54)")
            }
            setSelectedKey(caption.captionId);

            if (response === true) {
                setMessage("Risposta corretta!");
                setMessageColor("whitesmoke");
            } else if (response === false) {
                setMessageColor("rgb(240, 110, 110)");
                setMessage("Risposta errata!");
            }

            setHiddenButton(false);
            if (rounds === 1) {
                setButton("Termina partita");
            } else if (rounds === 3) {
                setMatchData([...matchData, {
                    userId: user.id,
                    imageId: images[round - 1].id,
                    score: response ? 5 : 0
                }]);
                if (response) {
                    setRecapData([...recapData, {
                        imageId: images[round - 1].id,
                        captionContent: caption.content
                    }]);
                }
                if (round < 3) {
                    setButton("Prossimo round");
                } else {
                    setButton("Termina partita");
                }
            }
        }
    }


    return (
        <>
            {/* Element containing timer and animated bar */}
            <div id="timer-container">
                <h2 id="timer-count">{timer}</h2>
                <div id="timer-bar" style={{width: barWidth + "px"}}></div>
            </div>

            {/* Element containing the meme image and the related captions */}
            <div id="round-content">
                <div id="image-container">
                    <img id="round-img" src={images ? IMAGES_URL + images[round - 1].id + ".jpg" : null} />
                </div>
                <div id="captions-container">
                    {captions && captions.map(caption => <p key={caption.captionId} className="caption"
                        onClick={() => handleCaptionSelection(caption)}
                        style={{backgroundColor: (selectedKey === caption.captionId) ? answerColor : "rgb(32, 37, 43)",
                            outline: (answer && (caption.correct === 1)) ? "2px solid rgb(6, 122, 6)" : "none"
                        }}>{caption.content}</p>)}
                </div>
            </div>

            {/* Round message and button */}
            <p id="round-message" style={{color: messageColor}}>{message}</p>
            {!hiddenButton && <button id="round-button" onClick={handleButton}>{button}</button>}
        </>
    );
}

export default Match;