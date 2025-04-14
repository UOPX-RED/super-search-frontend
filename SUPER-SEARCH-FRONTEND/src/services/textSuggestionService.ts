/* eslint-disable @typescript-eslint/no-explicit-any */
import apiService from './apiService';

export const getAlternativeTextSuggestions = async (payload: any) => {
  try {
    console.log("Sending payload to /alternate-text-suggestion:", payload);
    
    const formattedPayload: {
      source_id: string;
      content_type: string;
      sentence: string;
      text: string;
      keywords: any[];
      metadata: any;
      req_prompt?: string;
    } = {
      source_id: String(payload.source_id || ""),
      content_type: String(payload.content_type || ""),
      sentence: String(payload.sentence || ""),  
      text: String(payload.sentence || ""),     
      keywords: Array.isArray(payload.keywords) ? payload.keywords : [],
      metadata: payload.metadata || {}
    };
    
    if (payload.req_prompt) {
      formattedPayload.req_prompt = payload.req_prompt;
    }
    
    console.log("Formatted payload:", formattedPayload);
    
    const response = await apiService.post("/api/alternate-text-suggestion", formattedPayload, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    return response.data;
  } catch (error: any) {
    console.error("API Error:", error);
    
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      
      const errorMessage = 
        typeof error.response.data === 'object' && error.response.data.detail
          ? error.response.data.detail
          : "Failed to get alternative text suggestions";
      
      throw new Error(errorMessage);
    }
    throw new Error(error.message || "Failed to get alternative text suggestions");
  }
};

/**
 * Get full text alternatives
 */
export const getFullTextAlternatives = async (payload: any) => {
  try {
    console.log("Sending payload to /full-sentence-suggestion:", payload);
    
    const formattedPayload: any = {
      original_text: payload.original_text || "",
      keywords: Array.isArray(payload.keywords) ? payload.keywords : [],
      source_id: payload.source_id || "",
      content_type: payload.content_type || "text",
      metadata: payload.metadata || {},
      mode: payload.mode || "full_text"
    };
    
    if (payload.prompt) {
      const keywordsStr = Array.isArray(payload.keywords) 
        ? payload.keywords.join(", ") 
        : "specified keywords";
      
      formattedPayload.prompt = `
        You are an educational content improver. 
        
        YOUR TASK:
        ${payload.prompt}
        
        ADDITIONAL REQUIREMENTS:
        - The text should avoid using terminology related to: ${keywordsStr}
        - Maintain the same educational meaning and context
        - Keep the same tone and level as the original
        
        Format your response as a JSON array with 3 alternative versions, like this:
        [
          "First complete alternative text...",
          "Second complete alternative text...",
          "Third complete alternative text..."
        ]
        
        Original text:
        {text_to_process}
      `;
    }
    
    console.log("Formatted payload:", formattedPayload);
    
    // Call the API
    const response = await apiService.post("/api/full-sentence-suggestion", formattedPayload, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    return response.data;
  } catch (error: any) {
    console.error("API Error:", error);
    
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      
      const errorMessage = 
        typeof error.response.data === 'object' && error.response.data.detail
          ? error.response.data.detail
          : "Failed to get full text alternatives";
      
      throw new Error(errorMessage);
    }
    throw new Error(error.message || "Failed to get full text alternatives");
  }
};