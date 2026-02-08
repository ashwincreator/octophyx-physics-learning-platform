import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { storagePut } from "../../../server/storage";

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
}

export function VoiceRecorder({ onTranscription }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const transcribeMutation = trpc.physics.transcribeVoice.useMutation({
    onSuccess: (data) => {
      onTranscription(data.text);
      toast.success("Voice transcribed successfully!");
      setIsProcessing(false);
    },
    onError: (error) => {
      toast.error(`Transcription failed: ${error.message}`);
      setIsProcessing(false);
    },
  });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        
        // Check file size (16MB limit)
        const fileSizeMB = audioBlob.size / (1024 * 1024);
        if (fileSizeMB > 16) {
          toast.error("Recording too long. Please keep it under 16MB.");
          setIsProcessing(false);
          return;
        }
        
        setIsProcessing(true);
        
        // Upload to storage first
        try {
          const arrayBuffer = await audioBlob.arrayBuffer();
          const buffer = new Uint8Array(arrayBuffer);
          
          // Note: This needs to be done server-side
          // For now, we'll use a data URL as a workaround
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Audio = reader.result as string;
            // In production, upload to S3 and get URL
            // For now, we'll show an error that this needs backend support
            toast.error("Voice transcription requires server-side audio upload. Please use text input for now.");
            setIsProcessing(false);
          };
          reader.readAsDataURL(audioBlob);
        } catch (error) {
          toast.error("Failed to process audio");
          setIsProcessing(false);
        }
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.info("Recording started... Speak your physics topic");
    } catch (error) {
      toast.error("Failed to access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <Button
      type="button"
      variant={isRecording ? "destructive" : "outline"}
      size="icon"
      onClick={isRecording ? stopRecording : startRecording}
      disabled={isProcessing}
      className="shrink-0"
    >
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isRecording ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
}
