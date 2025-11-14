import { Link } from "react-router-dom";
import { Calculator, Binary, Trophy, Grid3x3, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const algorithms = [
  {
    name: "Reemplazo de Equipos",
    description: "Optimiza el ciclo de vida y reemplazo de equipos para minimizar costos operativos",
    icon: Calculator,
    path: "/reemplazo-equipos",
    delay: "0ms"
  },
  {
    name: "Árboles Binarios de Búsqueda Óptimos",
    description: "Construye árboles binarios óptimos para minimizar el costo de búsqueda",
    icon: Binary,
    path: "/arboles-binarios",
    delay: "100ms"
  },
  {
    name: "Series Deportivas",
    description: "Analiza probabilidades y estrategias óptimas en competencias deportivas",
    icon: Trophy,
    path: "/series-deportivas",
    delay: "200ms"
  },
  {
    name: "Multiplicación Óptima de Matrices",
    description: "Determina el orden óptimo de multiplicación para minimizar operaciones",
    icon: Grid3x3,
    path: "/multiplicacion-matrices",
    delay: "300ms"
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left side - Title */}
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
                Investigación
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
                  de Operaciones
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-md">
                Herramientas de optimización y programación dinámica para resolver problemas complejos
              </p>
            </div>
            
            <div className="flex items-center gap-4 pt-4">
              <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
              <span className="text-sm text-muted-foreground">Algoritmos Avanzados</span>
            </div>
          </div>

          {/* Right side - Menu Options */}
          <TooltipProvider>
            <div className="space-y-4">
              {algorithms.map((algo, index) => {
                const Icon = algo.icon;
                return (
                  <Tooltip key={algo.path} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link to={algo.path}>
                        <Button
                          variant="outline"
                          className="w-full h-auto p-6 justify-start gap-4 border-2 border-border hover:border-primary bg-card hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 group animate-slide-in-right"
                          style={{ animationDelay: algo.delay }}
                        >
                          <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 text-left">
                            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                              {algo.name}
                            </h3>
                          </div>
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent
                      side="left"
                      className="max-w-xs bg-card border-border"
                    >
                      <p className="text-sm">{algo.description}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}

              {/* Exit button */}
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-auto p-6 justify-start gap-4 border-2 border-border hover:border-destructive bg-card hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:shadow-destructive/20 hover:-translate-y-1 group animate-slide-in-right"
                    style={{ animationDelay: "400ms" }}
                    onClick={() => window.close()}
                  >
                    <div className="p-3 rounded-lg bg-destructive/10 group-hover:bg-destructive/20 transition-colors">
                      <LogOut className="h-6 w-6 text-destructive" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-destructive transition-colors">
                        Salir
                      </h3>
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="left"
                  className="max-w-xs bg-card border-border"
                >
                  <p className="text-sm">Cerrar la aplicación</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default Index;
