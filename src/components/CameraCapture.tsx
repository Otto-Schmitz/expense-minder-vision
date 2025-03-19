
import { useState, useRef, useEffect } from "react";
import { Camera, X, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

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
      console.log("Attempting to access camera...");
      
      // Explicitly define video constraints for better compatibility
      const constraints = {
        video: { 
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("Camera access granted", stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for video to be ready before setting state
        videoRef.current.onloadedmetadata = () => {
          setIsCapturing(true);
          console.log("Video stream loaded");
        };
        streamRef.current = stream;
      }
    } catch (error) {
      console.error("Camera access error:", error);
      
      // More descriptive error messages based on error type
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          toast.error("Camera access denied. Please allow camera permissions in your browser settings.");
        } else if (error.name === 'NotFoundError') {
          toast.error("No camera found on this device.");
        } else if (error.name === 'NotReadableError') {
          toast.error("Camera is already in use by another application.");
        } else {
          toast.error(`Camera error: ${error.name}`);
        }
      } else {
        toast.error("Could not access camera. Please check camera permissions.");
      }
    }
  };

  const stopCapture = () => {
    console.log("Stopping camera capture");
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        console.log("Stopping track:", track.kind);
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
  };

  const captureImage = () => {
    console.log("Capturing image...");
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      console.log("Canvas dimensions:", canvas.width, canvas.height);
      
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
            console.log("Image captured, blob size:", blob.size);
            const file = new File([blob], "invoice-capture.jpg", { type: "image/jpeg" });
            onCapture(file);
          } else {
            console.error("Failed to create image blob");
            toast.error("Failed to capture image");
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
        <div className="border-2 border-dashed rounded-xl p-8 hover:bg-gray-50 transition-all">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Camera size={24} />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium">Take a photo of your invoice</p>
              <p className="text-sm text-gray-500 mt-1">
                Position the receipt within the frame
              </p>
            </div>
            <Button 
              type="button"
              onClick={startCapture}
            >
              Access Camera
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
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
