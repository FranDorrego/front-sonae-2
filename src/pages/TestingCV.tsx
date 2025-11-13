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
    info: {
      product_detected: string;
      stock_percent: number;
      alerts: string[];
    };
    steps: string[];
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

      // Imagen válida, mostrar pasos
      const stepImages = data.forward_response?.steps || [];
      setSteps(stepImages);
      
      // Mostrar pasos en secuencia con animación
      for (let i = 0; i < stepImages.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setCurrentStep(i);
      }

      // Al finalizar, mostrar resultado
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFinalResult(data.forward_response?.info);
      
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
          <div className="space-y-8 animate-fade-in">
            {steps.map((stepUrl, index) => (
              <Card
                key={index}
                className={`p-6 transition-all duration-700 ${
                  currentStep >= index 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-40 scale-95'
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                    currentStep >= index 
                      ? 'bg-primary text-primary-foreground shadow-lg scale-110' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  <p className="text-lg font-semibold">
                    {index === 0 && "Imagem Original"}
                    {index === 1 && "Detecção de Objetos"}
                    {index === 2 && "Segmentação"}
                    {index === 3 && "Classificação"}
                    {index === 4 && "Resultado Final"}
                    {index > 4 && `Passo ${index + 1}`}
                  </p>
                </div>
                <img
                  src={stepUrl}
                  alt={`Step ${index + 1}`}
                  className="w-full rounded-lg border shadow-md"
                />
              </Card>
            ))}
          </div>
        )}

        {/* Final Result */}
        {finalResult && (
          <Card className="p-8 mt-8 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-center">Resultado</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-primary/10 p-6 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Produto Detectado</p>
                  <p className="text-2xl font-bold">{finalResult.product_detected}</p>
                </div>
                <div className="bg-primary/10 p-6 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Nível de Stock</p>
                  <p className="text-2xl font-bold">{finalResult.stock_percent}%</p>
                </div>
              </div>
              
              {finalResult.alerts && finalResult.alerts.length > 0 && (
                <div className="bg-destructive/10 p-6 rounded-lg">
                  <p className="text-sm font-semibold mb-3">Alertas</p>
                  <ul className="space-y-2">
                    {finalResult.alerts.map((alert: string, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-destructive" />
                        <span>{alert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-xs font-mono text-muted-foreground mb-2">JSON</p>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(finalResult, null, 2)}
                </pre>
              </div>

              <Button 
                onClick={resetUpload} 
                className="w-full"
                size="lg"
              >
                Analisar Nova Imagem
              </Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
