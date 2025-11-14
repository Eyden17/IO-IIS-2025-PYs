import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calculator, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table";

type Plan = number[]; // lista de años de reemplazo (inicio de cada periodo de uso)

const format = (n: number) => Number.isFinite(n) ? n.toFixed(2) : "-";

const ReemplazoEquipos: React.FC = () => {
  const [initialCost, setInitialCost] = useState<number>(1000);
  const [projectTerm, setProjectTerm] = useState<number>(10);
  const [life, setLife] = useState<number>(4);
  const [inflationActive, setInflationActive] = useState<boolean>(false);
  const [inflationRate, setInflationRate] = useState<number>(0.0);

  // arrays indexed 1..life, stored as 0..life-1
  const [resale, setResale] = useState<number[]>(() => Array(10).fill(0).map((_,i)=> Math.max(0, 1000 - 200*(i+1))));
  const [maint, setMaint] = useState<number[]>(() => Array(10).fill(0).map((_,i)=> 100 + 50*(i)));

  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlanIdx, setSelectedPlanIdx] = useState<number>(0);
  const [analysis, setAnalysis] = useState<{ G: number[]; choices: number[][] }>({ G: [], choices: [] });

  const ensureSize = (arr: number[], size: number) => {
    const copy = arr.slice(0, size);
    while (copy.length < size) copy.push(0);
    return copy;
  };

  const compute = () => {
    const T = Math.max(1, Math.min(30, Math.round(projectTerm)));
    const L = Math.max(1, Math.min(10, Math.round(life)));
    let P = Number(initialCost || 0);
    const resaleArr = ensureSize(resale, L);
    const maintArr = ensureSize(maint, L);
    const inflation = inflationRate;

    const DP: number[] = new Array(T + 1).fill(Infinity);
    const choices: number[][] = new Array(T + 1).fill(0).map(() => []);
    DP[T] = 0;
    const Ct_x = (t: number, x: number) => {
      const compra = P;
      let maintSum = 0;
      for (let age = 0; age < x - t; age++) {
        maintSum += maintArr[age];
      }
      const resaleVal = resaleArr[x-t- 1];
      return compra + maintSum - resaleVal;
    };

    for (let t = T-1; t >= 0; t--) {
      let best = Infinity;
      let bestXs: number[] = [];
      const maxX = Math.min(t + L, T);
      for (let x = t + 1; x <= maxX; x++) {
        const c = Ct_x(t, x) + DP[x];
        if (c < best) {
          best = c;
          bestXs = [x];
        } else if (c === best) {
          bestXs.push(x);
        }
      }
      DP[t] = best;
      choices[t] = bestXs;
      if (inflationActive) P += P*inflation;
    }

    const allPlans: Plan[] = [];
    const build = (t: number, currentPlan: number[]) => {
      if (allPlans.length >= 200) return;
      if (t === T) {
        currentPlan.push(t);
        allPlans.push([...currentPlan]);
        currentPlan.pop();
        return;
      }

      const ks = choices[t];
      if (!ks || ks.length === 0) return;

      for (const k of ks) {
        currentPlan.push(t);
        build(k, currentPlan);
        currentPlan.pop();
      }
    };
    build(0, []);

    setAnalysis({ G: DP.slice(0, T+1), choices });
    setPlans(allPlans);
    setSelectedPlanIdx(0);
  };

  const renderAnalysisTable = () => {
    const G = analysis.G;
    if (!G) return null;
    return (
      <div className="overflow-auto">
        <table className=" w-full table-auto text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-2">Año (t)</th>
              <th className="p-2">G(t)</th>
              <th className="p-2">Costos óptimos</th>
            </tr>
          </thead>
          <tbody>
            {G.map((g, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2">{idx}</td>
                <td className="p-2">{format(g)}</td>
                <td className="p-2">{analysis.choices[idx]?.join(", ") ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderPlanViewer = () => {
    if (!plans || plans.length === 0) return <p className="text-sm text-muted-foreground">No hay planes calculados. Presiona "Calcular".</p>;
    const plan = plans[selectedPlanIdx];
    return (
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Button variant="outline" size="icon" onClick={() => setSelectedPlanIdx(i => Math.max(0, i - 1))}>
            <ChevronLeft />
          </Button>
          <div className="text-sm font-medium">Plan {selectedPlanIdx + 1} de {plans.length}</div>
          <Button variant="outline" size="icon" onClick={() => setSelectedPlanIdx(i => Math.min(plans.length - 1, i + 1))}>
            <ChevronRight />
          </Button>
        </div>

        <div className="bg-muted rounded p-3">
          <div className="text-sm mb-2">Reemplazos:</div>
          <div className="flex flex-wrap gap-2">
            {plan.map((year, idx) => (
              <div key={idx} className="px-3 py-1 rounded bg-primary/10">{year}</div>
            ))}
          </div>
        </div>

        <div className="mt-3 text-sm">
          <div className="font-medium">Nota:</div>
          <p>Este plan indica en qué años se compra (inicio de uso) equipos para cubrir el proyecto optimizando costos.</p>
        </div>
      </div>
    );
  };

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
              <Calculator className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Reemplazo de Equipos</h1>
          </div>
        </div>

        {/* Content */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Algoritmo de Reemplazo de Equipos</CardTitle>
            <CardDescription>
              Optimiza el ciclo de vida y reemplazo de equipos para minimizar costos operativos
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label className="text-sm font-medium cursor-help">Costo inicial (P)</Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>El valor de cada uno de los equipos al momento de comprarlos</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  type="number"
                  value={initialCost}
                  onChange={(e) => setInitialCost(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label className="text-sm font-medium cursor-help">Plazo del proyecto (T) años</Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Cuanto tiempo va a durar el oficio en el cual necesitamos del equipo</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  type="number"
                  min={1}
                  max={30}
                  className="mt-2 w-full input"
                  value={projectTerm}
                  onChange={(e) => setProjectTerm(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label className="text-sm font-medium cursor-help">Vida útil máxima (L) años</Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Cuanto tiempo dura el equipo</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  className="mt-2 w-full input"
                  value={life}
                  onChange={(e) => setLife(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 mt-4">
                  <Checkbox id="infl" checked={inflationActive} onCheckedChange={(e)=> setInflationActive(Boolean(e))} />
                  <label htmlFor="infl" className="text-sm">Aplicar inflación (opcional)</label>
                </div>
                {inflationActive && (
                  <div>
                    <div className="flex items-center justify-between">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Label className="text-sm font-medium cursor-help">Tasa de inflación por periodo</Label>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Cambio de precio de compra del equipo conforme al tiempo</p>
                            <p className="text-xs text-muted-foreground mt-1">(ej: 0.05 = 5%)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input type="number" step="0.001" className="mt-2 w-full input" value={inflationRate} onChange={(e)=> setInflationRate(Number(e.target.value))} />
                  </div>
                )}
              </div>
              <div className="md:col-span-2 p-4 bg-muted rounded-md">
                <div className="mb-4 font-medium text-lg">
                  Datos por años transcurrido del equipo
                </div>
              <Table className="rounded-md bg-background shadow-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24 text-center">Año</TableHead>
                    <TableHead className="text-center">Costo Mantenimiento</TableHead>
                    <TableHead className="text-center">Precio Reventa</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {Array.from({ length: life }).map((_, idx) => {
                    const age = idx + 1;
                    return (
                      <TableRow key={idx}>
                        <TableCell className="text-center font-medium">
                          {age}
                        </TableCell>

                        {/* Maint */}
                        <TableCell>
                          <Input
                            type="number"
                            value={ensureSize(maint, life)[idx]}
                            onChange={(e) => {
                              const copy = ensureSize(maint, life);
                              copy[idx] = Number(e.target.value);
                              setMaint(copy);
                            }}
                            className="text-center"
                          />
                        </TableCell>

                        {/* Resale */}
                        <TableCell>
                          <Input
                            type="number"
                            value={ensureSize(resale, life)[idx]}
                            onChange={(e) => {
                              const copy = ensureSize(resale, life);
                              copy[idx] = Number(e.target.value);
                              setResale(copy);
                            }}
                            className="text-center"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button onClick={compute}>Calcular</Button>
              <Button variant="outline" onClick={() => {
                setAnalysis({ G: [], choices: [] });
                setPlans([]);
              }}>Limpiar resultados</Button>
            </div>

            {/* Resultados */}
            <div>
              <h3 className="text-lg font-semibold">Análisis y planes óptimos</h3>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-md">{renderAnalysisTable()}</div>
                <div className="p-3 bg-muted rounded-md">{renderPlanViewer()}</div>
              </div>

              {plans && plans.length > 0 && (
                <div className="mt-4 text-sm">
                  <div className="font-medium">Resumen:</div>
                  <p>Se produjeron {plans.length} planes óptimos (máx 200). La tabla G(t) muestra el costo mínimo desde cada año t hasta el final del proyecto.
                  Se puede navegar entre los planes con las flechas.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReemplazoEquipos;
