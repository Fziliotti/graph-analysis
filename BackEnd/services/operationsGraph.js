const Graph = require('../models/Graph')
const PriorityQueue = require('./priority-queue/PriorityQueue')

/**
 * Essa função serve para criar o texto da lista de adjacencias HTML para printar no página.
 * @param {Graph} graph 
 * @returns {String} 
 */
function printAdjList(graph) {
    console.log("printAdjList")
    var texto = ""
    graph._AdjacentList.forEach((valor, chave) => {
        var valores = [...valor].join(', ')
        texto += `${chave} => ${valores} <br>`
    })
    return texto
}

/**
 * Essa função serve para criar o texto dos vértices HTML para printar no página.
 * @param {Graph} graph 
 * @returns {String} 
 */
function printVerticesDegrees(graph) {
    console.log("printVerticesDegrees")
    var result = "" //Sera printado no frontEnd

    var arrayVertexDegress = [...graph._vertexes].map(elem => {
        return {
            index: elem,
            grau: graph.vertexDegree(elem)
        }
    })

    arrayVertexDegress.forEach((vertex) => {
        result += `[${vertex.index}]: grau ${vertex.grau}. <br>`
    })
    return result
}


/**
 * Essa função serve para cálculo do coeficiente de agrupamento médio do grafo
 * @param {Graph} graph 
 * @returns {Number} 
 */
function averageGroupingCoefficient(graph) {
    console.log("Average Grouping Coefficient")
    let totalCoeficient = 0
    graph._vertexes.forEach(vertex => {
        totalCoeficient += graph.groupingCoefficient(vertex)
    })
    return (parseFloat(totalCoeficient) / graph.totalVertexes()).toFixed(5)
}


/**
 * Essa função realiza a busca em profundidade(BFS)
 * @param {Graph} graph
 * @param {Number} rootVertex  
 * @param {Array} visitedVertexes  
 * @returns {} 
 */
function bfs(graph, rootVertex, visitedVertexes) {
    console.log("bfs")
    let queue = []
    let visited = []
    visited.push(rootVertex) //marque a raiz
    visitedVertexes.push(rootVertex)
    queue.push(rootVertex) //insira a raiz na fila
    while (queue.length) {
        let firstVertex = queue[0] //tira o primeiro elemento e o retorna
        // console.log("firstVertex: " + firstVertex)
        // console.log( graph._AdjacentList.get(firstVertex))                
        graph._AdjacentList.get(firstVertex).forEach(vertex => {
            if (!visited.includes(vertex)) {
                visited.push([firstVertex, vertex])
                visited.push(vertex) //marque o vertice
                queue.push(vertex) //insire o vertice
                visitedVertexes.push(vertex)
            } else if (queue.includes(vertex)) {
                visited.push([firstVertex, vertex])
            }
        })
        queue.shift()
    }
}

/**
 * Essa função retorna o número de componentes conexas do grafo
 * @param {Graph} graph
 * @returns {Number} 
 */
function numCompConexas(graph) {
    console.log("Numero de componentes conexas")
    let rootQueue = new Set(graph._vertexes)
    let quantity = 0
    let rootVisited = []
    let greaterComponent = []
    rootQueue.forEach(vertex => {
        let visited = []
        if (!rootVisited.includes(vertex)) {
            ++quantity
            bfs(graph, vertex, visited)
            visited.forEach(elem => rootVisited.push(elem))
            if(greaterComponent.length<visited.length)
                greaterComponent = [...visited]
        }
    })
    graph._vertexes =  new Set(greaterComponent)
    return quantity
}

/**
 * Essa função realiza o algortmo do Djikstra de escolha do melhor caminho
 * @param {Graph} graph
 * @param {Number} startVertex
 * @returns {Array} 
 */

