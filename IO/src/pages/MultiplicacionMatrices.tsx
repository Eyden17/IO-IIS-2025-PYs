import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Grid3x3, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const MultiplicacionMatrices = () => {
  const [numMatrices, setNumMatrices] = useState(2);
  const [dimensions, setDimensions] = useState<number[]>([10, 20, 30]);
  const [result, setResult] = useState<{ cost: number; order: string } | null>(null);

  const handleDimensionChange = (index: number, value: string) => {
    const newDimensions = [...dimensions];
    newDimensions[index] = parseInt(value) || 0;
    setDimensions(newDimensions);
  };

  const matrixChainOrder = (p: number[]) => {
    const n = p.length - 1;
    const m: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
    const s: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));

    for (let len = 2; len <= n; len++) {
      for (let i = 0; i < n - len + 1; i++) {
        const j = i + len - 1;
        m[i][j] = Infinity;
        for (let k = i; k < j; k++) {

          // Formula: min{M[i][k] + M[k+1][j] + (di-1 * dj * dk)}
          const cost = m[i][k] + m[k + 1][j] + p[i] * p[k + 1] * p[j + 1];
          if (cost < m[i][j]) {
            m[i][j] = cost;
            s[i][j] = k;
          }
        }
      }
    }

    const getOrder = (i: number, j: number): string => {
      if (i === j) return `A${i + 1}`;
      return `(${getOrder(i, s[i][j])} × ${getOrder(s[i][j] + 1, j)})`;
    };

    return { cost: m[0][n - 1], order: getOrder(0, n - 1) };
  };

  const handleCalculate = () => {
    if (dimensions.some(d => d <= 0)) {
      toast.error("Todas las dimensiones deben ser mayores a 0");
      return;
    }
    const result = matrixChainOrder(dimensions);
    setResult(result);
    toast.success("Cálculo completado");
  };

  const updateNumMatrices = (value: number) => {
    setNumMatrices(value);
    const newDimensions = Array(value + 1).fill(10);
    for (let i = 0; i <= value && i < dimensions.length; i++) {
      newDimensions[i] = dimensions[i];
    }
    setDimensions(newDimensions);
    setResult(null);
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
              <Grid3x3 className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Multiplicación Óptima de Matrices</h1>
          </div>
        </div>

        {/* Configuracion */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
            <CardDescription>
              Selecciona el número de matrices y define sus dimensiones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Número de Matrices</Label>
                <span className="text-2xl font-bold text-primary">{numMatrices}</span>
              </div>
              <Slider
                value={[numMatrices]}
                onValueChange={(value) => updateNumMatrices(value[0])}
                min={2}
                max={10}
                step={1}
                className="w-full"
              />
            </div>

            {/* Dimensiones de las Matrices */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Dimensiones de las Matrices</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: numMatrices }, (_, i) => (
                  <Card key={i} className="bg-muted/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Matriz A{i + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Filas</Label>
                        <Input
                          type="number"
                          min="1"
                          value={dimensions[i] || ""}
                          onChange={(e) => handleDimensionChange(i, e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Columnas</Label>
                        <Input
                          type="number"
                          min="1"
                          value={dimensions[i + 1] || ""}
                          onChange={(e) => handleDimensionChange(i + 1, e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="pt-2 text-center">
                        <span className="text-sm font-medium text-primary">
                          {dimensions[i]}×{dimensions[i + 1]}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleCalculate} 
              className="w-full h-12 text-base"
              size="lg"
            >
              <Play className="mr-2 h-5 w-5" />
              Calcular Orden Óptimo
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Resultados</CardTitle>
              <CardDescription>
                Orden óptimo de multiplicación y costo mínimo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Orden Óptimo</Label>
                  <div className="p-4 bg-background rounded-lg border">
                    <p className="text-lg font-mono">{result.order}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Costo Mínimo (operaciones)</Label>
                  <div className="p-4 bg-background rounded-lg border">
                    <p className="text-3xl font-bold text-primary">{result.cost.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MultiplicacionMatrices;
