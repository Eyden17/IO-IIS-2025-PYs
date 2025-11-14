import { Link } from "react-router-dom";
import { ArrowLeft, Binary } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ArbolesBinarios = () => {
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
              <Binary className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Árboles Binarios de Búsqueda Óptimos</h1>
          </div>
        </div>

        {/* Content */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Árboles Binarios de Búsqueda Óptimos</CardTitle>
            <CardDescription>
              Construye árboles binarios óptimos para minimizar el costo de búsqueda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Este módulo implementará el algoritmo de árboles binarios de búsqueda óptimos.
            </p>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">Próximamente: Interfaz de cálculo y visualización</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ArbolesBinarios;
