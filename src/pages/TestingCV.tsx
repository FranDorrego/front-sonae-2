import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/services/api";

interface UploadResponse {
  ok: boolean;
  message: string;
  saved_path?: string;
  forward_response?: {
    ok: boolean;
    message: string;
    saved_path: string;
    forward_response?: {
      info: {
        products_detected: string[];
        total_boxes: number;
        stock_percent: number;
        fill_distribution: {
          empty: number;
          low: number;
          medium: number;
          full: number;
        };
        alerts: string[];
      };
      steps: string[];
    };
  };
}

export default function TestingCV() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [steps, setSteps] = useState<string[]>([]);
  const [finalResult, setFinalResult] = useState<any>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setCurrentStep(-1);
      setSteps([]);
      setFinalResult(null);
      
      // Enviar automáticamente
      await handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setCurrentStep(-1);
    setSteps([]);
    setFinalResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload-supermarket`, {
        method: "POST",
        body: formData,
      });

      const data: UploadResponse = await response.json();

      if (!data.ok) {
        toast({
          title: "Imagem inválida",
          description: data.message,
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }

      // Imagen válida, obtener datos anidados
      const forwardData = data.forward_response?.forward_response;
      const stepImages = forwardData?.steps || [];
      setSteps(stepImages);
      
      // Mostrar pasos en secuencia con animación
      for (let i = 0; i < stepImages.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setCurrentStep(i);
      }

      // Al finalizar, mostrar resultado completo
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFinalResult(forwardData);
      
      toast({
        title: "Análise completa",
        description: "Processo de análise finalizado com sucesso",
      });
    } catch (error) {
      console.error("Error uploading:", error);
      toast({
        title: "Erro",
        description: "Erro ao enviar imagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setCurrentStep(-1);
    setSteps([]);
    setFinalResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center gap-4 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Visualizar CV / Testing CV</h1>
            <p className="text-xs text-muted-foreground">Teste o processo de análise de imagens</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-5xl py-6 px-4">
        {!isUploading && !steps.length && !finalResult && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              disabled={isUploading}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Card className="p-12 hover:border-primary transition-all hover:shadow-lg">
                <div className="text-center">
                  <Upload className="h-20 w-20 mx-auto mb-6 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">Selecione uma imagem</p>
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG (máx. 10MB)
                  </p>
                </div>
              </Card>
            </label>
          </div>
        )}

        {isUploading && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="text-lg font-medium">Analisando imagem...</p>
          </div>
        )}

        {/* Process Steps */}
        {steps.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-center">Proceso de Análisis</h2>
            <div className="grid gap-6">
              {steps.map((stepUrl, index) => (
                <div
                  key={index}
                  className={`transition-all duration-500 ${
                    index <= currentStep ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  {index <= currentStep && (
                    <Card className="p-6">
                      <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <h3 className="text-xl font-semibold">
                            Paso {index + 1}
                          </h3>
                        </div>
                        <img
                          src={stepUrl}
                          alt={`Paso ${index + 1}`}
                          className="w-full max-w-3xl rounded-lg border shadow-lg"
                        />
                      </div>
                    </Card>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final Result */}
        {finalResult && (
          <div className="space-y-8 animate-fade-in mt-8">
            <h2 className="text-2xl font-bold text-center">Resultado del Análisis</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Produtos Detectados</h3>
                <p className="text-2xl font-bold">{finalResult.info.products_detected.length}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {finalResult.info.products_detected.join(", ")}
                </p>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Total de Boxes</h3>
                <p className="text-2xl font-bold">{finalResult.info.total_boxes}</p>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Nível de Stock</h3>
                <p className="text-2xl font-bold">{finalResult.info.stock_percent}%</p>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Alertas</h3>
                <div className="flex flex-wrap gap-2">
                  {finalResult.info.alerts.map((alert: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-destructive/10 text-destructive text-xs rounded-md"
                    >
                      {alert}
                    </span>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Distribución de Llenado</h3>
              <div className="grid grid-cols-4 gap-4 mt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{finalResult.info.fill_distribution.empty}</p>
                  <p className="text-xs text-muted-foreground">Vacío</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{finalResult.info.fill_distribution.low}</p>
                  <p className="text-xs text-muted-foreground">Bajo</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{finalResult.info.fill_distribution.medium}</p>
                  <p className="text-xs text-muted-foreground">Medio</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{finalResult.info.fill_distribution.full}</p>
                  <p className="text-xs text-muted-foreground">Lleno</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">JSON Completo</h3>
              <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-sm">
                {JSON.stringify(finalResult, null, 2)}
              </pre>
            </Card>

            <div className="flex justify-center">
              <Button onClick={resetUpload} size="lg">
                Nova Análise
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
