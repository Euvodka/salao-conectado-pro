
import { useState } from "react";
import { UserRole } from "@/types";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { RoleSelection } from "@/components/auth/RoleSelection";

type AuthStep = 'role-selection' | 'login' | 'register';

export default function LandingPage() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [authStep, setAuthStep] = useState<AuthStep>('role-selection');

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
  };

  const handleActionSelect = (action: 'login' | 'register') => {
    setAuthStep(action);
  };

  const handleBack = () => {
    setAuthStep('role-selection');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Image/Branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-salon-400 to-salon-800 text-white flex-col justify-center items-center p-8">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold mb-4">Salão Conectado Pro</h1>
          <p className="text-xl mb-6">
            A plataforma que conecta profissionais de beleza e clientes de forma simples e eficiente.
          </p>
          <div className="grid grid-cols-2 gap-6 text-left">
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Para Clientes</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Encontre profissionais</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Agende serviços</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Descubra tendências</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Para Profissionais</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Gerencie agenda</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Promova serviços</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Análise de desempenho</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth forms */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 py-10">
        {authStep === 'role-selection' && (
          <RoleSelection onRoleSelect={handleRoleSelect} onActionSelect={handleActionSelect} />
        )}

        {authStep === 'login' && role && (
          <LoginForm role={role} onBack={handleBack} />
        )}

        {authStep === 'register' && role && (
          <RegisterForm role={role} onBack={handleBack} />
        )}
      </div>
    </div>
  );
}
