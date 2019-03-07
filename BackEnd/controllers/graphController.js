const Graph = require('../models/Graph')
const fs = require('fs')

//Faz a leitura do arquivo e transforma em uma matriz ou array de arrays
function fileToMatrix(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, "utf8", (error, data) => {
            if (error) return reject(new Error("Caminho inválido"))
            //pega o conteudo, quebra as linhas e coloca no array
            //pega cada item do array e tira os '\r'
            //depois de tirar todos os '\r', cria-se um novo array dos dois numeros que sobraram
            let matrix = data.split("\n").map(l => l.replace("\r", "").split("\t").map(Number))
            return resolve(matrix)
        })
    })
}

function vertexesFromFile(matrixFromFile) {
    let vertexes = new Set()
    matrixFromFile.forEach(item => {
        vertexes.add(item[0])
        vertexes.add(item[1])
    })
    return [...vertexes]
}

// para nao ter que reemitir o erro, foi colocado a sintaxe async e await
async function createGraphFromFile(path) {
    let parsed_file = await fileToMatrix(path)
    let vertexes_from_file = vertexesFromFile(parsed_file)
    let graph = new Graph(vertexes_from_file)

    parsed_file.map(edge => graph.insertEdge(edge[0], edge[1]))

    if(path == 'files/grafo-teste.txt')
        var linkImgGraph = './grafoteste.jpg'

    return {
        success: true,
        img: linkImgGraph,
        path: path.substring(6),
        graph: {...graph},
        info: graph.mountGraph(graph)

    }
}

module.exports = {
    fileToMatrix,
    createGraphFromFile
}