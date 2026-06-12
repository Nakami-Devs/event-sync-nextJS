import Link from "next/link";
import {ArrowLeft} from "lucide-react";

interface PageHeaderProps {
    title: string;
    count: number;
    singular: string;
    plural?: string;
}

export default function PageHeader({ title, count, singular, plural }: PageHeaderProps) {
    const label = count > 1 ? (plural ?? `${singular}s`) : singular;

    return (
        <>
            <div className="flex items-center gap-3 mb-2">
                <Link
                    href="/"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 border border-white/10"
                    title="Retour à l'accueil"
                >
                    <ArrowLeft size={20} className="text-white"/>
                </Link>
                <h1 className="text-4xl font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    {title}
                </h1>
            </div>
            <p className="text-gray-400 mb-10">
                {count} {label} au total
            </p>
        </>
    )
}