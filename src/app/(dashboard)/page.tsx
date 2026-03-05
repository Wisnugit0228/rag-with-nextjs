"use client";
import { DarkmodeToggle } from "@/components/common/darkmode-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div>
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>Wellcome to your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <span className="font-medium">{user?.name}</span>
            <span className="text-xs text-muted-foreground">{user?.email}</span>
            <span className="text-xs text-muted-foreground">
              {user?.role.name}
            </span>
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
