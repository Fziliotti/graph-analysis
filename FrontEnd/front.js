const BTNREQUI = document.getElementById('btnRequi')
// const BTNREQUI = $('#btnRequi')
const INPUTELEMENT = document.getElementById('caminhosDosGrafos')
// const INPUTELEMENT = $('#caminhoGrafo')
const LOADER = document.getElementById('loader')
// const LOADER = $('#loader')
const BTNPRINT = document.getElementById('btnPrint')

const HEADER = document.getElementById('header')


// LISTENINGS DO INPUT
BTNREQUI.addEventListener('click', FazerRequisicao)

// INPUTELEMENT.addEventListener('keyup', function (e) {
//     var key = e.which || e.keyCode
//     if (key == 13) {
//         FazerRequisicao()
//     }
// })


function FazerRequisicao() {
    var caminhoGrafo = INPUTELEMENT.value //retirar os espaços do inicio e final
    if (caminhoGrafo) {
        //se o input for valido, mostrar o loader
        LOADER.style.display = "block"
        fetch("http://localhost/" + encodeURIComponent(caminhoGrafo))
            .then(d => d.json())
            .then(r => {
                if (!r.success)
                    throw new Error(r.error)
                console.log(r)
                mostrarInfosDoGrafo(r)
                //após mostrar as informações, esconder o loader
                LOADER.style.display = "none"
            })
            .catch(e => {
                swal({
                    type: 'error',
                    title: 'Opss...',
                    text: "ERRO: " + e.message
                })
                LOADER.style.display = "none"

            })
    } else {
        swal({
            type: 'error',
            title: 'Oops...',
            text: 'Digite alguma coisa na caixa de texto!',
        })
        INPUTELEMENT.focus()

    }

}

function printarpagina() {
    HEADER.style.display = "none"
    requestAnimationFrame(() => {
        window.print()
        HEADER.style.display = "block"
    })

}

function mostrarInfosDoGrafo(r) {
    BTNPRINT.style.display = "block"
    var resp = document.getElementById('respostas')
    resp.innerHTML = `
        <header>
            GRAFO DO ARQUIVO ${r.path}
        </header>

        <div>
            ${r.img ?  `<img src="${r.img}" </img>` :  null}
        </div>

        <div>
            O grafo possui ${r.info.totalEdges} arestas.
        </div>

        <div>
            O grafo possui ${r.info.totalVertexes} vértices.
        </div>

        <div>
            O grau do vértice 2 é ${r.info.vertexDegree}.
        </div>

        <div>
            O grau médio do grafo é ${r.info.mediumDegree}.
        </div>

        <div>
            A densidade do grafo é ${r.info.graphDensity}.
        </div>

        <div>
            O Coeficiente de agrupamento médio é ${r.info.avGroupCoef}.
        </div>

        <div>
            O número de componentes conexas é ${r.info.numCompConexas}.
        </div>

        <div>
            A Excentricidade efetiva média é ${r.info.averageEFEC}.
        </div>

            <div>
            O Diâmetro efetivo é ${r.info.effectiveDiameter}.
        </div>

        <div>
            O Raio efetivo é ${r.info.effectiveRadius}.
        </div>

        <div>
            A Centralidade média é ${r.info.averageCentrality}.
        </div>

        <div>
            O Percentual de vértices centrais é ${r.info.centralVerticesPercentage}%.
        </div>

        <div>
            A lista de adjacencias é: <br> ${r.info.printAdjList}.
        </div>

        <div>
            Os graus dos vértices são: <br> ${r.info.printVertexDegrees}.
        </div>

        
  `

}

/*

 */