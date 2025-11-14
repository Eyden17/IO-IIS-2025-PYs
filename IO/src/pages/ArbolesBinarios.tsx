import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FolderUp, Layers, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";



const sumaPesos = (pesos) => {
  let total = 0;
  pesos.forEach((peso) => {
    total += parseFloat(peso);
  });
  return total;
};

const calcularProbabilidades = (pesos) => {
  const suma = sumaPesos(pesos);
  return pesos.map((peso) => parseFloat(peso) / suma);
};

export default function ArbolOptimoBusqueda() {
  const [numLlaves, setNumLlaves] = useState(3);
  const [nombres, setNombres] = useState(["A", "B", "C"]);
  const [pesos, setPesos] = useState([10, 20, 30]);

  const [llavesOrdenadas, setLlavesOrdenadas] = useState([]);
  const [pesosOrdenados, setPesosOrdenados] = useState([]);
  const [tablaA, setTablaA] = useState([]);
  const [tablaR, setTablaR] = useState([]);

  const [fileName, setFileName] = useState("");

  const cargarJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/json") {
      toast.error("Debe seleccionar un archivo JSON válido");
      return;
    }
      setNombres([]);
      setPesos([]);
      setLlavesOrdenadas([]);

    const reader = new FileReader();
    reader.onload = ({ target }) => {
      try {
        const data = JSON.parse(target.result);

        if (!data.nombres || !data.pesos) {
          toast.error("El JSON debe contener { nombres:[], pesos:[] }");
          return;
        }
        setNumLlaves(data.nombres.length);
        setNombres(data.nombres);
        setPesos(data.pesos);
        toast.success("Archivo cargado correctamente");

      } catch (err) {
        toast.error("Error leyendo el archivo JSON");
      }
    };

    reader.readAsText(file);
  };


  const updateNombre = (i, value) => {
    const copia = [...nombres];
    copia[i] = value;
    setNombres(copia);
  };

  const updatePeso = (i, value) => {
    const copia = [...pesos];
    copia[i] = value;
    setPesos(copia);
  };

  const calcularArbol = () => {
    const llaves = nombres.map((n, i) => ({
      nombre: n,
      peso: parseFloat(pesos[i] || 0),
    }));

    const ordenadas = [...llaves].sort((a, b) => a.nombre.localeCompare(b.nombre));
    const nombresOrd = ordenadas.map((x) => x.nombre);
    const pesosOrd = ordenadas.map((x) => x.peso);

    const p = calcularProbabilidades(pesosOrd);
    const n = p.length;
    const A = Array.from({ length: n }, () => Array(n).fill(0));
    const R = Array.from({ length: n }, () => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      A[i][i] = p[i];
      R[i][i] = i;
    }
    for (let len = 2; len <= n; len++) {
      for (let i = 0; i <= n - len; i++) {
        const j = i + len - 1;
        A[i][j] = Infinity;

        const suma = p.slice(i, j + 1).reduce((acc, x) => acc + x, 0);

        for (let k = i; k <= j; k++) {
          const costo = (k > i ? A[i][k - 1] : 0) +
                        (k < j ? A[k + 1][j] : 0) +
                        suma;

          if (costo < A[i][j]) {
            A[i][j] = costo;
            R[i][j] = k;
          }
        }
      }
    }

    setLlavesOrdenadas(nombresOrd);
    setPesosOrdenados(pesosOrd);
    setTablaA(A);
    setTablaR(R);

    toast.success("Árbol óptimo calculado");
  };


  const updateNumLlaves = (value) => {
    setNumLlaves(value);

    const nuevosNom = [...nombres];
    const nuevosPes = [...pesos];

    nuevosNom.length = value;
    nuevosPes.length = value;

    for (let i = 0; i < value; i++) {
      if (!nuevosNom[i]) nuevosNom[i] = "";
      if (!nuevosPes[i]) nuevosPes[i] = 1;
    }

    setNombres(nuevosNom);
    setPesos(nuevosPes);
  };

  return (
  <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4 md:p-8">

    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/">
          <Button variant="outline" size="icon" className="hover:bg-primary/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Layers className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">
            Árbol Binario de Búsqueda Óptimo
          </h1>
        </div>
      </div>
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Configuración</CardTitle>
          <CardDescription>
            Ingresa las llaves manualmente o carga un archivo JSON
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="font-medium">Cargar desde JSON</Label>

              <div className="flex flex-col gap-2">
                <input
                  id="fileInput"
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={(e) => {
                    cargarJSON(e);
                    setFileName(e.target.files?.[0]?.name || "");
                  }}
                />
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <FolderUp className="w-5 h-5" />
                  Cargar archivo JSON
                </Button>
                {fileName && (
                  <p className="text-sm text-muted-foreground">
                    Archivo cargado:{" "}
                    <span className="font-medium">{fileName}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Número de llaves</Label>
                <span className="text-2xl font-bold text-primary">{numLlaves}</span>
              </div>

              <Slider
                value={[numLlaves]}
                onValueChange={(v) => updateNumLlaves(v[0])}
                min={1}
                max={10}
              />
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: numLlaves }).map((_, i) => (
              <Card key={i} className="bg-muted/50 border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Llave {i + 1}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <Label>Nombre</Label>
                    <Input
                      value={nombres[i] || ""}
                      onChange={(e) => updateNombre(i, e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label>Peso</Label>
                    <Input
                      type="number"
                      value={pesos[i] || ""}
                      onChange={(e) => updatePeso(i, e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Botón Calcular */}
          <div className="flex flex-col gap-3">
            <Button onClick={calcularArbol} className="h-12 text-base">
              <Play className="mr-2 h-5 w-5" />
              Calcular Árbol Óptimo
            </Button>
          </div>

        </CardContent>
      </Card>


      {/* ====================== RESULTADOS ======================= */}

      {llavesOrdenadas.length > 0 && (
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Resultados</CardTitle>
            <CardDescription>
              Llaves ordenadas y tablas del algoritmo
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">

            {/* Llaves ordenadas */}
            <div>
              <Label className="text-sm">Llaves Ordenadas</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                {llavesOrdenadas.map((n, i) => (
                  <div key={i} className="p-3 bg-background border rounded-lg">
                    <p className="font-medium">{n}</p>
                    <p className="text-xs text-muted-foreground">
                      Peso: {pesosOrdenados[i]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-medium">Tabla A (Costos)</Label>
                <div className="overflow-auto border rounded-lg">
                  <table className="w-full text-center text-sm">
                    <thead>
                      <tr>
                        <th></th>
                        {llavesOrdenadas.map((_, i) => (
                          <th key={i}>{i + 1}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tablaA.map((fila, i) => (
                        <tr key={i}>
                          <th>{i + 1}</th>
                          {fila.map((v, j) => (
                            <td key={j}>{v.toFixed(3)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-medium">Tabla R (Raíces)</Label>
                <div className="overflow-auto border rounded-lg">
                  <table className="w-full text-center text-sm">
                    <thead>
                      <tr>
                        <th></th>
                        {llavesOrdenadas.map((_, i) => (
                          <th key={i}>{i + 1}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tablaR.map((fila, i) => (
                        <tr key={i}>
                          <th>{i + 1}</th>
                          {fila.map((v, j) => (
                            <td key={j}>{v + 1}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  </div>
);

}
