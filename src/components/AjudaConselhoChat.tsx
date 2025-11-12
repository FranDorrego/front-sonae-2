import { useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

interface Mensagem {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const RESPOSTAS_MOCK = [
  "Entendo a tua preocupação. Com base nos dados históricos, recomendaria preparar a equipa com antecedência.",
  "Bom ponto. Segundo a análise do fluxo de clientes, poderíamos otimizar essa área para melhorar a eficiência.",
  "É uma excelente observação. Os dados mostram que durante esse período há um aumento significativo na procura.",
  "Obrigado por partilhares isso. Vou analisar os padrões atuais e dar-te uma recomendação mais específica.",
  "Perspetiva interessante. Com base nas estatísticas da loja, isso pode ser bastante benéfico.",
];

export default function AjudaConselhoChat() {
  const [open, setOpen] = useState(false);
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      role: "assistant",
      content: "Em que precisas de ajuda?",
      timestamp: new Date(),
    },
  ]);
  const [inputMensagem, setInputMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  const enviarMensagem = async () => {
    if (!inputMensagem.trim() || enviando) return;

    const novaMensagem: Mensagem = {
      role: "user",
      content: inputMensagem,
      timestamp: new Date(),
    };

    setMensagens((prev) => [...prev, novaMensagem]);
    setInputMensagem("");
    setEnviando(true);

    // Simular respuesta de la IA
    setTimeout(() => {
      const respostaMock = RESPOSTAS_MOCK[Math.floor(Math.random() * RESPOSTAS_MOCK.length)];
      const respostaIA: Mensagem = {
        role: "assistant",
        content: respostaMock,
        timestamp: new Date(),
      };
      setMensagens((prev) => [...prev, respostaIA]);
      setEnviando(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="gap-2"
      >
        <MessageCircle className="w-4 h-4" />
        Ayuda/Consejo
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl">Ayuda y Consejos IA</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Conversación sobre gestión de la tienda
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {mensagens.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {msg.timestamp.toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {enviando && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground rounded-lg px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t bg-background">
            <div className="flex gap-2">
              <Textarea
                value={inputMensagem}
                onChange={(e) => setInputMensagem(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu pregunta o sugerencia..."
                className="min-h-[60px] resize-none"
                disabled={enviando}
              />
              <Button
                onClick={enviarMensagem}
                disabled={!inputMensagem.trim() || enviando}
                size="icon"
                className="h-[60px] w-[60px] flex-shrink-0"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Presiona Enter para enviar, Shift+Enter para nueva línea
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
