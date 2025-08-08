import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, RotateCcw, Paperclip, X, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ChatInput({ onSend, onRestart, disabled = false, placeholder = "Describe what's happening with your bike..." }) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileError, setFileError] = useState(null);
  const fileInputRef = useRef(null);

  const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFileError(null);

    if (!selectedFile) return;

    // Check file type
    if (!SUPPORTED_IMAGE_TYPES.includes(selectedFile.type)) {
      setFileError("Please upload a JPG, PNG, or GIF image file.");
      return;
    }

    // Check file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setFileError("Image file must be less than 5MB.");
      return;
    }

    setFile(selectedFile);
    setFilePreview(URL.createObjectURL(selectedFile));
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((message.trim() || file) && !disabled && !fileError) {
      onSend(message.trim(), file);
      setMessage("");
      removeFile();
    }
  };

  return (
    <div className="bg-white border-t border-slate-200 p-6">
      {fileError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{fileError}</AlertDescription>
        </Alert>
      )}
      
      {filePreview && (
        <div className="relative w-32 h-32 mb-4 p-2 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
          <img src={filePreview} alt="Preview" className="w-full h-full object-cover rounded" />
          <Button
            size="icon"
            variant="ghost"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-700 hover:bg-slate-800 text-white"
            onClick={removeFile}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex gap-3 items-end">
        <div className="flex-1 space-y-2">
          <div className="relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              className="pr-12 py-3 text-sm border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 bg-white rounded-xl shadow-sm"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 h-8 w-8 rounded-lg"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              title="Attach image"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.gif,image/jpeg,image/jpg,image/png,image/gif"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={disabled || (!message.trim() && !file) || fileError}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-xl shadow-sm"
          >
            <Send className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => { onRestart(); removeFile(); }}
            className="border-slate-300 hover:bg-slate-50 px-4 py-3 rounded-xl shadow-sm"
            title="Start new session"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </form>
      
      <p className="text-xs text-slate-500 mt-3 px-1">
        💡 Upload images (JPG, PNG, GIF) up to 5MB to help with diagnosis
      </p>
    </div>
  );
}