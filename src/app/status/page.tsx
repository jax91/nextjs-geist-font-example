"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";

interface SectionStatus {
  label: string;
  key: string;
  completed: boolean;
  description: string;
}

export default function StatusPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<number>(0);
  const [sections, setSections] = useState<SectionStatus[]>([
    { 
      label: "Senhas", 
      key: "passwordsCompleted", 
      completed: false,
      description: "Credenciais e senhas importantes"
    },
    { 
      label: "Últimos Desejos", 
      key: "wishesCompleted", 
      completed: false,
      description: "Seus desejos e pedidos finais"
    },
    { 
      label: "Informações Financeiras", 
      key: "financialCompleted", 
      completed: false,
      description: "Documentos e contas financeiras"
    },
    { 
      label: "Confissões", 
      key: "confessionsCompleted", 
      completed: false,
      description: "Pensamentos e segredos privados"
    },
    { 
      label: "Beneficiários", 
      key: "beneficiarySetup", 
      completed: false,
      description: "Configuração dos beneficiários"
    },
  ]);

  useEffect(() => {
    try {
      // Update sections status based on localStorage values
      const updatedSections = sections.map((section) => {
        const storedValue = localStorage.getItem(section.key);
        return {
          ...section,
          completed: storedValue === "true",
        };
      });
      setSections(updatedSections);

      // Calculate percentage
      const completedCount = updatedSections.filter(s => s.completed).length;
      const totalSections = updatedSections.length;
      setProgress(Math.round((completedCount / totalSections) * 100));
    } catch (error) {
      console.error("Error reading status from storage:", error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-black text-white p-8">
        <h1 className="text-4xl font-bold text-center mb-2">
          Status do Projeto
        </h1>
        <p className="text-gray-300 text-center text-lg">
          Seu progresso na configuração do legado digital
        </p>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Progress Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="mb-4">
            <Progress value={progress} className="h-4" />
          </div>
          <p className="text-center text-2xl font-bold">
            {progress}% concluído
          </p>
          <p className="text-center text-gray-600 mt-2">
            {progress === 100 
              ? "Parabéns! Você completou todas as seções." 
              : "Continue configurando para completar seu legado digital."}
          </p>
        </div>

        {/* Section Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section) => (
            <div
              key={section.key}
              className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-2">{section.label}</h2>
                  <p className="text-gray-600 mb-4">{section.description}</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    section.completed 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {section.completed ? "Concluído" : "Pendente"}
                  </span>
                </div>
                {section.completed && (
                  <svg 
                    className="w-8 h-8 text-green-500 flex-shrink-0" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Button */}
        <div className="mt-8">
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-full bg-black text-white py-4 px-6 rounded-lg font-bold hover:bg-gray-800 transition-colors"
          >
            Voltar para o Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
