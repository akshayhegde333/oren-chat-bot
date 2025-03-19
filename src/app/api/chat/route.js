import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

// Initialize OpenAI with API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Oren documentation links - actual documentation URLs
const orenDocLinks = [
    { title: "Oren Homepage", url: "https://www.orennow.com" },
    { title: "BRSR Compliance", url: "https://www.orennow.com/brsr" },
    { title: "Sustainability Solutions", url: "https://www.orennow.com/solutions" },
    { title: "Oren Blog", url: "https://www.orennow.com/blogs" },
    { title: "Schedule a Demo", url: "https://www.orennow.com/schedule-demo" },
    { title: "Oren Support", url: "https://www.orennow.com/support" }
];

// Basic information about Oren to use when links aren't accessible
const orenBasicInfo = `
# Oren Documentation

## Product Overview
Oren is a comprehensive sustainability platform dedicated to empowering businesses with the tools they need to achieve their sustainability goals. With decades of combined experience, Oren provides award-winning software solutions designed to simplify and automate your sustainability journey.

## Core Features
- Sustainability reporting and compliance with BRSR, GRI, and other frameworks
- Automated ESG data collection through API integration
- Team collaboration across departments, locations, and business units
- Value chain partner engagement on sustainability initiatives
- In-built GHG calculation for Scope 1, 2, and 3 emissions
- Digital audit trail for sustainability data and reports

## Solutions
- BRSR (Business Responsibility and Sustainability Reporting) compliance
- Decarbonisation tools and tracking
- Supply Chain Sustainability management
- EcoVadis support and integration

## Support Contact
Email: support@orennow.com
Website: https://www.orennow.com/support
For Demo: https://www.orennow.com/schedule-demo
`;

// Load company documentation
const loadCompanyDocs = async () => {
    try {
        // Check if we have the oren-info.md file
        const orenInfoPath = path.join(process.cwd(), 'public', 'docs', 'oren-info.md');

        if (fs.existsSync(orenInfoPath)) {
            console.log(`Oren documentation found at: ${orenInfoPath}`);
            // Read the markdown file and return its contents
            return fs.readFileSync(orenInfoPath, 'utf8');
        }

        // If the file doesn't exist, log a warning and return the fallback info
        console.warn('oren-info.md not found, using fallback information');

        // Add references to documentation links as fallback
        const docLinksText = orenDocLinks.map(link =>
            `- [${link.title}](${link.url})`
        ).join('\n');

        return `${orenBasicInfo}

## Documentation Links
The following documentation is available online for more detailed information:
${docLinksText}

Note: For the most up-to-date and comprehensive information, please refer to the official Oren documentation links above.`;
    } catch (error) {
        console.error('Error loading Oren documentation:', error);
        return 'Error loading Oren documentation. Please check your configuration.';
    }
};

export async function POST(req) {
    try {
        const { messages } = await req.json();

        // Log request for debugging
        console.log('Received chat request:', { messageCount: messages.length });

        // Load company docs
        const companyDocs = await loadCompanyDocs();

        // Create system message with context
        const systemMessage = {
            role: 'system',
            content: `You are a helpful customer support chatbot for Oren, a sustainability platform. 
                    
                    IMPORTANT: Only use the information provided in the Oren documentation below to answer questions.
                    Do not use any other knowledge you may have about Oren or sustainability platforms.
                    
                    Use the following company information to answer user questions:
                    
                    ${companyDocs}
                    
                    When answering questions:
                    1. First, thoroughly search the provided documentation above for relevant information
                    2. If you find the information, provide a clear and concise response based on that content
                    3. If the information is not in the documentation, refer to one of these Oren documentation links:
                    ${orenDocLinks.map(link => `- [${link.title}](${link.url})`).join('\n')}
                    
                    Do not ask the user for additional information or clarification. Instead, search through the 
                    provided documentation thoroughly to find relevant information.
                    
                    For BRSR-related questions, reference the BRSR Compliance sections in the documentation.
                    For general product questions, reference the Product Overview and Core Features sections.
                    
                    If the information cannot be found in the documentation or isn't covered by the links,
                    simply state: "This information is not available in our current documentation. Please visit 
                    https://www.orennow.com/support for assistance."
                    
                    Keep your answers concise, friendly, and professional.
                    give your respone in html format or Markdown format.
                    `
        };

        // Prepare messages array for OpenAI
        const allMessages = [systemMessage, ...messages];

        try {
            // Call the OpenAI API
            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: allMessages,
            });

            const aiResponse = completion.choices[0].message.content;

            // Return the AI response
            return new Response(aiResponse, {
                headers: {
                    'Content-Type': 'text/plain; charset=utf-8',
                },
            });
        } catch (apiError) {
            console.error('OpenAI API error:', apiError);
            return new Response(
                `Error connecting to OpenAI API: ${apiError.message}. Make sure you've set your OPENAI_API_KEY in .env.local`,
                {
                    status: 500,
                    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
                }
            );
        }
    } catch (error) {
        console.error('Error in chat API:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
} 