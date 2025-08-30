/*
  AI Integration Endpoints for Second Brain
  
  These endpoints are prepared for future AI integration:
  - NLP processing for note content
  - Smart categorization and tagging
  - Content extraction from images
  - Intelligent insights and recommendations
*/

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface ProcessNoteRequest {
  content: string;
  type: 'text' | 'task' | 'image' | 'file';
  metadata?: any;
}

interface ProcessNoteResponse {
  suggested_tags: string[];
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  summary?: string;
  insights?: string[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;

    switch (path) {
      case '/ai-endpoints/process-note':
        return await processNote(req);
      case '/ai-endpoints/generate-insights':
        return await generateInsights(req);
      case '/ai-endpoints/smart-search':
        return await smartSearch(req);
      default:
        return new Response(
          JSON.stringify({ error: 'Endpoint not found' }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function processNote(req: Request): Promise<Response> {
  try {
    const { content, type, metadata }: ProcessNoteRequest = await req.json();

    // Placeholder for future AI processing
    // This would integrate with OpenAI, Claude, or other AI services
    const mockResponse: ProcessNoteResponse = {
      suggested_tags: generateMockTags(content, type),
      priority: type === 'task' ? 'medium' : undefined,
      category: inferCategory(content, type),
      summary: content.length > 100 ? content.substring(0, 100) + '...' : content,
      insights: generateMockInsights(content, type),
    };

    return new Response(
      JSON.stringify(mockResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to process note' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}

async function generateInsights(req: Request): Promise<Response> {
  try {
    const { notes, goals, stats } = await req.json();

    // Placeholder for AI-generated insights
    const insights = [
      "You've been most productive on weekdays this month.",
      "Consider breaking down larger tasks into smaller, actionable items.",
      "Your note-taking frequency has increased by 25% this week.",
    ];

    return new Response(
      JSON.stringify({ insights }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to generate insights' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}

async function smartSearch(req: Request): Promise<Response> {
  try {
    const { query, notes } = await req.json();

    // Placeholder for semantic search
    // This would use vector embeddings and similarity search
    const filteredNotes = notes.filter((note: any) =>
      note.content.toLowerCase().includes(query.toLowerCase()) ||
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.tags.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()))
    );

    return new Response(
      JSON.stringify({ results: filteredNotes }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Search failed' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}

// Helper functions for mock AI responses
function generateMockTags(content: string, type: string): string[] {
  const commonWords = content.toLowerCase().match(/\b\w{4,}\b/g) || [];
  const uniqueWords = [...new Set(commonWords)].slice(0, 3);
  return [type, ...uniqueWords];
}

function inferCategory(content: string, type: string): string {
  if (type === 'task') return 'productivity';
  if (content.toLowerCase().includes('meeting')) return 'meetings';
  if (content.toLowerCase().includes('idea')) return 'ideas';
  if (content.toLowerCase().includes('learn')) return 'learning';
  return 'general';
}

function generateMockInsights(content: string, type: string): string[] {
  const insights = [];
  
  if (type === 'task') {
    insights.push('Consider setting a deadline for better time management');
  }
  
  if (content.length > 200) {
    insights.push('Long note detected - consider breaking into smaller pieces');
  }
  
  if (content.toLowerCase().includes('important')) {
    insights.push('High priority content identified');
  }
  
  return insights;
}