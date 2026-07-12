"use client";

import React, { useState } from "react";
import SidebarLayout from "../components/SidebarLayout";

interface Message {
  sender: "ai" | "user";
  text: string;
  time: string;
  hasHealthCard?: boolean;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Greetings, Administrator. I have processed the latest telemetry from the Western Region facility. Would you like to see the maintenance priorities for today or analyze the energy consumption spikes?",
      time: "09:12 AM",
    },
    {
      sender: "user",
      text: "Analyze the HVAC system in Sector 7. It's showing abnormal vibration levels.",
      time: "09:14 AM",
    },
    {
      sender: "ai",
      text: "I've accessed the real-time sensor data for Sector 7 HVAC (ID: AS-7721). Vibrations have increased by 22% over the last 4 hours, primarily in the main compressor bearing.",
      time: "09:15 AM",
      hasHealthCard: true,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text) return;
    
    setInputText("");
    
    const userMsg: Message = {
      sender: "user",
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const { getAiCompletion } = await import("../actions");
      const res = await getAiCompletion(text);
      
      const responseMsg: Message = {
        sender: "ai",
        text: res.error ? `Failed to load intelligence: ${res.error}` : (res.text || "No response returned."),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, responseMsg]);
    } catch (err: any) {
      const responseMsg: Message = {
        sender: "ai",
        text: `Error connecting to the neural engine: ${err.message}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, responseMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <SidebarLayout activePage="AI Assistant" searchPlaceholder="Search across assets, tasks, or AI commands...">
      <div className="max-w-[1440px] mx-auto text-left flex flex-col lg:flex-row gap-6 items-stretch">
        
        {/* Main Content Area: Chat Interface (cols-8 equivalent) */}
        <div className="flex-1 bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header section */}
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4 mb-6">
              <div>
                <h1 className="text-xl font-bold text-[#1A1A1A]">Asset Intelligence Assistant</h1>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse block"></span>
                  <span className="text-xs text-[#6B7280]">Neural Engine v4.2 Online</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setMessages([])}
                  className="border border-[#2563EB]/25 text-[#2563EB] hover:bg-[#2563EB]/5 text-xs font-semibold py-1.5 px-3 rounded-lg cursor-pointer"
                >
                  Clear History
                </button>
                <button
                  onClick={() => alert("Starting new telemetry analysis session.")}
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold py-1.5 px-3 rounded-lg cursor-pointer shadow-sm"
                >
                  New Analysis
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="space-y-6 min-h-[400px] max-h-[600px] overflow-y-auto mb-6 pr-2">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3.5 items-start ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                  {/* Avatar Icon */}
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs ${
                    msg.sender === "ai" ? "bg-[#DBEAFE] text-[#2563EB]" : "bg-slate-700 text-white"
                  }`}>
                    {msg.sender === "ai" ? "🤖" : "U"}
                  </div>

                  <div className="flex flex-col max-w-[80%]">
                    {/* Message Bubble */}
                    <div className={`rounded-xl p-4 text-sm leading-relaxed ${
                      msg.sender === "ai" 
                        ? "bg-[#F8FAFC] border border-[#E2E8F0] text-[#1A1A1A] text-left" 
                        : "bg-[#2563EB] text-white text-left"
                    }`}>
                      {msg.text}
                      
                      {/* Nested System Health Card */}
                      {msg.hasHealthCard && (
                        <div className="mt-4 bg-white border border-[#E2E8F0] rounded-xl p-4 text-[#1A1A1A] space-y-4 shadow-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm">System Health: Critical</span>
                            <span className="text-xs font-bold text-[#DC2626]">Failure Risk 84%</span>
                          </div>
                          <div className="w-full bg-[#F3F4F6] rounded-full h-2">
                            <div className="bg-[#EF4444] h-2 rounded-full" style={{ width: "84%" }}></div>
                          </div>
                          
                          {/* Data metrics */}
                          <div className="grid grid-cols-2 gap-4 border-t border-b border-[#F1F5F9] py-2 text-xs">
                            <div>
                              <span className="text-[9px] text-[#6B7280] font-bold block uppercase">Temp</span>
                              <span className="font-bold text-[#1A1A1A] block mt-0.5">78.4°C ↑</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-[#6B7280] font-bold block uppercase">RPM</span>
                              <span className="font-bold text-[#2563EB] block mt-0.5">3200 OK</span>
                            </div>
                          </div>

                          <p className="text-xs font-medium text-[#1A1A1A]">
                            Recommendation: Schedule immediate inspection for <span className="font-bold">AS-7721</span> to prevent total bearing seizure.
                          </p>

                          <div className="flex gap-2">
                            <button className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[10px] font-bold py-2 rounded-lg cursor-pointer">
                              CREATE WORK ORDER
                            </button>
                            <button className="flex-1 border border-[#E2E8F0] hover:bg-slate-50 text-[#1A1A1A] text-[10px] font-bold py-2 rounded-lg cursor-pointer">
                              DETAILS
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Timestamp */}
                    <span className={`text-[9px] text-[#6B7280] mt-1.5 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3.5 items-start">
                  <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-[#DBEAFE] text-[#2563EB] font-bold text-xs animate-bounce">
                    🤖
                  </div>
                  <div className="flex flex-col max-w-[80%]">
                    <div className="rounded-xl p-4 text-sm bg-[#F8FAFC] border border-[#E2E8F0] text-[#6B7280] text-left">
                      <span className="flex gap-1 items-center py-1">
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            {/* Prompt suggestions pills */}
            <div className="flex flex-wrap gap-2.5 mb-4 justify-start">
              <button
                onClick={() => setInputText("Show all assets due for maintenance")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#F1F5F9] rounded-full text-xs font-semibold text-[#1A1A1A] cursor-pointer"
              >
                <span>📋</span>
                <span>Show all assets due for maintenance</span>
              </button>
              <button
                onClick={() => setInputText("Optimize energy usage for Building B")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#F1F5F9] rounded-full text-xs font-semibold text-[#1A1A1A] cursor-pointer"
              >
                <span>⚡</span>
                <span>Optimize energy usage for Building B</span>
              </button>
              <button
                onClick={() => setInputText("Review last audit results")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#F1F5F9] rounded-full text-xs font-semibold text-[#1A1A1A] cursor-pointer"
              >
                <span>🕒</span>
                <span>Review last audit results</span>
              </button>
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-3 bg-[#F0F2F5] rounded-xl p-2.5 border border-[#E2E8F0]">
              <button className="p-1.5 text-[#6B7280] hover:text-[#2563EB] cursor-pointer">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <input
                type="text"
                placeholder="Ask anything about your assets..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 bg-transparent border-0 text-sm text-[#1A1A1A] placeholder-[#6B7280] focus:outline-none focus:ring-0"
              />
              <button className="p-1.5 text-[#6B7280] hover:text-[#2563EB] cursor-pointer">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
              <button
                onClick={handleSend}
                className="w-8 h-8 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] flex items-center justify-center text-white cursor-pointer shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            {/* Disclaimer */}
            <span className="text-[10px] text-[#6B7280] text-center block mt-3 select-none leading-normal">
              AssetSync Intelligence may provide inaccurate data for non-monitored equipment. Always verify critical safety data.
            </span>
          </div>
        </div>

        {/* Right Sidebar: AI Recommendations (cols-4 equivalent) */}
        <aside className="w-80 space-y-6 shrink-0 text-left">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#1A1A1A]">AI Recommendations</h3>
            <span className="bg-[#2563EB] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              3 New
            </span>
          </div>

          {/* Recommendation Card 1: Predictive Alert */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-1.5">
              <span className="text-orange-500">⚠️</span>
              <h5 className="font-bold text-[10px] text-orange-500 uppercase tracking-wider">Predictive Alert</h5>
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#1A1A1A]">Fleet Vehicle E-102: Brake Wear</h4>
              <p className="text-xs text-[#6B7280] leading-relaxed mt-1">
                Telematics show aggressive deceleration and temperature spikes.
              </p>
            </div>
            <div className="flex justify-between items-center border-t border-[#F1F5F9] pt-2 mt-2 text-xs">
              <div className="flex items-center gap-1 text-[#6B7280]">
                <span>Scheduled:</span>
                <span className="font-semibold text-[#1A1A1A]">No</span>
              </div>
              <button className="text-[#2563EB] font-bold hover:underline flex items-center gap-0.5 cursor-pointer">
                <span>VIEW PLAN</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>

          {/* Recommendation Card 2: Energy Efficiency Forecast */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-3">
            <div>
              <h4 className="font-bold text-sm text-[#1A1A1A]">Energy Efficiency Forecast</h4>
              <span className="text-[10px] text-[#6B7280] block mt-0.5">Facility A - Q3 Estimates</span>
            </div>

            {/* Chart SVG */}
            <div className="h-28 flex items-end justify-between gap-1.5 pb-2">
              <div className="w-4 bg-slate-200 rounded-t h-12"></div>
              <div className="w-4 bg-slate-200 rounded-t h-16"></div>
              <div className="w-4 bg-slate-200 rounded-t h-8"></div>
              <div className="w-4 bg-slate-200 rounded-t h-20"></div>
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-bold text-[#1A1A1A] mb-0.5">18k</span>
                <div className="w-4 bg-[#2563EB] rounded-t h-24"></div>
              </div>
              <div className="w-4 bg-slate-200 rounded-t h-14"></div>
            </div>

            <p className="text-xs text-[#2563EB] font-medium leading-relaxed border-t border-[#F1F5F9] pt-2.5">
              <span className="font-bold">AI Note:</span> Implementing automated lighting in Hall 4 would reduce this peak by 12% ($4,200 monthly).
            </p>
          </div>

          {/* Card 3: Placeholder empty card */}
          <div className="border border-dashed border-[#D1D5DB] rounded-xl h-24 bg-transparent flex items-center justify-center text-xs text-[#6B7280]">
            No further active telemetry alerts
          </div>

          {/* Customize recommendations button */}
          <button className="w-full border border-dashed border-[#D1D5DB] hover:bg-slate-50 py-3 rounded-xl text-center text-xs font-semibold text-[#1A1A1A] cursor-pointer flex items-center justify-center gap-1.5">
            <span>+</span>
            <span>Customize Recommendations</span>
          </button>
        </aside>
      </div>
    </SidebarLayout>
  );
}
