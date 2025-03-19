
import { useState, useRef, useEffect } from "react";
import { Camera, X, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

interface CameraCaptureProps {
  onCapture: (imageFile: File) => void;
}

const CameraCapture = ({ onCapture }: CameraCaptureProps) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCapturing(true);
      }
    } catch (error) {
      toast.error("Could not access camera");
      console.error("Camera error:", error);
    }
  };

  const stopCapture = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to image
        const imageDataUrl = canvas.toDataURL("image/jpeg");
        setCapturedImage(imageDataUrl);
        
        // Convert to file and pass to parent
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "invoice-capture.jpg", { type: "image/jpeg" });
            onCapture(file);
          }
        }, "image/jpeg", 0.9);
        
        // Stop camera stream
        stopCapture();
      }
    }
  };

  const discardCapture = () => {
    setCapturedImage(null);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  if (capturedImage) {
    return (
      <div className="rounded-xl overflow-hidden border animate-slide-in">
        <div className="relative">
          <img
            src={capturedImage}
            alt="Captured invoice"
            className="w-full h-auto"
          />
          <button
            onClick={discardCapture}
            className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {!isCapturing ? (
        <div
          className="border-2 border-dashed rounded-xl p-8 hover:bg-gray-50 transition-all"
          onClick={startCapture}
        >
          <div className="flex flex-col items-center justify-center gap-4 cursor-pointer">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Camera size={24} />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium">Take a photo of your invoice</p>
              <p className="text-sm text-gray-500 mt-1">
                Position the receipt within the frame
              </p>
            </div>
            <Button type="button">Access Camera</Button>
          </div>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-auto"
          />
          <div className="absolute bottom-4 inset-x-0 flex justify-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white/80 hover:bg-white"
              onClick={stopCapture}
            >
              <X size={20} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white/80 hover:bg-white"
              onClick={captureImage}
            >
              <ImagePlus size={20} />
            </Button>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
