import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Plus } from "lucide-react";

const Submit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "ui_ux",
    tags: "",
    language: "",
    framework: "",
    contentType: "prompt",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to submit resources");
        navigate("/auth");
      } else {
        setIsAuthenticated(true);
      }
      setCheckingAuth(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase.from("prompts").insert([{
        title: formData.title,
        description: formData.description,
        content: formData.content,
        category: formData.category as any,
        tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        language: formData.language || null,
        framework: formData.framework || null,
        content_type: formData.contentType,
        author_id: user?.id || null,
      }]);

      if (error) throw error;

      toast.success("Submitted successfully!");
      navigate("/browse");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-12 px-4 text-center">
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Plus className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Submit to Directory</h1>
              <p className="text-muted-foreground mt-1">
                Share your prompts, templates, and resources with the community
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border rounded-lg p-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title*</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Give your submission a clear title"
                required
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description*</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what this does and how to use it"
                required
                className="bg-background min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content*</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Paste your prompt, code, or instructions here"
                required
                className="bg-background min-h-[200px] font-mono text-sm"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contentType">Type*</Label>
                <Select value={formData.contentType} onValueChange={(value) => setFormData({ ...formData, contentType: value })}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prompt">Prompt</SelectItem>
                    <SelectItem value="template">Template</SelectItem>
                    <SelectItem value="component">Component</SelectItem>
                    <SelectItem value="guide">Guide</SelectItem>
                    <SelectItem value="resource">Resource</SelectItem>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="tool">Tool</SelectItem>
                    <SelectItem value="tutorial">Tutorial</SelectItem>
                    <SelectItem value="mcp">MCP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category*</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ui_ux">UI/UX</SelectItem>
                    <SelectItem value="components">Components</SelectItem>
                    <SelectItem value="integrations">Integrations</SelectItem>
                    <SelectItem value="best_practices">Best Practices</SelectItem>
                    <SelectItem value="animations">Animations</SelectItem>
                    <SelectItem value="forms">Forms</SelectItem>
                    <SelectItem value="layouts">Layouts</SelectItem>
                    <SelectItem value="authentication">Authentication</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language/Framework</Label>
                <Input
                  id="language"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  placeholder="e.g., TypeScript, Python"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="framework">Library/Tool</Label>
                <Input
                  id="framework"
                  value={formData.framework}
                  onChange={(e) => setFormData({ ...formData, framework: e.target.value })}
                  placeholder="e.g., React, TailwindCSS"
                  className="bg-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g., authentication, forms, api (comma-separated)"
                className="bg-background"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Submit;
