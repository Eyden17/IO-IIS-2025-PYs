import React, { useState } from "react";

export default function Algoritmo_3() {
  const [llaves, setLlaves] = useState("");
  const [modal, setModal] = useState(false);
  const [nombres, setNombres] = useState([]);
  const [pesos, setPesos] = useState([]); 

  const [modalpeso, setModalpeso] = useState(false);

  const abrirModal = (num) => {
    if (num <= 10 && num >= 1) {
      setModal(true);
      setLlaves(num);
      setNombres(Array(Number(num)).fill(""));
      setPesos(Array(Number(num)).fill("")); 
    }
    else {
      alert("Ingrese un número entre 1 y 10");
    }   
  };

  const actualizarNombre = (index, valor) => {
    const copia = [...nombres];
    copia[index] = valor;
    setNombres(copia);
  };

  const actualizarPeso = (index, valor) => {
    const copia = [...pesos];
    copia[index] = valor;
    setPesos(copia);
  };

  return (
    <div>
      <h2>Algoritmo 3</h2>

      <input
        type="number"
        placeholder="valor"
        value={llaves}
        onChange={(e) => setLlaves(e.target.value)}
      />

      <button onClick={() => abrirModal(llaves)}>
        llaves
      </button>

      {modal && (
        <div>
          <h3>Ingrese {llaves} nombres y pesos</h3>

          {nombres.map((nombre, i) => (
            <div key={i} style={{ marginBottom: "10px" }}>

              <input
                type="text"
                placeholder={`Nombre`}
                value={nombre}
                onChange={(e) => actualizarNombre(i, e.target.value)}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Peso"
                value={pesos[i]}
                onChange={(e) => actualizarPeso(i, e.target.value)}
                style={{ marginLeft: "10px" }}
              />
            </div>
          ))}

          <button onClick={() => console.log({ nombres, pesos })}>Guardar</button>
        </div>
      )}
    </div>
  );
}
