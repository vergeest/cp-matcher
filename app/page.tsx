import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Partner Matching App</CardTitle>
          <CardDescription>
            Login with your Stellenbosch University credentials to select and match with partners
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <p className="mb-6 text-center text-muted-foreground">
            This application allows you to select potential partners and matches you based on mutual preferences.
          </p>
          <Link href="/api/auth/login" className="w-full">
            <Button className="w-full" size="lg">
              Login with SSO
            </Button>
          </Link>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          Secure authentication via Stellenbosch University SSO
        </CardFooter>
      </Card>
    </main>
  )
}

