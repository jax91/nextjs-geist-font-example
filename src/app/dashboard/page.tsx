'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardScreen() {
  const router = useRouter();
  const [lastConfirmation, setLastConfirmation] = useState<string>('');

  useEffect(() => {
    checkLifeConfirmation();
  }, []);

  const checkLifeConfirmation = async () => {
    try {
      const lastCheck = localStorage.getItem('lastLifeConfirmation');
      if (!lastCheck) {
        showLifeConfirmationPrompt();
      } else {
        const lastCheckDate = new Date(lastCheck);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - lastCheckDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays >= 7) {
          showLifeConfirmationPrompt();
        }
        setLastConfirmation(lastCheck);
      }
    } catch (error) {
      console.error('Error checking life confirmation:', error);
    }
  };

  const showLifeConfirmationPrompt = () => {
    if (confirm('Por favor, confirme seu status para manter acesso à sua herança digital.')) {
      confirmLife();
    }
  };

  const confirmLife = async () => {
    try {
      const now = new Date().toISOString();
      localStorage.setItem('lastLifeConfirmation', now);
      setLastConfirmation(now);
      alert('Confirmação de vida atualizada com sucesso');
    } catch (error) {
      console.error('Erro ao confirmar vida:', error);
      alert('Falha ao atualizar confirmação de vida');
    }
  };

  const navigateToSection = (section: string) => {
    router.push(`/data-entry/${section}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black text-white p-6">
        <h1 className="text-2xl font-bold mb-2">Herança Digital</h1>
        <p className="text-gray-300 text-sm">
          Última Confirmação: {lastConfirmation ? new Date(lastConfirmation).toLocaleDateString('pt-BR') : 'Nunca'}
        </p>
      </div>

      <div className="p-6">
        <div 
          onClick={() => router.push('/status')}
          className="bg-gray-100 p-6 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors mb-4"
        >
          <h2 className="text-xl font-bold mb-2">Status do Projeto</h2>
          <p className="text-gray-600">Verifique o progresso e conclusão dos passos do seu legado digital</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            onClick={() => navigateToSection('passwords')}
            className="bg-gray-100 p-6 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <h2 className="text-xl font-bold mb-2">Senhas</h2>
            <p className="text-gray-600">Armazene credenciais importantes de contas</p>
          </div>

          <div 
            onClick={() => navigateToSection('wishes')}
            className="bg-gray-100 p-6 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <h2 className="text-xl font-bold mb-2">Últimos Desejos</h2>
            <p className="text-gray-600">Documente seus desejos e pedidos finais</p>
          </div>

          <div 
            onClick={() => navigateToSection('financial')}
            className="bg-gray-100 p-6 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <h2 className="text-xl font-bold mb-2">Informações Financeiras</h2>
            <p className="text-gray-600">Registre contas e documentos financeiros</p>
          </div>

          <div 
            onClick={() => navigateToSection('confessions')}
            className="bg-gray-100 p-6 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <h2 className="text-xl font-bold mb-2">Confissões</h2>
            <p className="text-gray-600">Compartilhe pensamentos e segredos privados</p>
          </div>
        </div>

        <button 
          onClick={() => router.push('/beneficiary-setup')}
          className="w-full mt-6 bg-black text-white py-4 px-6 rounded-lg font-bold hover:bg-gray-800 transition-colors"
        >
          Gerenciar Beneficiários
        </button>
      </div>
    </div>
  );
}
