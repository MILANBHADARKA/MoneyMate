import Image from "next/image";
import Hero from "@/components/hero/Hero";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <Hero />
    </ProtectedRoute>
  );
} 