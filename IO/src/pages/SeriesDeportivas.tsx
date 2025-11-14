import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trophy, Play, RotateCcw, Home, Plane } from "lucide-react";
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
  const [n, setN] = useState(7);          // Numero máximo de juegos
  const [ph, setPh] = useState(0.6);      // Probabilidad de A ganando en casa
  const [pr, setPr] = useState(0.5);      // Probabilidad de A ganando de visita
  const [homeGames, setHomeGames] = useState<boolean[]>(Array(7).fill(true));
  const [results, setResults] = useState<{ table: number[][], pA: number, pB: number } | null>(null);

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
      toast.error("Las probabilidades deben estar entre 0 y 1 (exclusivo)");
      return;
    }

    // n = maximo de juegos, winsNeeded = juegos que necesita ganar un equipo
    const winsNeeded = Math.ceil(n / 2);

    // P[a][b] = probabilidad de que A GANE LA SERIE
    // partiendo del estado donde A necesita a victorias y B necesita b victorias.

    const P: number[][] = Array.from({ length: winsNeeded + 1 }, () =>
      Array(winsNeeded + 1).fill(0)
    );


    P[0][0] = null;

    // Condiciones
    // PRIMERA FILA VAN 1
    for (let b = 1; b <= winsNeeded; b++) {
      P[0][b] = 1; // A ya ganó la serie
    }

    // PRIMERA COLUMNA VAN 0
    for (let a = 1; a <= winsNeeded; a++) {
      P[a][0] = 0; // B ya ganó la serie
    }

    // Rellenar la tabla interna:
    // a = victorias que le faltan a A
    // b = victorias que le faltan a B
    // desde (1,1) hasta (winsNeeded, winsNeeded)
    for (let a = 1; a <= winsNeeded; a++) {
      for (let b = 1; b <= winsNeeded; b++) {

        // Cuantos juegos se han jugado hasta esta casilla?
        const winsA_so_far = winsNeeded - a;
        const winsB_so_far = winsNeeded - b;
        const gamesPlayed = winsA_so_far + winsB_so_far;

        // Si ya no hay juegos disponibles pero nadie ha llegado a 0,
        // este estado es imposible → prob = 0.
        if (gamesPlayed >= n) {
          P[a][b] = 0;
          continue;
        }

        // A juega en casa o visita?
        const isAHome = homeGames[gamesPlayed];
        alert(ph)

        const pWinA = isAHome ? ph : pr;

        // Formula: M[i-1][j] * probA + M[i][j-1] * probB
        P[a][b] = P[a - 1][b] * pWinA + P[a][b - 1] * (1 - pWinA);
      }
    }

    const pA = P[winsNeeded][winsNeeded];
    const pB = 1 - pA;

    setResults({
      table: P,
      pA,
      pB,
    });

    toast.success("Cálculo completado");
  };


    const handleReset = () => {
      setN(7);
      setPh(0.6);
      setPr(0.5);
      setHomeGames(Array(7).fill(true));
      setResults(null);
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

        {/* Configuracion */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Configuración de la Serie</CardTitle>
            <CardDescription>
              Define los parámetros de la serie deportiva y el formato local/visitante
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Num de juegos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label className="text-base font-medium cursor-help">Número Máximo de Juegos (n)</Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Cantidad máxima de juegos que puede durar la serie</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="text-2xl font-bold text-primary">{n}</span>
              </div>
              <Slider
                value={[n]}
                onValueChange={(value) => updateN(value[0])}
                min={2}
                max={11}
                step={1}
                className="w-full"
              />
            </div>

            {/* Probabilidades */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label className="text-sm font-medium cursor-help">ph - Probabilidad A en Casa</Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Probabilidad de que el equipo A gane jugando de local</p>
                        <p className="text-xs text-muted-foreground mt-1">qr = 1 - ph (B gana de visita)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
                <p className="text-xs text-muted-foreground">qr = {(1 - ph).toFixed(2)} (B gana de visita)</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label className="text-sm font-medium cursor-help">pr - Probabilidad A de Visita</Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Probabilidad de que el equipo A gane jugando de visitante</p>
                        <p className="text-xs text-muted-foreground mt-1">qh = 1 - pr (B gana en casa)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
                <p className="text-xs text-muted-foreground">qh = {(1 - pr).toFixed(2)} (B gana en casa)</p>
              </div>
            </div>

            {/* Formato de la serie */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Formato de la Serie</Label>
              <p className="text-sm text-muted-foreground">
                Haz clic en cada juego para alternar entre A LOCAL y A VISITANTE
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {homeGames.map((isHome, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isHome ? "default" : "secondary"}
                          className="flex flex-col h-auto py-3 gap-1"
                          onClick={() => toggleHomeGame(index)}
                        >
                          {isHome ? <Home className="h-5 w-5" /> : <Plane className="h-5 w-5" />}
                          <span className="text-xs">Juego {index + 1}</span>
                          <span className="text-[10px] font-normal">
                            {isHome ? "A LOCAL" : "A VISITA"}
                          </span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isHome ? "Equipo A juega de local" : "Equipo A juega de visitante"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <Button onClick={calculateSeries} className="flex-1 h-12 text-base" size="lg">
                <Play className="mr-2 h-5 w-5" />
                Calcular Probabilidades
              </Button>
              <Button onClick={handleReset} variant="outline" size="lg" className="h-12">
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <>
            {/* Cards resumen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-2 border-primary/20 bg-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Probabilidad Equipo A Gana</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">{(results.pA * 100).toFixed(2)}%</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-destructive/20 bg-destructive/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Probabilidad Equipo B Gana</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-destructive">{(results.pB * 100).toFixed(2)}%</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-secondary/20 bg-secondary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Juego Decisivo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-secondary-foreground">
                    {(results.table[winsNeeded - 1][winsNeeded - 1] * 100).toFixed(2)}%
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tabla de Probabilidades */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Tabla de Probabilidades</CardTitle>
                <CardDescription>
                  Probabilidad de cada estado (i victorias de A, j victorias de B)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="sticky left-0 bg-background z-10 w-20">A \ B</TableHead>
                        {Array.from({ length: winsNeeded + 1 }, (_, j) => (
                          <TableHead key={j} className="text-center min-w-[100px]">
                            {j} {j === winsNeeded}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.table.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell className="sticky left-0 bg-background z-10 font-medium">
                            {i} {i === winsNeeded}
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
                                  : "0%"
                              }
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
