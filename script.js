let tablero;
let jugadorActual;
let juegoActivo;
let tiempoInicio;
let temporizador;
let modoJuego = 'jugador';
let dificultad = 'facil';

const combinacionesGanadoras = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
    [0, 4, 8], [2, 4, 6]             // Diagonales
];

const celdas = document.querySelectorAll('.celda');
const estadoJuego = document.getElementById('estado');
const reiniciarBtn = document.getElementById('reiniciar');
const tiempoElement = document.getElementById('tiempo');
const victoriasXElement = document.getElementById('victoriasX');
const victoriasOElement = document.getElementById('victoriasO');
const empatesElement = document.getElementById('empates');
const reiniciarEstadisticasBtn = document.getElementById('reiniciarEstadisticas');

let victoriasX = 0;
let victoriasO = 0;
let empates = 0;

iniciarJuego();

celdas.forEach(celda => celda.addEventListener('click', () => realizarMovimiento(celda.dataset.index)));
reiniciarBtn.addEventListener('click', iniciarJuego);
reiniciarEstadisticasBtn.addEventListener('click', reiniciarEstadisticas);

document.getElementById('modoJuego').addEventListener('change', function(e) {
    modoJuego = e.target.value;
    iniciarJuego();
});

document.getElementById('dificultad').addEventListener('change', function(e) {
    dificultad = e.target.value;
});

function iniciarJuego() {
    tablero = ['', '', '', '', '', '', '', '', ''];
    jugadorActual = 'X';
    juegoActivo = true;
    document.querySelectorAll('.celda').forEach(celda => {
        celda.textContent = '';
        celda.classList.remove('ganadora');
    });
    actualizarEstado(`Turno del jugador ${jugadorActual}`);
    tiempoInicio = Date.now();
    actualizarTiempo();
    temporizador = setInterval(actualizarTiempo, 1000);
}

function realizarMovimiento(indice) {
    if (tablero[indice] === '' && juegoActivo) {
        tablero[indice] = jugadorActual;
        document.getElementsByClassName('celda')[indice].textContent = jugadorActual;
        
        if (verificarVictoria()) {
            finalizarJuego(false);
        } else if (!tablero.includes('')) {
            finalizarJuego(true);
        } else {
            jugadorActual = jugadorActual === 'X' ? 'O' : 'X';
            actualizarEstado(`Turno del jugador ${jugadorActual}`);
            
            if (modoJuego === 'computadora' && jugadorActual === 'O') {
                setTimeout(() => {
                    realizarMovimientoComputadora();
                }, 500);
            }
        }
    }
}

function verificarVictoria() {
    for (let combinacion of combinacionesGanadoras) {
        if (
            tablero[combinacion[0]] &&
            tablero[combinacion[0]] === tablero[combinacion[1]] &&
            tablero[combinacion[0]] === tablero[combinacion[2]]
        ) {
            combinacion.forEach(index => {
                document.getElementsByClassName('celda')[index].classList.add('ganadora');
            });
            return true;
        }
    }
    return false;
}

function finalizarJuego(empate) {
    juegoActivo = false;
    clearInterval(temporizador);
    if (empate) {
        actualizarEstado('¡Juego empatado!');
        empates++;
        empatesElement.textContent = empates;
    } else {
        actualizarEstado(`¡El jugador ${jugadorActual} ha ganado!`);
        if (jugadorActual === 'X') {
            victoriasX++;
            victoriasXElement.textContent = victoriasX;
        } else {
            victoriasO++;
            victoriasOElement.textContent = victoriasO;
        }
    }
}

function actualizarEstado(mensaje) {
    estadoJuego.textContent = mensaje;
}

function actualizarTiempo() {
    const tiempoTranscurrido = Math.floor((Date.now() - tiempoInicio) / 1000);
    const minutos = Math.floor(tiempoTranscurrido / 60);
    const segundos = tiempoTranscurrido % 60;
    tiempoElement.textContent = `Tiempo: ${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
}

function reiniciarEstadisticas() {
    victoriasX = 0;
    victoriasO = 0;
    empates = 0;
    victoriasXElement.textContent = '0';
    victoriasOElement.textContent = '0';
    empatesElement.textContent = '0';
}

function realizarMovimientoComputadora() {
    if (!juegoActivo) return;
    
    let indice;
    if (dificultad === 'dificil') {
        indice = obtenerMejorMovimiento();
    } else {
        indice = obtenerMovimientoAleatorio();
    }
    
    realizarMovimiento(indice);
}

function obtenerMovimientoAleatorio() {
    const celdasVacias = tablero
        .map((celda, index) => celda === '' ? index : null)
        .filter(index => index !== null);
    
    return celdasVacias[Math.floor(Math.random() * celdasVacias.length)];
}

function obtenerMejorMovimiento() {
    let mejorPuntaje = -Infinity;
    let mejorMovimiento;
    
    for (let i = 0; i < tablero.length; i++) {
        if (tablero[i] === '') {
            tablero[i] = 'O';
            let puntaje = minimax(tablero, 0, false);
            tablero[i] = '';
            
            if (puntaje > mejorPuntaje) {
                mejorPuntaje = puntaje;
                mejorMovimiento = i;
            }
        }
    }
    
    return mejorMovimiento;
}

function minimax(tablero, profundidad, esMaximizando) {
    const resultado = verificarGanadorMinimax();
    if (resultado !== null) {
        return resultado;
    }
    
    if (esMaximizando) {
        let mejorPuntaje = -Infinity;
        for (let i = 0; i < tablero.length; i++) {
            if (tablero[i] === '') {
                tablero[i] = 'O';
                let puntaje = minimax(tablero, profundidad + 1, false);
                tablero[i] = '';
                mejorPuntaje = Math.max(puntaje, mejorPuntaje);
            }
        }
        return mejorPuntaje;
    } else {
        let mejorPuntaje = Infinity;
        for (let i = 0; i < tablero.length; i++) {
            if (tablero[i] === '') {
                tablero[i] = 'X';
                let puntaje = minimax(tablero, profundidad + 1, true);
                tablero[i] = '';
                mejorPuntaje = Math.min(puntaje, mejorPuntaje);
            }
        }
        return mejorPuntaje;
    }
}

function verificarGanadorMinimax() {
    for (let combinacion of combinacionesGanadoras) {
        const [a, b, c] = combinacion;
        if (tablero[a] && tablero[a] === tablero[b] && tablero[a] === tablero[c]) {
            return tablero[a] === 'O' ? 10 : -10;
        }
    }
    
    if (!tablero.includes('')) {
        return 0;
    }
    
    return null;
}