function dijkstra(graph, startVertex) {
    console.log("dijkstra")
    const distances = []
    const visitedVertices = []
    const queue = new PriorityQueue()

    // Init all distances with infinity assuming that currently we can't reach
    // any of the vertices except start one.
    graph._vertexes.forEach((vertex) => {
        distances[vertex] = Infinity
    })
    distances[startVertex] = 0

    // Init vertices queue.
    queue.add(startVertex, distances[startVertex])
    while (!queue.isEmpty()) {
        const currentVertex = queue.poll()

        graph.neighbours(currentVertex).forEach((neighbor) => {
            // Don't visit already visited vertices.
            if (!visitedVertices[neighbor]) {
                // Update distances to every neighbor from current vertex.

                const existingDistanceToNeighbor = distances[neighbor]
                const distanceToNeighborFromCurrent = distances[currentVertex] + 1

                if (distanceToNeighborFromCurrent < existingDistanceToNeighbor) {
                    distances[neighbor] = distanceToNeighborFromCurrent
                    // Change priority.
                    if (queue.hasValue(neighbor))
                        queue.changePriority(neighbor, distances[neighbor])
                }
                // Add neighbor to the queue for further visiting.
                if (!queue.hasValue(neighbor))
                    queue.add(neighbor, distances[neighbor])
            }
        })
        // Add current vertex to visited ones.
        visitedVertices[currentVertex] = currentVertex
    }

    let resultDistances = new Array()
    distances.forEach(elem => resultDistances.push(elem))
    return resultDistances
}

/**
 * Essa função retorna o melhor caminho entre dois vertices
 * @param {Graph} graph
 * @param {Number} startVertex
 * @param {Number} finishVertex
 * @returns {Number} Menor distancia entre dois vertices
 */
function bestPath(graph, startVertex, finishVertex) {
    console.log("bestPath")
    return dijkstra(graph, startVertex)[finishVertex - 1]
}



/**
 * Essa função retorna a Ecentricidade Efetiva Média
 * @param {Graph} graph
 * @returns {Number} Menor distancia entre dois vertices
 */

function averageEffectiveEccentricity(graph) {
    console.log("Excentricidade Efetiva Média")
    let sum = 0
    graph._vertexes.forEach(vertex => {
        var resultDj = dijkstra(graph, vertex);
        var max = Math.max(...resultDj);
        sum += max
    })
    return sum / graph.totalVertexes()
}

/**
 * Essa função retorna o Diâmetro Efetivo Médio do grafo
 * @param {Graph} graph
 * @returns {Number}
 */
function effectiveDiameter(graph) {
    console.log("effectiveDiameter")
    let maxAll = 0
    graph._vertexes.forEach(vertex => {
        var resultDijkstra = dijkstra(graph, vertex)
        var max = Math.max(...resultDijkstra)
        if (max > maxAll) maxAll = max
    })
    return maxAll

}

/**
 * Essa função retorna o Raio Efetivo do grafo
 * @param {Graph} graph
 * @returns {Number}
 */
function effectiveRadius(graph) {
    console.log("effectiveRadius")
    let minAll = Infinity
    graph._vertexes.forEach(vertex => {
        var resultDijkstra = dijkstra(graph, vertex)
        var max = Math.max(...resultDijkstra)
        if (max < minAll) minAll = max
    })
    return minAll
}


/**
 * Essa função retorna a Centralidade média do grafo
 * @param {Graph} graph
 * @returns {Number}
 */
function averageCentrality(graph) {
    console.log("averageCentrality")
    let sumCentralities = 0
    let numVertices = graph.totalVertexes() - 1

    graph._vertexes.forEach(vertex => {
        let sumDist = dijkstra(graph,vertex).reduce((ac,atual) =>  ac += atual, 0)
        sumCentralities += numVertices / (sumDist / numVertices)
    })
    return (sumCentralities / numVertices).toFixed(2)
}


/**
 * Essa função retorna a porcentagem de vértices centrais do grafo
 * @param {Graph} graph
 * @returns {Number}
 */
function centralVerticesPercentage(graph) {
    console.log("centralVerticesPercentage")
    let count = 0
    graph._vertexes.forEach(vertex => {
        var resultDijkstra = dijkstra(graph, vertex)
        var max = Math.max(...resultDijkstra)
        if (max == effectiveRadius(graph))
            count++
    })
    return (count / graph.totalVertexes()) * 100
}


module.exports = {
    printAdjList,
    printVerticesDegrees,
    averageGroupingCoefficient,
    bfs,
    numCompConexas,
    dijkstra,
    bestPath,
    averageEffectiveEccentricity,
    effectiveDiameter,
    effectiveRadius,
    averageCentrality,
    centralVerticesPercentage,

}