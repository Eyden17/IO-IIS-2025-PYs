import { Link } from "react-router-dom";
import React from "react";

export default function Menu() {
  return (
    <div>
      <button>
        <Link to="/">Algoritmo 1</Link>
      </button>

      <button>
        <Link to="/algoritmo_3">Algoritmo 3</Link>
      </button>

      <button>
        <Link to="/">Algoritmo 3</Link>
      </button>
    </div>
  );
}
