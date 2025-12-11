import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import PromptDetail from "./pages/PromptDetail";
import Auth from "./pages/Auth";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import Categories from "./pages/Categories";
import Trending from "./pages/Trending";
import Submit from "./pages/Submit";
import NotFound from "./pages/NotFound";
import CursorPrompts from "./pages/CursorPrompts";
import LovablePrompts from "./pages/LovablePrompts";
import GithubCopilotPrompts from "./pages/GithubCopilotPrompts";
import ChatGPTPrompts from "./pages/ChatGPTPrompts";
import GeminiPrompts from "./pages/GeminiPrompts";
import ClaudePrompts from "./pages/ClaudePrompts";
import AICodeGenerator from "./pages/AICodeGenerator";
import BestAIForCoding from "./pages/BestAIForCoding";
import Generate from "./pages/Generate";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/prompt/:slug" element={<PromptDetail />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<Profile />} />
          {/* SEO Landing Pages */}
          <Route path="/cursor-prompts" element={<CursorPrompts />} />
          <Route path="/lovable-prompts" element={<LovablePrompts />} />
          <Route path="/github-copilot-prompts" element={<GithubCopilotPrompts />} />
          <Route path="/chatgpt-prompts" element={<ChatGPTPrompts />} />
          <Route path="/gemini-prompts" element={<GeminiPrompts />} />
          <Route path="/claude-prompts" element={<ClaudePrompts />} />
          <Route path="/ai-code-generator" element={<AICodeGenerator />} />
          <Route path="/best-ai-for-coding" element={<BestAIForCoding />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
