import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  Share2,
  ExternalLink,
} from "lucide-react";
import { getEventById } from "@/lib/api/events.server";

const TYPE_LABELS: Record<string, string> = {
  WORKSHOP: "Workshop",
  HACKATHON: "Hackathon",
  TALK: "Talk",
  BOOTCAMP: "Bootcamp",
  SOCIAL: "Social",
  OTHER: "Other",
};

const TYPE_COLORS: Record<string, string> = {
  WORKSHOP: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  HACKATHON: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  TALK: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  BOOTCAMP: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  SOCIAL: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  OTHER: "bg-muted text-muted-foreground border-border",
};

export const Route = createFileRoute("/events/$eventId")({
  head: () => ({
    meta: [
      { title: "Event Details | BlockchainClub FUTMinna" },
      { name: "description", content: "Event details from Blockchain Club FUTMinna." },
    ],
  }),
  component: EventDetailPage,
});

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(date: Date | string) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function EventDetailSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 space-y-8">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="aspect-[2/1] w-full rounded-xl" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

function EventDetailPage() {
  const params = Route.useParams();
  const eventId = params.eventId;
  const fetchEvent = useServerFn(getEventById);

  const { data: event, isLoading, error } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => fetchEvent({ data: { id: eventId } }),
  });

  if (isLoading) return <EventDetailSkeleton />;

  if (error || !event) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16 text-center">
        <p className="text-muted-foreground">Event not found.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/events">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
          </Link>
        </Button>
      </div>
    );
  }

  const isPast = new Date(event.startDate) < new Date();

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Button asChild variant="ghost" className="mb-6 -ml-2">
          <Link to="/events">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
          </Link>
        </Button>

        {event.coverImage && (
          <div className="aspect-[2/1] w-full rounded-xl overflow-hidden mb-8">
            <img
              src={event.coverImage}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="outline" className={TYPE_COLORS[event.type] || TYPE_COLORS.OTHER}>
            {TYPE_LABELS[event.type] || event.type}
          </Badge>
          {event.isFeatured && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Featured
            </Badge>
          )}
          {isPast && (
            <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
              Past Event
            </Badge>
          )}
        </div>

        <h1 className="text-headline-xl md:text-display-md tracking-tight mb-6">
          {event.title}
        </h1>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <Card className="md:col-span-2 border-border bg-card">
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-headline-sm mb-3">About This Event</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {event.description || "No description available."}
                </p>
              </div>

              {event.agenda && (
                <div>
                  <h2 className="text-headline-sm mb-3">Agenda</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {event.agenda}
                  </p>
                </div>
              )}

              {event.speakers && event.speakers.length > 0 && (
                <div>
                  <h2 className="text-headline-sm mb-3">Speakers</h2>
                  <div className="flex flex-wrap gap-3">
                    {event.speakers.map((speaker: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-sm">
                        {speaker}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border-border bg-card">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-headline-sm">Event Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    <div>
                      <p className="font-medium">{formatDate(event.startDate)}</p>
                      <p className="text-muted-foreground">
                        {formatTime(event.startDate)}
                        {event.endDate && ` - ${formatTime(event.endDate)}`}
                      </p>
                    </div>
                  </div>
                  {event.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                      <p className="font-medium">{event.location}</p>
                    </div>
                  )}
                  {event.isVirtual && (
                    <div className="flex items-start gap-3">
                      <ExternalLink className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                      <p className="font-medium">Virtual Event</p>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <Users className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    <p className="font-medium">
                      {"rsvps" in event ? event.rsvps.length : 0} RSVPs
                    </p>
                  </div>
                  {event.maxAttendees && (
                    <div className="flex items-start gap-3">
                      <Clock className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                      <p className="font-medium">
                        {event.maxAttendees - ("rsvps" in event ? event.rsvps.length : 0)} spots left
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {!isPast && (
              <Button className="w-full" size="lg">
                RSVP Now
              </Button>
            )}
            <Button variant="outline" className="w-full" size="lg">
              <Share2 className="mr-2 h-4 w-4" /> Share Event
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
