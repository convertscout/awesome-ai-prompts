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
import { Plus, Upload } from "lucide-react";

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
    customCategory: "",
    tags: "",
    language: "",
    framework: "",
    contentType: "prompt",
    customContentType: "",
    url: "",
    buttonText: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Logo must be less than 2MB");
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      let logoUrl = null;

      // Upload logo if provided
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${user?.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('logos')
          .upload(filePath, logoFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('logos')
          .getPublicUrl(filePath);

        logoUrl = publicUrl;
      }

      // Use custom values if provided, otherwise use selected values
      const finalContentType = formData.customContentType || formData.contentType;
      const finalCategory = formData.customCategory || formData.category;

      const { error } = await supabase.from("prompts").insert([{
        title: formData.title,
        description: formData.description,
        content: formData.content,
        category: finalCategory as any,
        tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        language: formData.language || null,
        framework: formData.framework || null,
        content_type: finalContentType,
        url: formData.url || null,
        logo_url: logoUrl,
        button_text: formData.buttonText || null,
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
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com (optional)"
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground">
                Add a link to the resource, company website, or documentation
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Logo (for MCP/Job)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="bg-background"
                />
                {logoPreview && (
                  <img src={logoPreview} alt="Logo preview" className="w-12 h-12 rounded object-cover" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Upload a small logo (max 2MB) for MCPs or Job company branding
              </p>
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
                <Select value={formData.contentType} onValueChange={(value) => setFormData({ ...formData, contentType: value, customContentType: "" })}>
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
                    <SelectItem value="code">Code</SelectItem>
                    <SelectItem value="job">Job</SelectItem>
                    <SelectItem value="custom">Custom (type below)</SelectItem>
                  </SelectContent>
                </Select>
                {formData.contentType === "custom" && (
                  <Input
                    value={formData.customContentType}
                    onChange={(e) => setFormData({ ...formData, customContentType: e.target.value })}
                    placeholder="Enter custom type"
                    required
                    className="bg-background mt-2"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category*</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value, customCategory: "" })}>
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
                    <SelectItem value="data_visualization">Data Visualization</SelectItem>
                    <SelectItem value="authentication">Authentication</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="custom">Custom (type below)</SelectItem>
                  </SelectContent>
                </Select>
                {formData.category === "custom" && (
                  <Input
                    value={formData.customCategory}
                    onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                    placeholder="Enter custom category"
                    required
                    className="bg-background mt-2"
                  />
                )}
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

            <div className="space-y-2">
              <Label htmlFor="buttonText">Button Text (Optional)</Label>
              <Input
                id="buttonText"
                value={formData.buttonText}
                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                placeholder="Leave blank for default (Copy Prompt or Apply Now)"
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground">
                Custom label for the action button. Jobs/Freelance default to "Apply Now", others to "Copy Prompt"
              </p>
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
