
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import FileUpload from "@/components/FileUpload";
import CameraCapture from "@/components/CameraCapture";
import { mockProcessInvoice } from "@/data/mockExpenses";
import { Expense } from "@/types/expense";

const Upload = () => {
  const [selectedTab, setSelectedTab] = useState("upload");
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [expense, setExpense] = useState<Expense | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [category, setCategory] = useState("uncategorized");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState("");

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    processFile(selectedFile);
  };

  const processFile = async (selectedFile: File) => {
    setProcessing(true);
    try {
      const result = await mockProcessInvoice(selectedFile);
      setExpense(result);
      
      // Pre-fill form with the detected data
      setAmount(result.amount.toString());
      setMerchant(result.merchant);
      setCategory(result.category.toLowerCase());
      setDate(result.date);
      
      toast.success("Invoice processed successfully!");
    } catch (error) {
      toast.error("Failed to process invoice");
      console.error("Processing error:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Simulate submission delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Expense saved successfully!");
      
      // Reset form
      setFile(null);
      setExpense(null);
      setAmount("");
      setMerchant("");
      setCategory("uncategorized");
      setDate(new Date().toISOString().split('T')[0]);
      setNote("");
      
    } catch (error) {
      toast.error("Failed to save expense");
      console.error("Submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 md:px-6 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Add New Expense</h1>
          <p className="text-gray-500 mt-2">
            Upload an invoice or take a photo to automatically extract expense details
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Upload/Camera */}
          <div className="lg:col-span-5">
            <div className="glass-card rounded-xl p-6">
              <Tabs 
                defaultValue="upload" 
                value={selectedTab}
                onValueChange={setSelectedTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="upload">Upload File</TabsTrigger>
                  <TabsTrigger value="camera">Use Camera</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload" className="mt-0">
                  <FileUpload onFileSelect={handleFileSelect} />
                </TabsContent>
                
                <TabsContent value="camera" className="mt-0">
                  <CameraCapture onCapture={handleFileSelect} />
                </TabsContent>
              </Tabs>
              
              {processing && (
                <div className="mt-6 flex items-center justify-center">
                  <div className="flex items-center space-x-2 bg-primary/5 text-primary px-4 py-3 rounded-lg">
                    <Loader2 size={20} className="animate-spin" />
                    <span>Processing your invoice...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - Form */}
          <div className="lg:col-span-7">
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6">Expense Details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="amount" className="text-sm font-medium">
                      Amount
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        required
                        className="pl-8"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="date" className="text-sm font-medium">
                      Date
                    </label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="merchant" className="text-sm font-medium">
                    Merchant
                  </label>
                  <Input
                    id="merchant"
                    type="text"
                    value={merchant}
                    onChange={(e) => setMerchant(e.target.value)}
                    placeholder="Name of merchant or vendor"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Category
                  </label>
                  <Select 
                    value={category} 
                    onValueChange={setCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">Food & Dining</SelectItem>
                      <SelectItem value="transportation">Transportation</SelectItem>
                      <SelectItem value="shopping">Shopping</SelectItem>
                      <SelectItem value="utilities">Utilities</SelectItem>
                      <SelectItem value="housing">Housing</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="health">Health & Medical</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="uncategorized">Uncategorized</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="note" className="text-sm font-medium">
                    Note (Optional)
                  </label>
                  <Textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add any additional details..."
                    rows={3}
                  />
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full h-12" 
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={20} className="mr-2 animate-spin" />
                        Saving Expense...
                      </>
                    ) : (
                      "Save Expense"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upload;
