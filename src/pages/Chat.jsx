
import React, { useState, useEffect, useRef } from "react";
import { ChatSession } from "@/api/entities";
import { SendEmail, UploadFile } from "@/api/integrations";
import { getOpenAiResponse } from "@/api/functions";
import { sendSMS } from "@/api/functions";
import ChatMessage from "../components/chat/ChatMessage";
import CustomerForm from "../components/chat/CustomerForm";
import ChatInput from "../components/chat/ChatInput";
import { Button } from "@/components/ui/button";
import { CheckCircle, MessageCircle, AlertCircle, Activity } from "lucide-react"; // Added Activity
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const BIKE_DIAGNOSTIC_SYSTEM_PROMPT = `You are BikeBot, an AI expert at rapidly diagnosing bicycle problems. Your goal is to identify the likely issue based *only* on the user's description of symptoms.

Core Instructions:
1.  **Listen First:** Start with the user's initial description.
2.  **Ask, Don't Instruct:** Your role is to ask clarifying questions about the symptoms (e.g., "What kind of noise is it?", "When does it happen?"). You must NEVER ask the user to perform any physical action, check a part, or use a tool.
3.  **Be Quick:** Ask a maximum of 5 follow-up questions to narrow down the problem. Aim to diagnose in as few interactions as possible.
4.  **Diagnose Confidently:** Once you have a high-confidence diagnosis (or have used your 5 questions), provide a clear, concise summary.
5.  **Keep it Short:** All your messages should be brief and professional.

Response Format - Always conclude your questions with:
[CONFIDENCE: XX] [INTERACTIONS_USED: X/5]

For final diagnoses, use this format:
[DIAGNOSIS: human_readable_issue_title|concise_description_of_the_problem|estimated_service_time|urgency_level]
Example: [DIAGNOSIS: Worn Drivetrain and Chain|The chain is skipping on the cassette under load due to significant wear.|45 minutes|high]

Urgency levels: low, moderate, high, urgent.`;

