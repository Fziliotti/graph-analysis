const operationsGraph = require("../services/operationsGraph");

class Graph {
    constructor(vertexesFromFile) {
        this._numEdges = 0
        this._vertexes = new Set()
        this._AdjacentList = new Map()

        vertexesFromFile.map(vertex => {
            this._AdjacentList.set(vertex, new Set())
        })
    }

    insertEdge(n1, n2) {
        if (!this.existEdge(n1, n2)) {
            // console.log("foi inserido " + n1 + " =>" + n2)
            this._AdjacentList.get(n1).add(n2)
            this._AdjacentList.get(n2).add(n1)
            this._numEdges++
            this._vertexes.add(n1)
            this._vertexes.add(n2)
            return this //somente para poder encadear funcoes após usar esse metodo
        }
    }

    totalEdges(){
        return this._numEdges;
    }

    existEdge(n1, n2) {
        return this._AdjacentList.get(n1).has(n2)
    }

    vertexes() {
        return this._vertexes
    }

    totalVertexes() {
        return this._vertexes.size
    }

    vertexDegree(vertex) {
        if (!this._vertexes.has(vertex))
            return 0;
        // como vertexes eh um Set, ele nao aceita usar reduce,logo temos que transformar o set para array
        // no reduce o primeiro parametro é a funcao e o segundo sera o valor inicial do acumulador
        return [...this._vertexes].reduce((b, a) => b + (this.existEdge(vertex, a) ? 1 : 0), 0)
    }

    mediumDegree() {
        let medium = 0
        this._vertexes.forEach(vertex => medium += this.vertexDegree(vertex))
        return Math.floor(medium / this._vertexes.size)
    }

    graphDensity() {
        let numVertices = this.totalVertexes()
        let numArestas = this._numEdges
        return Math.floor(2 * numArestas / numVertices * (numVertices - 1))
    }

    neighbours(vertex) {
        if (!this._vertexes.has(vertex))
            throw new Error("Vertice não existente no conjunto de vertices do grafo")
        return this._AdjacentList.get(vertex)

    }

    
    qtdNeighbours(vertex) {
        return this.neighbours(vertex).size
    }

    neighboursConnectedPairs(vertex) {
        let count = 0
        let neighbours = this.neighbours(vertex)
        neighbours.forEach(neighbour => {
            this._AdjacentList.get(neighbour)
            neighbours.forEach(subNeighbours => {
                if (this.existEdge(neighbour, subNeighbours))
                    count++
            })
        })
        return count / 2
    }

    groupingCoefficient(vertex) {
        let numNeighbours = this.qtdNeighbours(vertex)
        let coef = 0
        if (numNeighbours > 1) {
            coef = ((2 * this.neighboursConnectedPairs(vertex)) / (numNeighbours * (numNeighbours - 1))).toFixed(2)
        }
        return parseFloat(coef)
    }



    averageGroupingCoefficient() {
        let totalCoeficient = 0
        this._vertexes.forEach(vertex => {
            totalCoeficient += this.groupingCoefficient(vertex)
        })
        return (parseFloat(totalCoeficient) / this.totalVertexes()).toFixed(2)
    }

    isExtremeVertice(vertex) {
        return (this.vertexDegree(vertex) === 1)
    }

    extremesPercentage() {
        let totalExtremeVertices = 0
        this._vertexes.forEach(vertex => {
            if (this.isExtremeVertice(vertex))
                totalExtremeVertices++
        })
        return totalExtremeVertices / this.totalVertexes()
    }
    // biggest: Array.from(vertexes).reduce((a, b) => Math.max(a, b)),
    //    lowest: Array.from(vertexes).reduce((a, b) => Math.min(a, b))
     mountGraph(){
        return {
            // ATRIBUTOS DO OBJETO RETORNADO COMO RESPOSTA
            totalEdges: this.totalEdges(),
            totalVertexes: this.totalVertexes(),
            vertexDegree: this.vertexDegree(2),
            mediumDegree: this.mediumDegree(),
            graphDensity:  this.graphDensity(),
            avGroupCoef: this.averageGroupingCoefficient(),
            neighbours: this.qtdNeighbours(5),
            
            // metodos do operationsGraph
            printAdjList:  operationsGraph.printAdjList(this),
            printVertexDegrees:   operationsGraph.printVerticesDegrees(this),
            numCompConexas:  operationsGraph.numCompConexas(this),

            averageEFEC:  operationsGraph.averageEffectiveEccentricity(this),
            effectiveDiameter:  operationsGraph.effectiveDiameter(this),
            effectiveRadius:  operationsGraph.effectiveRadius(this),
            averageCentrality:  operationsGraph.averageCentrality(this),
            centralVerticesPercentage:  operationsGraph.centralVerticesPercentage(this),
        }
    }

}

module.exports = Graph