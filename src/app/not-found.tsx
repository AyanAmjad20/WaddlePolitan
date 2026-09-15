import { EmptyState } from "@/components/ui/feedback";
import { ButtonLink } from "@/components/ui/button";
export default function NotFound() { return <div className="mx-auto max-w-xl px-5 py-20"><EmptyState title="This one wandered off" description="That page does not exist. Head back to campus to see the latest demo sightings." action={<ButtonLink href="/map">Explore campus</ButtonLink>} /></div>; }
