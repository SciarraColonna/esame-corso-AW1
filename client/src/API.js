const SERVER_URL = "http://localhost:3001/api";


const login = async (credentials) => {
    const response = await fetch(SERVER_URL + "/sessions", {
        method: "POST",
        headers: {
            "Content-Type": "Application/json"
        },
        credentials: "include",
        body: JSON.stringify(credentials)
    });

    if (response.ok) {
        const user = await response.json();
        return user;
    } else {
        const err = await response.text();
        throw err;
    }
}

const logout = async () => {
    const response = await fetch(SERVER_URL + "/sessions/current", {
        method: "DELETE",
        headers: {
            "Content-Type": "Application/json"
        },
        credentials: "include"
    });

    if (!response.ok)  {
        const err = await response.text();
        throw err;
    }
}

const getImages = async (quantity) => {
    const response = await fetch(SERVER_URL + `/images/random?quantity=${quantity}`);
    if (response.ok) {
        const resources = await response.json();
        return resources;
    } else {
        const err = await response.text();
        return err;
    }
}

const getCaptions = async (id) => {
    const response = await fetch(SERVER_URL + `/images/${id}/captions/random`);
    if (response.ok) {
        const resources = await response.json();
        return resources;
    } else {
        const err = await response.text();
        return err;
    }
}

const storeMatchData = async (data) => {
    const id = data[0].userId;
    const response = await fetch(SERVER_URL + `/users/${id}/history`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const err = await response.text();
        return err;
    } else {
        return null;
    }
}

const getUserHistory = async (id) => {
    const response = await fetch(SERVER_URL + `/users/${id}/history`, {
        credentials: "include"
    });
    if (response.ok) {
        const resources = await response.json();
        return resources;
    } else {
        const err = await response.text();
        return err;
    }
}


const API = { login, logout, getImages, getCaptions, storeMatchData, getUserHistory };
export default API;