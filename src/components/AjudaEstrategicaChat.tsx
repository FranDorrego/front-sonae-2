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

export default function AjudaEstrategicaChat() {
  const [open, setOpen] = useState(false);
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      role: "assistant",
      content: "Que necessitas analisar?",
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

    try {
      const response = await fetch("https://backagentesonae.sonae.arducloud.com/n8n/chat/estrategico", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMensagem,
          history: mensagens.map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      });

      const data = await response.json();
      
      const respostaIA: Mensagem = {
        role: "assistant",
        content: data.output || "Desculpe, não consegui processar sua mensagem.",
        timestamp: new Date(),
      };
      
      setMensagens((prev) => [...prev, respostaIA]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      const respostaErro: Mensagem = {
        role: "assistant",
        content: "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.",
        timestamp: new Date(),
      };
      setMensagens((prev) => [...prev, respostaErro]);
    } finally {
      setEnviando(false);
    }
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
        size="sm"
        className="gap-2"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="hidden sm:inline">Análise Estratégica</span>
        <span className="sm:hidden">Análise</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl">Análise Estratégica IA</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Visão completa sobre a gestão e desempenho da loja
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
                      {msg.timestamp.toLocaleTimeString("pt-BR", {
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
                placeholder="Pergunte sobre desempenho, métricas ou estratégias para esta loja..."
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
              Pressione Enter para enviar, Shift+Enter para nova linha
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
