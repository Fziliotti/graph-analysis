// Importação de libs e arquivos externos
const http = require("http");
const graphApi = require("./controllers/graphController");
const PORTA = 80;

// HEADER da Requisição
const HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
};

// configuração do servidor que será levantado na porta 80
const app = http.createServer(onConnection);
app.listen(PORTA); //
app.on("listening", () => console.log("Escutando na porta " + PORTA));

// callback  que vai ler o grafo de maneira assincrona e retorna o grafo 
function onConnection(req, res) {
    leGrafo(req, res)
        .catch(e => {
            res.writeHead(500, HEADERS);
            res.end(JSON.stringify({
                success: false,
                error: e.message
            }));
        });
}

async function leGrafo(req, res) {
    let path = req.url; //pega url da requisicao
    path = path.substring(1); // tira a Barra '/'
    path = decodeURIComponent(path); //decodifica a URI, tirando os caracteres especiais

    let graph = await graphApi.createGraphFromFile(path); // grafo espera o retorno do parseGraph
    res.writeHead(200, HEADERS);
    res.end(JSON.stringify(graph));
}