export default function ChatPage() {
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [interactionsUsed, setInteractionsUsed] = useState(0);
  const [diagnosis, setDiagnosis] = useState(null);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    startNewSession();
  }, []);

  const startNewSession = async () => {
    setIsTyping(true);
    setError(null);
    try {
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const initialMessage = {
          role: "assistant",
          message: "Hi! I'm BikeBot 🚴‍♂️\n\nI'm here to help diagnose what's going on with your bike. Tell me what problem you're experiencing - the more specific you can be about symptoms, sounds, or when it happens, the better I can help!",
          timestamp: new Date().toISOString()
        };

        const session = await ChatSession.create({
          session_id: sessionId,
          conversation: [initialMessage],
          status: "active"
        });

        if (!session) {
            throw new Error("Failed to create a new chat session.");
        }

        setCurrentSession(session);
        setMessages([initialMessage]);
        setConfidence(0);
        setInteractionsUsed(0);
        setDiagnosis(null);
        setShowCustomerForm(false);
        setIsSubmitting(false);
        setIsCompleted(false);
    } catch (err) {
        console.error("Failed to start new session:", err);
        setError("Sorry, I'm having trouble starting a new chat. Please refresh the page or contact support if the problem persists.");
    } finally {
        setIsTyping(false);
    }
  };

  const parseAIResponse = (response) => {
    const confidenceMatch = response.match(/\[CONFIDENCE:\s*(\d+)\]/);
    const interactionsMatch = response.match(/\[INTERACTIONS_USED:\s*(\d+)\/5\]/);
    const diagnosisMatch = response.match(/\[DIAGNOSIS:\s*([^|]+)\|([^|]+)\|([^|]+)\|([^\]]+)\]/);

    const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 0;
    const interactions = interactionsMatch ? parseInt(interactionsMatch[1]) : 0;

    let diagnosis = null;
    if (diagnosisMatch) {
      // When a diagnosis is made, use the confidence score from the same line if available.
      // Otherwise, default to a high confidence level (e.g., 95%) since a conclusion was reached.
      const diagnosisConfidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 95;
      diagnosis = {
        issue: diagnosisMatch[1].trim(),
        description: diagnosisMatch[2].trim(),
        estimated_service_time: diagnosisMatch[3].trim(),
        urgency: diagnosisMatch[4].trim(),
        confidence: diagnosisConfidence,
      };
    }

    // Clean the message by removing the metadata
    const cleanMessage = response
      .replace(/\[CONFIDENCE:\s*\d+\]/, '')
      .replace(/\[INTERACTIONS_USED:\s*\d+\/5\]/, '')
      .replace(/\[DIAGNOSIS:[^\]]+\]/, '')
      .trim();

    return { confidence, interactions, diagnosis, cleanMessage };
  };

  const sendMessage = async (message, file) => {
    if (!currentSession || isCompleted) return;

    // Create the user message object
    const newUserMessage = {
      role: "user",
      message,
      timestamp: new Date().toISOString(),
      imageUrl: null // This will be updated if file upload succeeds
    };

    // Create a local array to manage messages before updating React state for LLM processing.
    // This ensures `messagesWithUser` contains the user's message correctly from the start.
    const messagesWithUser = [...messages, newUserMessage];

    // Display user message immediately.
    setMessages(messagesWithUser);
    setIsTyping(true);

    // Handle file upload if a file is provided
    if (file) {
      try {
        // Validate file type before uploading
        const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!supportedTypes.includes(file.type)) {
          throw new Error(`Unsupported file type: ${file.type}. Please use JPG, PNG, or GIF.`);
        }

        const { file_url } = await UploadFile({ file });
        // Update the imageUrl directly on the newUserMessage object within the `messagesWithUser` array.
        // Since `newUserMessage` is a reference, modifying it here modifies the object within `messagesWithUser`.
        newUserMessage.imageUrl = file_url;
      } catch (error) {
        console.error("Error uploading file:", error);
        const assistantErrorMessage = {
          role: "assistant",
          message: `Sorry, I had trouble with your image upload. ${error.message || "Please try again with a JPG, PNG, or GIF file."}`,
          timestamp: new Date().toISOString()
        };
        // Append the error message to the chat. The user's message is already displayed.
        setMessages(prevMessages => [...prevMessages, assistantErrorMessage]);
        setIsTyping(false);
        return; // Stop execution if file upload fails
      }
    }

    // Now, `messagesWithUser` contains the full conversation history including the user's message
    // with its `imageUrl` if applicable. Use this array for LLM invocation.
    try {
      const { data } = await getOpenAiResponse({
        systemPrompt: BIKE_DIAGNOSTIC_SYSTEM_PROMPT,
        conversationHistory: messagesWithUser
      });

      if (!data || !data.response) {
        throw new Error("Received an invalid response from the AI assistant.");
      }
      
      const aiResponse = data.response;

      const { confidence, interactions, diagnosis, cleanMessage } = parseAIResponse(aiResponse);

      const assistantMessage = {
        role: "assistant",
        message: cleanMessage,
        timestamp: new Date().toISOString()
      };

      const finalMessages = [...messagesWithUser, assistantMessage]; // Append assistant message
      setMessages(finalMessages); // Update state with the AI's response
      setConfidence(confidence);
      setInteractionsUsed(interactions);

      if (diagnosis) {
        setDiagnosis(diagnosis);
        setShowCustomerForm(true);
      } else if (interactions >= 5 && confidence < 90) {
        // Recommend in-store visit
        const visitMessage = {
          role: "assistant",
          message: "Based on our conversation, I'd recommend bringing your bike into the shop for a hands-on inspection. Some issues are best diagnosed in person with the bike right there. The shop will be able to give you a more definitive answer and get your bike running perfectly again! 🔧",
          timestamp: new Date().toISOString()
        };
        // Append this visit message to the currently displayed messages (which now include AI response).
        setMessages(prev => [...prev, visitMessage]);
      }

      // Update session in database
      await ChatSession.update(currentSession.id, {
        conversation: finalMessages,
        diagnosis: diagnosis || currentSession.diagnosis,
        status: diagnosis ? "diagnosed" : currentSession.status
      });

    } catch (error) {
      console.error("Error getting AI response:", error);
      let errorMessageText = "Sorry, I'm having trouble connecting right now. Please try again in a moment!";
      
      // Check for a specific rate limit error from the backend function
      if (error.data && error.data.error && typeof error.data.error === 'string' && error.data.error.toLowerCase().includes("rate limit")) {
        errorMessageText = "Looks like we're a bit busy right now! This can happen due to high demand. Please wait about a minute before sending your next message.";
      } else if (error.data && error.data.error) {
        errorMessageText = `An error occurred: ${error.data.error}. Please try again.`;
      } else if (error.message) {
        errorMessageText = `An error occurred: ${error.message}. Please try again.`;
      }

      const assistantErrorMessage = {
        role: "assistant",
        message: errorMessageText,
        timestamp: new Date().toISOString()
      };
      // Append AI error to the current state (which should include user message, and possibly uploaded image).
      setMessages(prevMessages => [...prevMessages, assistantErrorMessage]);
    }

    setIsTyping(false);
  };

  const submitCustomerInfo = async (customerData) => {
    setIsSubmitting(true);
    
    try {
      // Update session with customer info
      await ChatSession.update(currentSession.id, {
        customer_name: customerData.name,
        customer_email: customerData.email,
        customer_phone: customerData.phone,
        status: "sent_to_shop"
      });

      // Send notifications with diagnosis details
      if (diagnosis) {
        // Send SMS to shop phone
        const smsMessage = `🚴‍♂️ BikeBot Diagnosis Alert

Customer: ${customerData.name}
Email: ${customerData.email}
Phone: ${customerData.phone}

Issue: ${diagnosis.issue}
Priority: ${diagnosis.urgency}
Service Time: ${diagnosis.estimated_service_time}

Description: ${diagnosis.description}

View full details in your BikeBot dashboard.`;

        try {
          console.log("Attempting to send SMS...");
          await sendSMS({ message: smsMessage });
        } catch (smsError) {
          console.error("SMS sending failed. Full error object:", smsError);
          
          // Log specific error details from the backend for easier debugging
          if (smsError.data && smsError.data.error) {
            console.error("Specific error from backend:", smsError.data.error);
          }
          
          // Don't block the workflow if SMS fails - the diagnosis is still complete
        }

        // Send Email to shop inbox
        const emailBody = `
          <div style="font-family: sans-serif; line-height: 1.6;">
            <h1 style="color: #1a202c;">🚴‍♂️ New BikeBot Diagnostic Report</h1>
            <p>A new diagnostic report has been generated and requires attention.</p>
            
            <div style="background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-top: 20px;">
              <h2 style="border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-top: 0;">Customer Information</h2>
              <p><strong>Name:</strong> ${customerData.name}</p>
              <p><strong>Email:</strong> ${customerData.email}</p>
              <p><strong>Phone:</strong> ${customerData.phone || 'Not provided'}</p>
            </div>

            <div style="background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-top: 20px;">
              <h2 style="border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-top: 0;">Diagnostic Summary</h2>
              <p><strong>Issue Identified:</strong> ${diagnosis.issue}</p>
              <p><strong>Service Priority:</strong> <span style="font-weight: bold; color: ${diagnosis.urgency === 'urgent' || diagnosis.urgency === 'high' ? '#c53030' : '#2f855a'};">${diagnosis.urgency.toUpperCase()}</span></p>
              <p><strong>Estimated Service Time:</strong> ${diagnosis.estimated_service_time}</p>
              <p><strong>Technical Assessment:</strong></p>
              <p>${diagnosis.description}</p>
            </div>

            <p style="margin-top: 30px; font-size: 12px; color: #718096;">
              This is an automated report from the BikeBot Diagnostic Platform.
            </p>
          </div>
        `;

        try {
          console.log("Attempting to send email report...");
          await SendEmail({
            to: 'hayden@j2j.info',
            subject: `New BikeBot Report: ${diagnosis.issue} for ${customerData.name}`,
            body: emailBody,
            from_name: 'BikeBot Diagnostics'
          });
        } catch (emailError) {
           console.error("Email sending failed:", emailError);
        }
      }

      setIsCompleted(true);

    } catch (error) {
      console.error("Error submitting customer info:", error);
    }
    
    setIsSubmitting(false);
  };

  const getStatus = () => {
    if (isCompleted) return "completed";
    if (diagnosis) return "diagnosed";
    if (interactionsUsed >= 5 && confidence < 90) return "needs_visit";
    return "analyzing";
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full shadow-xl bg-white">
        {/* Professional Header */}
        <div className="bg-white border-b border-slate-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">AI Bike Diagnostics</h1>
                <p className="text-sm text-slate-500">Professional bicycle maintenance analysis</p>
              </div>
            </div>
            {/* Removed the interactionsUsed display from the header */}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 bg-slate-50/30">
          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Diagnostic Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isCompleted && !showCustomerForm && !error && (
            <>
              {messages.map((message, index) => (
                <ChatMessage 
                  key={index} 
                  message={message}
                />
              ))}
              
              {isTyping && (
                <ChatMessage 
                  message={{ role: "assistant", message: "", timestamp: new Date().toISOString() }}
                  isTyping={true}
                />
              )}
            </>
          )}

          {showCustomerForm && !isCompleted && (
            <CustomerForm
              diagnosis={diagnosis}
              onSubmit={submitCustomerInfo}
              isLoading={isSubmitting}
            />
          )}

          {isCompleted && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                <div className="text-center mb-8">
                  <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Diagnosis Complete</h2>
                  <p className="text-slate-600 text-lg">
                    Professional diagnostic report generated successfully
                  </p>
                </div>
                
                {diagnosis && (
                  <div className="bg-slate-50 rounded-xl p-6 mb-8">
                    <h3 className="font-bold text-slate-900 text-xl mb-4">Diagnostic Summary</h3>
                    <div className="grid md:grid-cols-2 gap-6 text-sm">
                      <div>
                        <div className="font-semibold text-slate-700 mb-1">Issue Identified:</div>
                        <div className="text-slate-900 font-medium">{diagnosis.issue}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-700 mb-1">Service Priority:</div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          diagnosis.urgency === 'urgent' ? 'bg-red-100 text-red-700' :
                          diagnosis.urgency === 'high' ? 'bg-orange-100 text-orange-700' :
                          diagnosis.urgency === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>{diagnosis.urgency.toUpperCase()}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-700 mb-1">Estimated Service Time:</div>
                        <div className="text-slate-900 font-medium">{diagnosis.estimated_service_time}</div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <div className="font-semibold text-slate-700 mb-2">Technical Assessment:</div>
                      <div className="text-slate-900 leading-relaxed">{diagnosis.description}</div>
                    </div>
                  </div>
                )}
                
                <div className="text-center">
                  <Button
                    onClick={startNewSession}
                    className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg"
                  >
                    Start New Diagnosis
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Professional Input */}
        {!isCompleted && !showCustomerForm && !error && (
          <ChatInput 
            onSend={sendMessage}
            onRestart={startNewSession}
            disabled={isTyping || interactionsUsed >= 5}
            placeholder={interactionsUsed >= 5 ? "Diagnostic session complete" : "Describe the bike issue or symptoms you're experiencing..."}
          />
        )}
      </div>
    </div>
  );
}
