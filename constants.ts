import { StepConfig } from './types';

export const STEPS: StepConfig[] = [
  {
    id: 'frequencia',
    type: 'radio',
    question: 'Com que frequência você recruta ou participa de processos seletivos?',
    sub: 'Isso nos ajuda a entender sua rotina.',
    options: [
      'Sempre',
      'Às vezes',
      'Raramente'
    ]
  },
  {
    id: 'dor',
    type: 'radio',
    question: 'Qual dessas dores mais te incomoda hoje em recrutamento?',
    options: [
      'Volume alto de currículos ruins',
      'Poucos candidatos qualificados',
      'Falta de fit cultural',
      'Processo muito manual',
      'Outro'
    ]
  },
  {
    id: 'ranking',
    type: 'radio',
    question: 'Se a Jornyx entregar um ranking automático com os 3 melhores candidatos, isso ajuda?',
    options: [
      'Sim, com certeza',
      'Talvez, preciso ver',
      'Não vejo valor'
    ]
  },
  {
    id: 'nome',
    type: 'text',
    question: 'Qual o primeiro nome da pessoa responsável pelo recrutamento?',
    placeholder: 'Ex.: Ana, Bruno, Carla...',
    sub: 'Para personalizarmos o contato.'
  },
  {
    id: 'whatsapp',
    type: 'tel',
    question: 'Qual é o WhatsApp para contato?',
    placeholder: '(DDD) 99999-9999',
    sub: 'Prometemos não mandar spam.'
  },
  {
    id: 'email',
    type: 'email',
    question: 'Qual é o melhor e-mail para falar sobre a Jornyx?',
    placeholder: 'email@empresa.com'
  }
];
