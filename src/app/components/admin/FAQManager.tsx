import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export default function FAQManager() {
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: "1",
      question: "How do I play the Wheel of Fortune?",
      answer:
        "To play, simply click the 'Spin the Wheel' button. The wheel will spin and land on a random prize. Your credits will be instantly updated with your winnings.",
    },
    {
      id: "2",
      question: "Is it free to play?",
      answer:
        "You get one free spin every 24 hours. Additional spins require credits, which you can purchase or earn through various promotions.",
    },
    {
      id: "3",
      question: "How do I withdraw my winnings?",
      answer:
        "You can withdraw your winnings by converting your credits to USDT. Go to the 'Rewards' section in your dashboard to initiate a withdrawal.",
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
 
  const handleAddFaq = () => {
    if (newQuestion && newAnswer) {
      const newFaq: FAQ = {
        id: Date.now().toString(),
        question: newQuestion,
        answer: newAnswer,
      };
      setFaqs([...faqs, newFaq]);
      setNewQuestion("");
      setNewAnswer("");
      setIsDialogOpen(false);
    }
  };

  const handleEditFaq = (faq: FAQ) => {
    setEditingFaq(faq);
    setNewQuestion(faq.question);
    setNewAnswer(faq.answer);
    setIsDialogOpen(true);
  };

  const handleUpdateFaq = () => {
    if (editingFaq && newQuestion && newAnswer) {
      const updatedFaqs = faqs.map((faq) =>
        faq.id === editingFaq.id
          ? { ...faq, question: newQuestion, answer: newAnswer }
          : faq
      );
      setFaqs(updatedFaqs);
      setEditingFaq(null);
      setNewQuestion("");
      setNewAnswer("");
      setIsDialogOpen(false);
    }
  };

  const handleDeleteFaq = (id: string) => {
    const updatedFaqs = faqs.filter((faq) => faq.id !== id);
    setFaqs(updatedFaqs);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(faqs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFaqs(items);
  };

  return (
    <div className="p-6 w-full bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">FAQ Manager</h1>
      <Button onClick={() => setIsDialogOpen(true)} className="mb-4">
        <Plus className="mr-2 h-4 w-4" /> Add New FAQ
      </Button>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="faqs">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {faqs.map((faq, index) => (
                <Draggable key={faq.id} draggableId={faq.id} index={index}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="mb-4 bg-gray-800 border-purple-500"
                    >
                      <CardHeader className="flex flex-row items-center">
                        <div {...provided.dragHandleProps} className="mr-2">
                          <GripVertical className="h-5 w-5 text-gray-500" />
                        </div>
                        <CardTitle className="text-lg text-purple-300">
                          {faq.question}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-400">{faq.answer}</p>
                      </CardContent>
                      <CardFooter className="justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="font-semibold"
                          onClick={() => handleEditFaq(faq)}
                        >
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="font-semibold"
                          onClick={() => handleDeleteFaq(faq.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>{editingFaq ? "Edit FAQ" : "Add New FAQ"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="question" className="font-semibold">
                Question
              </Label>
              <Input
                id="question"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="bg-gray-700 text-white border-gray-600  focus-visible:ring-2 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-0 focus-visible:ring-offset-[#a1a1aa] focus-visible:ring-[#a1a1aa]"
              />
            </div>
            <div>
              <Label htmlFor="answer" className="font-semibold">
                Answer
              </Label>
              <Textarea
                id="answer"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                className="bg-gray-700 text-white border-gray-600 focus-visible:ring-2 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-0 focus-visible:ring-offset-[#a1a1aa] focus-visible:ring-[#a1a1aa]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="  font-semibold duration-300 ease-in-out"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={editingFaq ? handleUpdateFaq : handleAddFaq}
              className="text-white font-semibold duration-300 ease-in-out bg-black hover:bg-black/80"
            >
              {editingFaq ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
