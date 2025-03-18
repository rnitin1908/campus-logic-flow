
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';

export function UpcomingEvents() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>Your schedule for the coming days</CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          className="rounded-md border"
        />
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-2 rounded-lg border p-3 transition-colors hover:bg-muted/50">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <span className="text-sm font-semibold">10</span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium">Faculty Meeting</h4>
              <p className="text-xs text-muted-foreground">10:00 AM - 11:30 AM</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border p-3 transition-colors hover:bg-muted/50">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <span className="text-sm font-semibold">12</span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium">Semester Planning</h4>
              <p className="text-xs text-muted-foreground">2:00 PM - 4:00 PM</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border p-3 transition-colors hover:bg-muted/50">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <span className="text-sm font-semibold">15</span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium">Exam Week Begins</h4>
              <p className="text-xs text-muted-foreground">All Day</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
