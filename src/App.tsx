import { Container } from "@mui/material";
import Layout from "./components/Layout";
import Header from "./components/Header";
import Wordle from "./components/Wordle/Wordle";
import { useState } from "react";

function App() {
    const [key, setKey] = useState(0);

    const resetWordle = () =>
    setKey(prevKey => prevKey + 1);

    return (
        <Layout>
            <Container maxWidth="sm">
                <Header />
                <Wordle key={key} onResetWordle={resetWordle} />
            </Container>
        </Layout>
    );
}

export default App;