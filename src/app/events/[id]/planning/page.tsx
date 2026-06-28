import PlanningGrid from "@/components/planning/PlanningGrid"
import Navbar from "@/components/navbar/Navbar"

export default  async function PlanningPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;

  return (
    <main className="p-24 min-h-screen bg-gradient-to-r from-purple-950 to-blue-950 text-white">
      <Navbar />
      <PlanningGrid eventId={id} />
    </main>
  )
}