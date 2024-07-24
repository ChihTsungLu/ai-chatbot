# AI Chatbot

This application is developed using Next.js and Tailwind CSS, and it integrates LangChain and the Vercel SDK for advanced natural language processing capabilities. 
Additionally, Puppeteer and Bright Data are employed for web scraping and analyzing Amazon Best Seller data.
## Getting Started

### Prerequisites

Make sure you have Node.js and npm installed on your machine.

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/ChihTsungLu/ai-chatbot.git
   cd ai-chatbot
   ```
2. Install dependencies
   ```
   npm install
   ```
### Running the Development Server
   ```
   npm run dev
   ```

### OpenAI API Key
The OpenAI API Key is stored in the .env file. Ensure you have your API key set up as follows:
   ```
       #.env
       OPENAI_API_KEY=YOUR_OPENAI_API_KEY
   ```
    
Replace YOUR_OPENAI_API_KEY with your actual OpenAI API key.

### Bright Data API Key
The Bright Data API Key is stored in the .env file. Ensure you have your API key set up as follows:
   ```
       #.env
       BRIGHT_DATA_KEY=YOUR_BRIGHT_DATA_KEY
   ```
    
Replace YOUR_OPENAI_API_KEY with your actual OpenAI API key.

### Technologies Used

- **Next.js**: React framework for server-side rendering and static site generation.
- **Tailwind CSS**: Utility-first CSS framework.
- **LangChain**: Integration for advanced natural language processing.
- **Vercel SDK**: Deployment and serverless functions.
- **Puppeteer**: Scraping web pages and automating web interactions.
- **Bright Data**: Solution to overcoming website scraping blocks.
