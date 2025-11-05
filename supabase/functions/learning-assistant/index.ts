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
    const { message, learningProfile, context } = await req.json();
    console.log('Learning assistant query:', { profileType: learningProfile?.profile_type });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = `You are a supportive AI learning assistant for neurodiverse students.

Student Learning Profile: ${learningProfile ? learningProfile.profile_type : 'Not assessed yet'}
${learningProfile ? `Strengths: ${JSON.stringify(learningProfile.assessment_score?.strengths || [])}` : ''}
${learningProfile ? `Challenges: ${JSON.stringify(learningProfile.assessment_score?.challenges || [])}` : ''}

Your role:
- Provide patient, encouraging support
- Break down complex concepts into simple steps
- Use visual language and examples
- Celebrate progress and effort
- Adapt explanations to the student's learning style
- Suggest breaks when needed
- Make learning fun and engaging

Communication style:
- Use short, clear sentences
- Include emojis for emotional support 😊
- Provide step-by-step guidance
- Ask clarifying questions
- Offer multiple ways to understand concepts`;

    let userMessage = message;
    if (context) {
      userMessage = `Context: ${context}\n\nQuestion: ${message}`;
    }

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
          { role: 'user', content: userMessage }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    console.log('Assistant response generated');

    return new Response(
      JSON.stringify({ success: true, reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in learning-assistant:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
