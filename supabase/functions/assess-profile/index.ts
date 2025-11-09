import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { responses, assessmentType } = await req.json();
    console.log('Assessment request:', { assessmentType, responseCount: responses.length });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Create AI prompt based on assessment type
    const systemPrompt = `You are an expert educational psychologist specializing in neurodiverse learning assessments. 
Analyze the assessment responses and provide a detailed learning profile.

Return your analysis as a JSON object with this exact structure:
{
  "profileType": "adhd" | "dyslexia" | "autism" | "mixed" | "neurotypical",
  "confidence": 0-100,
  "scores": {
    "attention": 0-100,
    "processing_speed": 0-100,
    "working_memory": 0-100,
    "reading_fluency": 0-100,
    "executive_function": 0-100
  },
  "recommendations": {
    "reading_speed": "slow" | "medium" | "fast",
    "font_preference": "dyslexic" | "standard",
    "color_scheme": "high_contrast" | "standard" | "dark",
    "break_frequency": "high" | "medium" | "low",
    "content_chunking": "small" | "medium" | "large"
  },
  "strengths": ["strength1", "strength2"],
  "challenges": ["challenge1", "challenge2"],
  "summary": "Brief summary of the learning profile"
}`;

    const userPrompt = `Assessment Type: ${assessmentType}
Responses: ${JSON.stringify(responses, null, 2)}

Analyze these responses and provide a comprehensive learning profile.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    let analysisText = data.choices[0].message.content;
    
    // Remove markdown code blocks if present
    analysisText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const analysis = JSON.parse(analysisText);

    console.log('Assessment complete:', analysis.profileType);

    return new Response(
      JSON.stringify({ success: true, analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in assess-profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
