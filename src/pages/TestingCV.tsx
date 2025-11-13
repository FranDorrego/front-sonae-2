import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowLeft, Upload, Loader2, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/services/api";
import { DatasetLibrary } from "@/components/DatasetLibrary";

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
      raw_data?: {
        timestamp: number;
        shelves: Array<{
          shelf_id: string;
          boxes: Array<{
            position: {
              xo: number;
              yo: number;
              xd: number;
              yd: number;
            };
            item_id: number;
            fullness_percent: number;
            fullness_confidence: number;
          }>;
        }>;
      };
    };
    raw_data?: any;
  };
}

export default function TestingCV() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [steps, setSteps] = useState<string[]>([]);
  const [finalResult, setFinalResult] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null);
  const [showDatasetLibrary, setShowDatasetLibrary] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setSteps([]);
      setFinalResult(null);
      
      // Enviar automáticamente
      await handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
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
      setFinalResult(data);
      
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
    setSteps([]);
    setFinalResult(null);
    setSelectedImage(null);
    setSelectedStepIndex(null);
  };

  const handleStepClick = (stepUrl: string, index: number) => {
    setSelectedImage(stepUrl);
    setSelectedStepIndex(index);
  };

  const handleKeyNavigation = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (selectedStepIndex === null || !steps.length) return;
    
    if (e.key === "ArrowRight" && selectedStepIndex < steps.length - 1) {
      const newIndex = selectedStepIndex + 1;
      setSelectedStepIndex(newIndex);
      setSelectedImage(steps[newIndex]);
    } else if (e.key === "ArrowLeft" && selectedStepIndex > 0) {
      const newIndex = selectedStepIndex - 1;
      setSelectedStepIndex(newIndex);
      setSelectedImage(steps[newIndex]);
    }
  };

  const handleDialogClose = () => {
    setSelectedImage(null);
    setSelectedStepIndex(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-4">
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
          <Button
            variant="outline"
            onClick={() => setShowDatasetLibrary(true)}
          >
            <Database className="h-4 w-4 mr-2" />
            DataSet
          </Button>
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
            <h2 className="text-2xl font-bold text-center mb-6">Proceso de Análisis</h2>
            <div className="grid grid-cols-6 gap-6">
              {steps.map((stepUrl, index) => (
                <Card 
                  key={index}
                  className="p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                  onClick={() => handleStepClick(stepUrl, index)}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-base">
                      {index + 1}
                    </div>
                    <img
                      src={stepUrl}
                      alt={`Paso ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-lg border-2"
                    />
                    <p className="text-sm font-medium text-center">Paso {index + 1}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Final Result */}
        {finalResult && (
          <div className="space-y-8 animate-fade-in mt-8">
            <h2 className="text-2xl font-bold text-center">Resultado del Análisis</h2>
            
            {finalResult.forward_response?.forward_response?.info && (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Produtos Detectados</h3>
                    <p className="text-2xl font-bold">{finalResult.forward_response.forward_response.info.products_detected.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {finalResult.forward_response.forward_response.info.products_detected.join(", ")}
                    </p>
                  </Card>
                  
                  <Card className="p-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Total de Boxes</h3>
                    <p className="text-2xl font-bold">{finalResult.forward_response.forward_response.info.total_boxes}</p>
                  </Card>
                  
                  <Card className="p-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Nível de Stock</h3>
                    <p className="text-2xl font-bold">{finalResult.forward_response.forward_response.info.stock_percent}%</p>
                  </Card>
                  
                  <Card className="p-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Alertas</h3>
                    <div className="flex flex-wrap gap-2">
                      {finalResult.forward_response.forward_response.info.alerts.length > 0 ? (
                        finalResult.forward_response.forward_response.info.alerts.map((alert: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-destructive/10 text-destructive text-xs rounded-md"
                          >
                            {alert}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">Sin alertas</span>
                      )}
                    </div>
                  </Card>
                </div>

                <Card className="p-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">Distribución de Llenado</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{finalResult.forward_response.forward_response.info.fill_distribution.empty}</p>
                      <p className="text-xs text-muted-foreground">Vacío</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{finalResult.forward_response.forward_response.info.fill_distribution.low}</p>
                      <p className="text-xs text-muted-foreground">Bajo</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{finalResult.forward_response.forward_response.info.fill_distribution.medium}</p>
                      <p className="text-xs text-muted-foreground">Medio</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{finalResult.forward_response.forward_response.info.fill_distribution.full}</p>
                      <p className="text-xs text-muted-foreground">Lleno</p>
                    </div>
                  </div>
                </Card>

                {finalResult.forward_response.forward_response.raw_data && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Datos Detallados (Raw Data)</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">Timestamp:</span>
                        <span className="font-mono">{new Date(finalResult.forward_response.forward_response.raw_data.timestamp * 1000).toLocaleString()}</span>
                      </div>
                      
                      {finalResult.forward_response.forward_response.raw_data.shelves.map((shelf: any, shelfIdx: number) => (
                        <div key={shelfIdx} className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-3">Estante {shelf.shelf_id}</h4>
                          <div className="grid gap-3">
                            {shelf.boxes.map((box: any, boxIdx: number) => (
                              <div key={boxIdx} className="bg-muted/50 rounded p-3 text-xs font-mono">
                                <div className="grid grid-cols-2 gap-2">
                                  <div><span className="text-muted-foreground">Box:</span> {boxIdx + 1}</div>
                                  <div><span className="text-muted-foreground">Item ID:</span> {box.item_id}</div>
                                  <div><span className="text-muted-foreground">Llenado:</span> {box.fullness_percent.toFixed(2)}%</div>
                                  <div><span className="text-muted-foreground">Confianza:</span> {box.fullness_confidence.toFixed(2)}%</div>
                                  <div className="col-span-2"><span className="text-muted-foreground">Posición:</span> ({box.position.xo}, {box.position.yo}) - ({box.position.xd}, {box.position.yd})</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </>
            )}

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">JSON Completo</h3>
              <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-sm font-mono">
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

        {/* Image Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={handleDialogClose}>
          <DialogContent className="max-w-7xl max-h-[90vh]" onKeyDown={handleKeyNavigation}>
            {selectedImage && selectedStepIndex !== null && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Paso {selectedStepIndex + 1} de {steps.length}</h3>
                  <p className="text-sm text-muted-foreground">
                    Usa las flechas ← → para navegar
                  </p>
                </div>
                <img
                  src={selectedImage}
                  alt={`Paso ${selectedStepIndex + 1}`}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Dataset Library */}
        <DatasetLibrary
          open={showDatasetLibrary}
          onOpenChange={setShowDatasetLibrary}
        />
      </main>
    </div>
  );
}
