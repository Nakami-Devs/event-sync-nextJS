import PlanningGrid from "@/components/planning/PlanningGrid"
import Navbar from "@/components/Navbar"

export default function PlanningPage({params}: {params: {id: string}}) {
  return (
    <main className="p-24 min-h-screen bg-gradient-to-r from-purple-950 to-blue-950 text-white">
      <Navbar />
      <PlanningGrid />
    </main>
  )
}