import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMyProfile } from "@/lib/dal/users";

const countries = ["Romania", "Germany", "France", "United States"];

const notifications = [
  { id: "notifySale", label: "Email me when I make a sale", defaultChecked: true },
  { id: "notifyWeekly", label: "Weekly summary of my store", defaultChecked: false },
];

export default async function SettingsPage() {
  // The signed-in user's own profile (read in the DAL).
  const profile = await getMyProfile();

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Your profile, handle and delivery preferences.
        </p>
      </div>

      {/* Values come from the signed-in user (S6) and are saved with a server action (S7). */}
      <form className="flex max-w-2xl flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="displayName">Display name</Label>
              <Input id="displayName" name="displayName" defaultValue={profile.displayName} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="handle">Public handle</Label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">@</span>
                <Input id="handle" name="handle" defaultValue={profile.handle} />
              </div>
              <p className="text-xs text-muted-foreground">
                Your storefront address: /@{profile.handle}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery</CardTitle>
            <CardDescription>Where receipts and download links are sent.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="deliveryEmail">Delivery email</Label>
              <Input
                id="deliveryEmail"
                name="deliveryEmail"
                type="email"
                defaultValue={profile.deliveryEmail}
              />
            </div>
            {notifications.map((option) => (
              <div key={option.id} className="flex items-center gap-2">
                <Checkbox
                  id={option.id}
                  name={option.id}
                  defaultChecked={option.defaultChecked}
                />
                <Label htmlFor={option.id}>{option.label}</Label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing</CardTitle>
            <CardDescription>Used on receipts and passed to Stripe.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="billingName">Name or company</Label>
              <Input id="billingName" name="billingName" defaultValue={profile.displayName} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="country">Country</Label>
              <Select name="country" defaultValue="Romania">
                <SelectTrigger id="country" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="vatId">VAT ID (optional)</Label>
              <Input id="vatId" name="vatId" placeholder="RO12345678" />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button type="submit">Save changes</Button>
          <Button type="reset" variant="ghost">
            Discard
          </Button>
        </div>
      </form>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Privacy</CardTitle>
          <CardDescription>Download your data or close your account.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline">Export my data</Button>
          <Button variant="destructive">Delete account</Button>
        </CardContent>
      </Card>
    </div>
  );
}
