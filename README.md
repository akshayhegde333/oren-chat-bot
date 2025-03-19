# Oren Support Chatbot

A Next.js application featuring an AI-powered chatbot that answers user questions about Oren using company documentation.

## Features

- Interactive chat interface for users to ask questions
- AI-powered responses based on Oren documentation
- Support for documentation from multiple sources (local files and web links)
- Mobile-responsive design

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env.local` file in the root directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_openai_api_key_here
   ```
4. Add your Oren documentation:
   - **Option 1 (Local Markdown)**: Add your documentation to `public/docs/oren-info.md`
   - **Option 2 (Web Links)**: Update the documentation links in `src/app/api/chat/route.js` with your actual URLs
5. Start the development server:
   ```
   npm run dev
   ```
6. Access the application at http://localhost:3000

## Using Documentation Links

The chatbot can now reference external documentation links. To configure this:

1. Open `src/app/api/chat/route.js`
2. Update the `orenDocLinks` array with your actual documentation URLs:
   ```javascript
   const orenDocLinks = [
       { title: "Oren Product Overview", url: "https://your-site.com/oren/overview" },
       { title: "Oren Key Features", url: "https://your-site.com/oren/features" },
       // Add more links as needed
   ];
   ```
3. The chatbot will use these links for context and can refer users to them when appropriate

## Using Local Documentation

For offline access or more control over the content, you can use local documentation:

1. Create a Markdown file at `public/docs/oren-info.md`
2. Add your comprehensive documentation to this file
3. The application will automatically use this file when available

## Deployment

This application can be deployed on Vercel or any other Next.js hosting platform:

```
npm run build
```

## Technologies Used

- Next.js
- OpenAI API
- Tailwind CSS 