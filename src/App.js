import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthContext } from "./context/authContext";
import RequiredAuth from "./util/authRoutes";
import Login from "./Pages/Login";
import HomePage from "./Pages/Home";
// import DocumentEditor from "./Components/documentEditor";
import Tinymce from "./Components/tinymce";
import PDFUpload from "./Pages/PDFUpload";
import DocumentEditor from "./Pages/DocumentEditor";

// import { Editor } from "./Components/Editor";
import Error404 from "./Pages/Error404";

function App() {
    const [userLoggedData, setUserLoggedData] = useState({
        token: null,
        userId: null,
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if (token && userId) {
            setUserLoggedData({ token, userId });
        }
    }, []);

    const login = (token, userId) => {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        setUserLoggedData({ token, userId });
    };

    const logout = () => {
        setUserLoggedData({ token: null, userId: null });
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
    };

    return (
        <AuthContext.Provider
            value={{
                token: userLoggedData.token,
                userId: userLoggedData.userId,
                login,
                logout,
            }}
        >


            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/"
                    element={
                        <RequiredAuth>
                            <HomePage />
                        </RequiredAuth>
                    }
                />
                <Route
                    path="/upload"
                    element={
                        <RequiredAuth>
                            <PDFUpload />
                        </RequiredAuth>
                    }
                />
                <Route
                    path="/editor"
                    element={
                        <RequiredAuth>
                            <DocumentEditor />
                        </RequiredAuth>
                    }
                />
                <Route path="*" element={<Error404 />} />
            </Routes>
        </AuthContext.Provider>
    );
}

export default App;
