import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trophy, Play, RotateCcw, Home, Plane, Upload ,FolderUp} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

const SeriesDeportivas = () => {

  // Estados base
  const [n, setN] = useState(7);
  const [ph, setPh] = useState(0.6);
  const [pr, setPr] = useState(0.5);

  const [homeGames, setHomeGames] = useState<boolean[]>(Array(7).fill(true));

  const [results, setResults] = useState<{
    table: number[][],
    pA: number,
    pB: number
  } | null>(null);

  const [fileName, setFileName] = useState("");



  const cargarJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/json") {
      toast.error("Debe seleccionar un archivo JSON válido");
      return;
    }

    const reader = new FileReader();
    reader.onload = ({ target }) => {
      try {
        const data = JSON.parse(target!.result as string);

        if (!data.n || !data.ph || !data.pr || !data.homeGames) {
          toast.error("El JSON debe tener: n, ph, pr, homeGames[]");
          return;
        }

        setN(data.n);
        setPh(data.ph);
        setPr(data.pr);
        setHomeGames(data.homeGames);

        setFileName(file.name);

        setResults(null);
        toast.success("Archivo JSON cargado correctamente");

      } catch (err) {
        toast.error("Error al leer el archivo JSON");
      }
    };

    reader.readAsText(file);
  };


  const updateN = (value: number) => {
    setN(value);
    setHomeGames(Array(value).fill(true));
    setResults(null);
  };

  const toggleHomeGame = (index: number) => {
    const newHomeGames = [...homeGames];
    newHomeGames[index] = !newHomeGames[index];
    setHomeGames(newHomeGames);
    setResults(null);
  };

  const calculateSeries = () => {
    if (ph <= 0 || ph >= 1 || pr <= 0 || pr >= 1) {
      toast.error("Las probabilidades deben estar entre 0 y 1");
      return;
    }

    const winsNeeded = Math.ceil(n / 2);
    const P: number[][] = Array.from({ length: winsNeeded + 1 },
      () => Array(winsNeeded + 1).fill(0)
    );

    P[0][0] = null as any;
    
    for (let b = 1; b <= winsNeeded; b++) P[0][b] = 1;
    for (let a = 1; a <= winsNeeded; a++) P[a][0] = 0;

    for (let a = 1; a <= winsNeeded; a++) {
      for (let b = 1; b <= winsNeeded; b++) {

        const gamesPlayed = (winsNeeded - a) + (winsNeeded - b);

        if (gamesPlayed >= n) {
          P[a][b] = 0;
          continue;
        }

        const isAHome = homeGames[gamesPlayed];
        const pAwin = isAHome ? ph : pr;

        P[a][b] = pAwin * P[a - 1][b] + (1 - pAwin) * P[a][b - 1];
      }
    }

    setResults({
      table: P,
      pA: P[winsNeeded][winsNeeded],
      pB: 1 - P[winsNeeded][winsNeeded]
    });

    toast.success("Cálculo completado");
  };


  const handleReset = () => {
    setN(7);
    setPh(0.6);
    setPr(0.5);
    setHomeGames(Array(7).fill(true));
    setResults(null);
    setFileName("");
  };

  const winsNeeded = Math.ceil(n / 2);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="icon" className="hover:bg-primary/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Series Deportivas</h1>
          </div>
        </div>

        {/* Configuración */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Configuración de la Serie</CardTitle>
            <CardDescription>
              Define los parámetros de la serie deportiva, formato local/visita o carga un archivo JSON
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">

            {/* === GRID: JSON + N === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* === CARGAR JSON === */}
           <div className="space-y-2">
  <Label className="font-medium">Cargar desde JSON</Label>

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
    className="flex items-center justify-center gap-2 w-full h-12 text-base"
    onClick={() => document.getElementById("fileInput")!.click()}
  >
    <FolderUp className="w-5 h-5" />
    <span>Cargar archivo JSON</span>
  </Button>

  {fileName && (
    <p className="text-sm text-muted-foreground">
      Archivo: <span className="font-medium">{fileName}</span>
    </p>
  )}
</div>

              {/* === SLIDER N === */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">
                    Número máximo de juegos (n)
                  </Label>
                  <span className="text-2xl font-bold text-primary">{n}</span>
                </div>
                <Slider
                  value={[n]}
                  onValueChange={(value) => updateN(value[0])}
                  min={2}
                  max={11}
                  step={1}
                />
              </div>

            </div>

            {/* === PROBABILIDADES === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* ph */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium cursor-help">
                    ph – Probabilidad A en casa
                  </Label>
                  <Badge variant="outline">{ph.toFixed(2)}</Badge>
                </div>

                <Input
                  type="number"
                  min="0.01"
                  max="0.99"
                  step="0.01"
                  value={ph}
                  onChange={(e) => {
                    setPh(parseFloat(e.target.value) || 0);
                    setResults(null);
                  }}
                />

                <p className="text-xs text-muted-foreground">
                  qr = {(1 - ph).toFixed(2)} (B gana de visita)
                </p>
              </div>

              {/* pr */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium cursor-help">
                    pr – Probabilidad A de visita
                  </Label>
                  <Badge variant="outline">{pr.toFixed(2)}</Badge>
                </div>

                <Input
                  type="number"
                  min="0.01"
                  max="0.99"
                  step="0.01"
                  value={pr}
                  onChange={(e) => {
                    setPr(parseFloat(e.target.value) || 0);
                    setResults(null);
                  }}
                />

                <p className="text-xs text-muted-foreground">
                  qh = {(1 - pr).toFixed(2)} (B gana en casa)
                </p>
              </div>

            </div>

            {/* === FORMATO LOCAL/VISITA === */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Formato de la Serie</Label>
              <p className="text-sm text-muted-foreground">
                Haz clic en cada juego para alternar entre A LOCAL y A VISITA
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {homeGames.map((isHome, index) => (
                  <Button
                    key={index}
                    variant={isHome ? "default" : "secondary"}
                    className="flex flex-col h-auto py-3 gap-1"
                    onClick={() => toggleHomeGame(index)}
                  >
                    {isHome
                      ? <Home className="h-5 w-5" />
                      : <Plane className="h-5 w-5" />
                    }
                    <span className="text-xs">Juego {index + 1}</span>
                    <span className="text-[10px] font-normal">
                      {isHome ? "A LOCAL" : "A VISITA"}
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            {/* === BOTONES === */}
            <div className="flex gap-3">
              <Button onClick={calculateSeries} className="flex-1 h-12 text-base">
                <Play className="mr-2 h-5 w-5" />
                Calcular Probabilidades
              </Button>

              <Button
                onClick={handleReset}
                variant="outline"
                size="lg"
                className="h-12"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* === RESULTADOS === */}
        {results && (
          <>
            {/* === RESUMEN RÁPIDO === */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-2 border-primary/20 bg-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Probabilidad A gane
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">
                    {(results.pA * 100).toFixed(2)}%
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-destructive/20 bg-destructive/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Probabilidad B gane
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-destructive">
                    {(results.pB * 100).toFixed(2)}%
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-secondary/20 bg-secondary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Juego decisivo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-secondary-foreground">
                    {(results.table[winsNeeded - 1][winsNeeded - 1] * 100).toFixed(2)}%
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* === TABLA === */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Tabla de Probabilidades</CardTitle>
                <CardDescription>
                  Probabilidad de cada estado (i victorias A, j victorias B)
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ScrollArea className="h-[400px] w-full rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="sticky left-0 bg-background z-10 w-20">
                          A \ B
                        </TableHead>

                        {Array.from({ length: winsNeeded + 1 }, (_, j) => (
                          <TableHead key={j} className="text-center min-w-[100px]">
                            {j}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {results.table.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell className="sticky left-0 bg-background z-10 font-medium">
                            {i}
                          </TableCell>

                          {row.map((prob, j) => (
                            <TableCell
                              key={j}
                              className={`text-center ${
                                prob > 0
                                  ? i === winsNeeded
                                    ? "bg-primary/10 font-semibold"
                                    : j === winsNeeded
                                    ? "bg-destructive/10 font-semibold"
                                    : "bg-muted/30"
                                  : ""
                              }`}
                            >
                              {i === 0 && j === 0
                                ? "-"
                                : prob > 0
                                ? (prob * 100).toFixed(2) + "%"
                                : "0%"}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );

};

export default SeriesDeportivas;
