import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DatasetItem {
  id: string;
  name: string;
  description: string;
  images: string[];
}

const mockDataset: DatasetItem[] = [
  {
    id: "26786",
    name: "Tomate",
    description: "Tomate rojo fresco de calidad premium",
    images: ["https://s3.abcstatics.com/abc/sevilla/media/gurme/2022/12/30/s/truco-como-conservar-tomates-frescos-k9vH--1248x698@abc.jpg"],
  },
  {
    id: "11908",
    name: "Lechuga",
    description: "Lechuga verde fresca, ideal para ensaladas",
    images: ["https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400"],
  },
  {
    id: "20508",
    name: "Manzana",
    description: "Manzana roja dulce y crujiente",
    images: ["https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400"],
  },
  {
    id: "30012",
    name: "Zanahoria",
    description: "Zanahoria orgánica rica en vitamina A",
    images: ["https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400"],
  },
  {
    id: "40156",
    name: "Plátano",
    description: "Plátano maduro rico en potasio",
    images: ["https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400"],
  },
  {
    id: "50234",
    name: "Naranja",
    description: "Naranja jugosa llena de vitamina C",
    images: ["https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400"],
  },
  {
    id: "60345",
    name: "Pepino",
    description: "Pepino fresco e hidratante",
    images: ["https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400"],
  },
  {
    id: "70456",
    name: "Pimiento",
    description: "Pimiento rojo dulce y nutritivo",
    images: ["https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400"],
  },
  {
    id: "80567",
    name: "Fresa",
    description: "Fresa dulce y aromática",
    images: ["https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400"],
  },
];

interface DatasetLibraryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DatasetLibrary({ open, onOpenChange }: DatasetLibraryProps) {
  const { toast } = useToast();
  const [items, setItems] = useState<DatasetItem[]>(mockDataset);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DatasetItem | null>(null);
  const [newItem, setNewItem] = useState<DatasetItem>({
    id: "",
    name: "",
    description: "",
    images: [""],
  });

  const handleAddItem = () => {
    if (!newItem.id || !newItem.name || !newItem.description) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos",
        variant: "destructive",
      });
      return;
    }

    setItems([...items, newItem]);
    setNewItem({ id: "", name: "", description: "", images: [""] });
    setShowAddForm(false);
    toast({
      title: "Éxito",
      description: "Item agregado a la biblioteca",
    });
  };

  const handleViewDetails = (item: DatasetItem) => {
    setSelectedItem(item);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Biblioteca de Dataset - Frutas y Verduras
          </DialogTitle>
        </DialogHeader>

        {!showAddForm && !selectedItem && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">
                Total de items: {items.length}
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Nuevo Item
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {items.map((item) => (
                <Card
                  key={item.id}
                  className="p-4 cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                >
                  <div className="space-y-3">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                          ID: {item.id}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleViewDetails(item)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalles
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {showAddForm && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Agregar Nuevo Item</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAddForm(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">ID</label>
                <Input
                  placeholder="Ej: 90678"
                  value={newItem.id}
                  onChange={(e) =>
                    setNewItem({ ...newItem, id: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Nombre</label>
                <Input
                  placeholder="Ej: Aguacate"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Descripción
                </label>
                <Textarea
                  placeholder="Describe el producto..."
                  value={newItem.description}
                  onChange={(e) =>
                    setNewItem({ ...newItem, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  URL de Imagen
                </label>
                <Input
                  placeholder="https://..."
                  value={newItem.images[0]}
                  onChange={(e) =>
                    setNewItem({ ...newItem, images: [e.target.value] })
                  }
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleAddItem} className="flex-1">
                  Guardar Item
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}

        {selectedItem && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Detalles del Item</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedItem(null)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img
                  src={selectedItem.images[0]}
                  alt={selectedItem.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    ID
                  </label>
                  <p className="text-lg font-mono">{selectedItem.id}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Nombre
                  </label>
                  <p className="text-2xl font-bold">{selectedItem.name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Descripción
                  </label>
                  <p className="text-base">{selectedItem.description}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Número de Imágenes
                  </label>
                  <p className="text-base">{selectedItem.images.length}</p>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setSelectedItem(null)}
                  className="w-full mt-4"
                >
                  Volver a la Biblioteca
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
