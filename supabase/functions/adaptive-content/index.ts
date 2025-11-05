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
    const { content, learningProfile, action } = await req.json();
    console.log('Adaptive content request:', { action, profileType: learningProfile.profile_type });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    if (action === 'simplify') {
      systemPrompt = `You are an adaptive learning content optimizer for neurodiverse students.
Simplify the content based on the user's learning profile while maintaining educational value.

Learning Profile: ${learningProfile.profile_type}
Preferences: ${JSON.stringify(learningProfile.preferences)}

Guidelines:
- Use shorter sentences and paragraphs
- Replace complex vocabulary with simpler alternatives
- Add visual structure (bullet points, numbered lists)
- Break content into digestible chunks
- Maintain core concepts and learning objectives`;

      userPrompt = `Simplify this content:\n\n${content}`;
    } else if (action === 'suggest_activities') {
      systemPrompt = `You are an educational activity designer for neurodiverse learners.
Create engaging, personalized learning activities based on the content and learning profile.

Return 3-5 activities as a JSON array with this structure:
[
  {
    "title": "Activity title",
    "description": "What students will do",
    "duration": "estimated time in minutes",
    "difficulty": "easy|medium|hard",
    "type": "interactive|reflection|creative|practice"
  }
]`;

      userPrompt = `Content: ${content}\n\nLearning Profile: ${learningProfile.profile_type}
Create personalized learning activities for this content.`;
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
          { role: 'user', content: userPrompt }
        ],
        ...(action === 'suggest_activities' && { response_format: { type: 'json_object' } })
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices[0].message.content;

    console.log('Adaptive content generated successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        result: action === 'suggest_activities' ? JSON.parse(result) : result 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in adaptive-content:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
