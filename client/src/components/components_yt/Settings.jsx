import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Settings({ apiKey, setApiKey }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">YouTube API Key</Label>
          <Input
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your YouTube API Key"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          You can get your YouTube API key from the{' '}
          <a
            href="https://console.cloud.google.com/apis/credentials"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Google Cloud Console
          </a>
        </p>
      </CardContent>
    </Card>
  );
}