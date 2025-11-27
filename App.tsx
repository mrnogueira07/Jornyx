import React, { useState, useEffect } from 'react';
import { STEPS } from './constants';
import { FormState, Submission } from './types';
import { Button, RadioOption, TextInput } from './components/UIComponents';
import { ResponsesDrawer } from './components/ResponsesDrawer';
import { CheckCircle2, RotateCcw, ShieldCheck } from 'lucide-react';

const STORAGE_KEY = 'jornyx_respostas_v1';

export default function App() {
  // State
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<FormState>({});
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [animKey, setAnimKey] = useState(0); // For forcing re-render animations

  // Load submissions on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSubmissions(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load responses", e);
    }
  }, []);

  // Helpers
  const currentStep = STEPS[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  const saveSubmission = () => {
    const newSubmission: Submission = {
      timestamp: new Date().toISOString(),
      ...answers
    };
    
    const newHistory = [...submissions, newSubmission];
    setSubmissions(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    setIsSuccess(true);
  };

  const handleNext = () => {
    // Validation
    const currentVal = answers[currentStep.id];
    if (!currentVal || currentVal.trim() === '') {
      alert("Por favor, preencha este campo para continuar.");
      return;
    }

    if (isLastStep) {
      saveSubmission();
    } else {
      setCurrentStepIndex(prev => prev + 1);
      setAnimKey(prev => prev + 1); // Trigger animation for new question
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setAnimKey(prev => prev + 1);
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentStepIndex(0);
    setIsSuccess(false);
    setAcceptedTerms(false);
    setAnimKey(prev => prev + 1);
  };

  const handleAcceptTerms = () => {
    setAcceptedTerms(true);
    setAnimKey(prev => prev + 1);
  };

  const handleAnswerChange = (val: string) => {
    setAnswers(prev => ({ ...prev, [currentStep.id]: val }));
  };

  // Keyboard navigation for text inputs
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNext();
    }
  };

  // --- Render ---

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#151517] text-gray-100 overflow-x-hidden">
      
      {/* Main Card */}
      <main className="w-full max-w-2xl bg-gradient-to-br from-[#262626] via-[#111111] to-[#050505] rounded-[32px] sm:rounded-[40px] shadow-[0_28px_80px_rgba(0,0,0,0.6)] border border-white/5 relative flex flex-col min-h-[550px] mb-20">
        
        {!acceptedTerms ? (
          /* Privacy Policy View */
          <div className="flex flex-col h-full p-6 sm:p-10 lg:p-12 animate-fade-in">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <div className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase mb-2">
                  Jornyx · LGPD
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                  Política de Privacidade
                </h1>
              </div>
              <div className="p-3 bg-white/5 rounded-full hidden sm:block">
                <ShieldCheck size={24} className="text-gray-400" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 -mr-2 text-gray-300 space-y-6 text-sm sm:text-base mb-6 custom-scrollbar">
              <p className="text-gray-400">
                A política aplica-se a todos os usuários (Candidatos e Recrutadores) e segue a Lei Geral de Proteção de Dados (LGPD).
              </p>
              
              <div className="space-y-1">
                <h3 className="text-white font-medium">Finalidade</h3>
                <p className="text-gray-400">Os dados são usados exclusivamente para processos de recrutamento e seleção.</p>
              </div>

              <div className="space-y-1">
                <h3 className="text-white font-medium">Compartilhamento</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-400">
                  <li><strong className="text-gray-300">Candidatos:</strong> Seus dados vão apenas para empresas com vagas compatíveis.</li>
                  <li><strong className="text-gray-300">Recrutadores:</strong> Dados da vaga são divulgados para a base de talentos.</li>
                </ul>
              </div>

              <div className="space-y-1">
                <h3 className="text-white font-medium">Armazenamento</h3>
                <p className="text-gray-400">Os dados ficam guardados por 12 meses.</p>
              </div>

              <div className="space-y-1">
                <h3 className="text-white font-medium">Seus Direitos</h3>
                <p className="text-gray-400">Você pode pedir para corrigir, atualizar ou excluir seus dados a qualquer momento enviando um e-mail para o suporte.</p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <Button onClick={handleAcceptTerms} className="w-full justify-center">
                Li e concordo
              </Button>
            </div>
          </div>
        ) : isSuccess ? (
          /* Success View */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
              <CheckCircle2 size={40} className="text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Resposta Salva!</h2>
            <p className="text-gray-400 mb-10 max-w-md">
              Os dados foram registrados com sucesso. O visitante já pode retirar o brinde.
            </p>
            <Button variant="ghost" onClick={handleRestart} className="gap-3">
              <RotateCcw size={18} />
              Iniciar Novo Cadastro
            </Button>
          </div>
        ) : (
          /* Form View */
          <div className="flex flex-col h-full p-6 sm:p-10 lg:p-12">
            
            {/* Header */}
            <div className="mb-8">
              <div className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase mb-2">
                Jornyx · Pesquisa Feira RH
              </div>
              <div className="text-sm text-gray-400 tracking-wider uppercase font-medium">
                Passo {currentStepIndex + 1} de {STEPS.length}
              </div>
            </div>

            {/* Question Content */}
            <div key={animKey} className="flex-1 flex flex-col animate-slide-in">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
                {currentStep.question}
              </h1>
              {currentStep.sub && (
                <p className="text-gray-400 text-sm sm:text-base mb-8">
                  {currentStep.sub}
                </p>
              )}

              <div className="mt-4 w-full max-w-lg">
                {currentStep.type === 'radio' && currentStep.options && (
                  <div className="flex flex-col gap-3">
                    {currentStep.options.map(opt => (
                      <RadioOption
                        key={opt}
                        id={`${currentStep.id}-${opt}`}
                        name={currentStep.id}
                        value={opt}
                        label={opt}
                        checked={answers[currentStep.id] === opt}
                        onChange={handleAnswerChange}
                      />
                    ))}
                  </div>
                )}

                {(currentStep.type === 'text' || currentStep.type === 'email' || currentStep.type === 'tel') && (
                  <div className="mt-2">
                    <TextInput
                      type={currentStep.type}
                      value={answers[currentStep.id] || ''}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      placeholder={currentStep.placeholder}
                      autoFocus
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Footer / Nav */}
            <div className="mt-12 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
              {/* Progress Dots */}
              <div className="flex items-center gap-2">
                {STEPS.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentStepIndex 
                        ? 'w-6 bg-orange-500' 
                        : idx < currentStepIndex 
                          ? 'w-2 bg-orange-500/50' 
                          : 'w-2 bg-gray-700'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  onClick={handlePrev} 
                  disabled={isFirstStep}
                  className={isFirstStep ? 'opacity-0 pointer-events-none' : ''}
                >
                  Voltar
                </Button>
                <Button onClick={handleNext}>
                  {isLastStep ? 'Finalizar' : 'Próximo'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Persistent Drawer for Admin/Export */}
      <ResponsesDrawer submissions={submissions} steps={STEPS} />
      
      {/* Animation Styles */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-in {
          animation: slideIn 0.4s ease-out forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}