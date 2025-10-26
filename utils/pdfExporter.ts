import { CollegeRecommendation, Message } from '../types';

// These are loaded from the CDN in index.html
declare const jspdf: any;

export const generatePdfReport = async (recommendations: CollegeRecommendation[], chatHistory: Message[]): Promise<void> => {
    const { jsPDF } = jspdf;
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });

    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let y = margin;

    const addText = (text: string, size: number, style: 'normal' | 'bold', options: { lineHeight?: number; spacing?: number } = {}) => {
      const { lineHeight = 5, spacing = 2 } = options;
      // Sanitize text before splitting
      const sanitizedText = text.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
      const lines = doc.setFontSize(size).setFont(undefined, style).splitTextToSize(sanitizedText, pageWidth - margin * 2);
      
      if (y + (lines.length * lineHeight) > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(lines, margin, y);
      y += (lines.length * lineHeight) + spacing;
    };
    
    // --- Title Page ---
    doc.setFontSize(32).setFont(undefined, 'bold');
    doc.text("College Pathfinder Report", pageWidth / 2, y, { align: 'center' });
    y += 20;
    doc.setFontSize(14).setFont(undefined, 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, y, { align: 'center' });
    y += 40;

    // --- How it Works ---
    addText("The Pathfinder Analysis Protocol", 18, 'bold', { lineHeight: 7, spacing: 5 });
    addText("Your recommendations are the result of a rigorous, multi-stage validation protocol designed to provide the most personalized and reliable results possible.", 11, 'normal');
    addText("Phase 1 (Seven-Model Analysis): The AI performs a deep analysis from the perspective of seven specialized 'models' to evaluate your profile from a unique angle.", 11, 'normal');
    addText("Phase 1.5 (Inter-Model Communication): The models engage in a simulated 'roundtable discussion' to compare findings, identify synergies, and flag conflicts before synthesis.", 11, 'normal');
    addText("Phase 2 (Synthesis & Personalization): A 'Lead Counselor' persona synthesizes findings and generates a unique Personalization Score for each contender.", 11, 'normal');
    addText("Phase 3 (Red Team Validation): A 'Red Team' persona rigorously challenges each recommendation, checking for biases and performing a crucial self-correction step.", 11, 'normal');
    
    doc.addPage();
    y = margin;

    // --- Chat Transcript ---
    addText("Conversation Transcript", 18, 'bold', { lineHeight: 7, spacing: 5 });
    chatHistory.forEach(msg => {
      const prefix = msg.sender === 'bot' ? 'Pathfinder: ' : 'You: ';
      addText(prefix + msg.content, 11, msg.sender === 'bot' ? 'normal' : 'bold');
    });

    // --- Recommendations ---
    recommendations.forEach((rec, index) => {
        doc.addPage();
        y = margin;
        
        addText(`Recommendation #${index + 1}: ${rec.universityName}`, 20, 'bold', { lineHeight: 8, spacing: 5 });
        addText(`Country: ${rec.country}`, 12, 'normal');
        addText(`Suggested Major: ${rec.suggestedMajor}`, 12, 'normal');
        y += 5;

        addText("Full Reasoning Log", 18, 'bold', { lineHeight: 7, spacing: 5 });
        
        addText("Model Communications", 14, 'bold', {lineHeight: 5, spacing: 1});
        rec.reasoningLog.modelCommunications.forEach(comm => {
            addText(`[${comm.model}]`, 11, 'bold', {lineHeight: 5, spacing: 0});
            addText(comm.findings, 11, 'normal', {lineHeight: 5, spacing: 3});
        });
        y += 5;

        addText("Inter-Model Dialogue", 14, 'bold', {lineHeight: 5, spacing: 1});
        addText(rec.reasoningLog.interModelDialogue, 11, 'normal', {lineHeight: 5, spacing: 3});
        y += 5;

        addText("Lead Counselor Synthesis", 14, 'bold', {lineHeight: 5, spacing: 1});
        addText(rec.reasoningLog.leadCounselorSynthesis, 11, 'normal', {lineHeight: 5, spacing: 5});
        y += 5;
        
        addText("Red Team Validation", 14, 'bold', {lineHeight: 5, spacing: 1});
        addText(rec.reasoningLog.redTeamValidation, 11, 'normal', {lineHeight: 5, spacing: 5});

    });

    doc.save('College-Pathfinder-Report.pdf');
}