 import { useState } from "react";
 import { Button } from "@/components/ui/button";
 import { Checkbox } from "@/components/ui/checkbox";
 import { Label } from "@/components/ui/label";
 import { Badge } from "@/components/ui/badge";
 import { Copy, Check, Sparkles, Zap } from "lucide-react";
 import { generateConversionPrompt, type ConversionConfig } from "./promptTemplates";
 import { toast } from "sonner";
 
 const featureOptions = [
   { id: "supabase", label: "Supabase / Database", description: "PostgreSQL, RLS, realtime" },
   { id: "auth", label: "Authentication", description: "Login, signup, sessions" },
   { id: "reactRouter", label: "React Router", description: "Client-side routing" },
   { id: "tailwind", label: "Tailwind CSS", description: "Utility-first styling" },
   { id: "shadcn", label: "shadcn/ui Components", description: "UI component library" },
   { id: "tanstackQuery", label: "TanStack Query", description: "Data fetching & caching" },
   { id: "apiIntegrations", label: "External APIs", description: "Third-party integrations" },
 ] as const;
 
 const projectTypes = [
   { id: "spa", label: "Single Page App" },
   { id: "dashboard", label: "Dashboard / Admin" },
   { id: "ecommerce", label: "E-commerce" },
   { id: "blog", label: "Blog / Content" },
 ] as const;
 
 export function ConversionTool() {
   const [config, setConfig] = useState<ConversionConfig>({
     features: {
       supabase: true,
       auth: true,
       reactRouter: true,
       tailwind: true,
       shadcn: true,
       tanstackQuery: false,
       apiIntegrations: false,
     },
     nextVersion: "14",
     projectType: "spa",
   });
   const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
   const [copied, setCopied] = useState(false);
 
   const handleFeatureToggle = (feature: keyof ConversionConfig["features"]) => {
     setConfig((prev) => ({
       ...prev,
       features: {
         ...prev.features,
         [feature]: !prev.features[feature],
       },
     }));
   };
 
   const handleGenerate = () => {
     const prompt = generateConversionPrompt(config);
     setGeneratedPrompt(prompt);
     toast.success("Conversion prompt generated!");
   };
 
   const handleCopy = async () => {
     await navigator.clipboard.writeText(generatedPrompt);
     setCopied(true);
     toast.success("Copied to clipboard!");
     setTimeout(() => setCopied(false), 2000);
   };
 
   const selectedCount = Object.values(config.features).filter(Boolean).length;
 
   return (
     <div className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-6">
       <div className="flex items-center gap-3 mb-2">
         <div className="p-2 rounded-lg bg-primary/10">
           <Zap className="h-5 w-5 text-primary" />
         </div>
         <div>
           <h2 className="text-xl font-bold">Conversion Prompt Generator</h2>
           <p className="text-sm text-muted-foreground">Select your stack, get a personalized migration prompt</p>
         </div>
       </div>
 
       {/* Feature Selection */}
       <div className="space-y-4">
         <div className="flex items-center justify-between">
           <Label className="text-base font-semibold">What's in your Lovable project?</Label>
           <Badge variant="secondary">{selectedCount} selected</Badge>
         </div>
         <div className="grid sm:grid-cols-2 gap-3">
           {featureOptions.map((feature) => (
             <label
               key={feature.id}
               className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                 config.features[feature.id as keyof ConversionConfig["features"]]
                   ? "border-primary bg-primary/5"
                   : "border-border hover:border-primary/50"
               }`}
             >
               <Checkbox
                 checked={config.features[feature.id as keyof ConversionConfig["features"]]}
                 onCheckedChange={() => handleFeatureToggle(feature.id as keyof ConversionConfig["features"])}
                 className="mt-0.5"
               />
               <div>
                 <p className="font-medium text-sm">{feature.label}</p>
                 <p className="text-xs text-muted-foreground">{feature.description}</p>
               </div>
             </label>
           ))}
         </div>
       </div>
 
       {/* Version Selection */}
       <div className="space-y-3">
         <Label className="text-base font-semibold">Target Next.js Version</Label>
         <div className="flex gap-3">
           {(["14", "15"] as const).map((version) => (
             <button
               key={version}
               onClick={() => setConfig((prev) => ({ ...prev, nextVersion: version }))}
               className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                 config.nextVersion === version
                   ? "border-primary bg-primary text-primary-foreground"
                   : "border-border hover:border-primary/50"
               }`}
             >
               Next.js {version}
             </button>
           ))}
         </div>
       </div>
 
       {/* Project Type */}
       <div className="space-y-3">
         <Label className="text-base font-semibold">Project Type</Label>
         <div className="flex flex-wrap gap-2">
           {projectTypes.map((type) => (
             <button
               key={type.id}
               onClick={() => setConfig((prev) => ({ ...prev, projectType: type.id }))}
               className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                 config.projectType === type.id
                   ? "bg-primary text-primary-foreground"
                   : "bg-muted hover:bg-muted/80"
               }`}
             >
               {type.label}
             </button>
           ))}
         </div>
       </div>
 
       {/* Generate Button */}
       <Button onClick={handleGenerate} size="lg" className="w-full">
         <Sparkles className="mr-2 h-4 w-4" />
         Generate Conversion Prompt
       </Button>
 
       {/* Output */}
       {generatedPrompt && (
         <div className="space-y-3 pt-4 border-t border-border">
           <div className="flex items-center justify-between">
             <Label className="text-base font-semibold">Your Personalized Prompt</Label>
             <Button variant="outline" size="sm" onClick={handleCopy}>
               {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
               {copied ? "Copied!" : "Copy"}
             </Button>
           </div>
           <div className="bg-muted/50 rounded-lg p-4 max-h-96 overflow-y-auto">
             <pre className="text-sm whitespace-pre-wrap font-mono">{generatedPrompt}</pre>
           </div>
           <p className="text-xs text-muted-foreground text-center">
             Paste this prompt into Cursor, Claude, or ChatGPT to start your migration
           </p>
         </div>
       )}
     </div>
   );
 }