import { Container } from "@mui/material";
import Layout from "./components/Layout";
import Header from "./components/Header";
import Wordle from "./components/Wordle/Wordle";

function App() {
    return (
        <Layout>
            <Container maxWidth="sm">
                <Header />
                <Wordle />
            </Container>
        </Layout>
    );
}

export default App;