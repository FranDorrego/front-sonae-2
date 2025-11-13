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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setCurrentStep(-1);
      setSteps([]);
      setFinalResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setCurrentStep(-1);
    setSteps([]);
    setFinalResult(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

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
      <main className="container max-w-4xl py-6 px-4 space-y-6">
        {/* Upload Area */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">1. Selecione uma Imagem</h2>
          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm font-medium">
                  {selectedFile ? selectedFile.name : "Clique para selecionar uma imagem"}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  JPG, PNG (máx. 10MB)
                </p>
              </div>
            </label>

            {previewUrl && (
              <div className="space-y-4">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full max-h-64 object-contain rounded-lg border"
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={handleUpload} 
                    disabled={isUploading}
                    className="flex-1"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analisando...
                      </>
                    ) : (
                      "Analisar Imagem"
                    )}
                  </Button>
                  <Button 
                    onClick={resetUpload} 
                    variant="outline"
                    disabled={isUploading}
                  >
                    Limpar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Process Steps */}
        {steps.length > 0 && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">2. Processo de Análise</h2>
            <div className="space-y-4">
              {steps.map((stepUrl, index) => (
                <div
                  key={index}
                  className={`transition-all duration-500 ${
                    currentStep >= index ? 'opacity-100' : 'opacity-30'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      currentStep >= index 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <p className="text-sm font-medium">
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
                    className="w-full rounded-lg border"
                  />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Final Result */}
        {finalResult && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">3. Resultado da Análise</h2>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-xs overflow-auto">
                {JSON.stringify(finalResult, null, 2)}
              </pre>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <p><span className="font-semibold">Produto Detectado:</span> {finalResult.product_detected}</p>
              <p><span className="font-semibold">Nível de Stock:</span> {finalResult.stock_percent}%</p>
              {finalResult.alerts && finalResult.alerts.length > 0 && (
                <div>
                  <span className="font-semibold">Alertas:</span>
                  <ul className="list-disc list-inside ml-4">
                    {finalResult.alerts.map((alert: string, i: number) => (
                      <li key={i}>{alert}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Explanation */}
        <Card className="p-6 bg-muted/50">
          <h3 className="font-semibold mb-2">Como Funciona</h3>
          <p className="text-sm text-muted-foreground">
            Este sistema utiliza visão computacional para analisar imagens de supermercados em tempo real. 
            As câmaras instaladas nas lojas capturam imagens que são processadas para detectar produtos, 
            avaliar níveis de stock e identificar situações que requerem atenção. 
            Os dados obtidos alimentam a base de dados que é analisada por agentes de IA via N8N, 
            gerando os conselhos e status atuais da loja apresentados nas outras vistas do sistema.
          </p>
        </Card>
      </main>
    </div>
  );
}
