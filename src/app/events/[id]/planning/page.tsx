import PlanningGrid from "@/components/planning/PlanningGrid"
import Navbar from "@/components/navbar/Navbar"

export default async function PlanningPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  return (
    <main className="p-24 min-h-screen text-[var(--foreground)]" style={{ background: "var(--page-gradient)" }}>
      <Navbar />
      <PlanningGrid eventId={id} />
    </main>
  )
}