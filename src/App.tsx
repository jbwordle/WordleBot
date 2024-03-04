import { Container } from "@mui/material";
import Header from "./components/Header";
import Layout from "./components/Layout";
import Wordle from "./components/Wordle/Wordle";

function App() {
    return (
        <Layout>
            <Container maxWidth="sm">
                <Header />
                <Wordle  />
            </Container>
        </Layout>
    );
}

export default App;