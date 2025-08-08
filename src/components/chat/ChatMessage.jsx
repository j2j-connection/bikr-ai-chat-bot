import React from "react";
import { motion } from "framer-motion";
import { Bot, User, Clock } from "lucide-react";

export default function ChatMessage({ message, isTyping = false }) {
  const isBot = message.role === "assistant";
  const timestamp = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-4 mb-6 ${isBot ? '' : 'flex-row-reverse'}`}
    >
      <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center border-2 ${
        isBot 
          ? 'bg-emerald-50 border-emerald-200' 
          : 'bg-slate-100 border-slate-300'
      }`}>
        {isBot ? (
          <Bot className="w-5 h-5 text-emerald-600" />
        ) : (
          <User className="w-4 h-4 text-slate-600" />
        )}
      </div>
      
      <div className={`flex flex-col max-w-[75%] ${isBot ? '' : 'items-end'}`}>
        <div className={`relative rounded-2xl border shadow-sm ${
          isBot 
            ? 'bg-white border-slate-200' 
            : 'bg-slate-50 border-slate-200'
        }`}>
          {message.imageUrl && (
            <div className="border-b border-slate-200">
              <a href={message.imageUrl} target="_blank" rel="noopener noreferrer">
                <img 
                  src={message.imageUrl} 
                  alt="Uploaded by user" 
                  className="max-w-sm max-h-48 w-full object-cover rounded-t-2xl cursor-pointer hover:opacity-90 transition-opacity" 
                />
              </a>
            </div>
          )}
          <div className="px-5 py-4">
            {isTyping ? (
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-slate-500 ml-2">Analyzing...</span>
              </div>
            ) : (
              message.message && (
                <div className={`text-sm leading-relaxed ${
                  isBot ? 'text-slate-800' : 'text-slate-700'
                }`}>
                  {message.message.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < message.message.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
        
        {!isTyping && (
          <div className={`flex items-center gap-1 mt-2 px-2 text-xs ${
            isBot ? 'text-slate-400' : 'text-slate-400'
          }`}>
            <Clock className="w-3 h-3" />
            <span>{timestamp}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}