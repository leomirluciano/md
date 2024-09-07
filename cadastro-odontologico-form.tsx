import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { User, MapPin, FileText, Calendar, Video, Users } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const steps = ['Consultor e Agendamento', 'Informações Pessoais', 'Endereço', 'Plano'];

const CadastroOdontologico = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    consultor: '',
    dataConsulta: '',
    horarioConsulta: '',
    modalidadeConsulta: '',
    nomeCompleto: '',
    dataNascimento: '',
    sexo: '',
    cpf: '',
    cep: '',
    endereco: '',
    cidade: '',
    estado: '',
    telefone: '',
    email: '',
    plano: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'consultor':
        error = value.length < 3 ? 'Nome do consultor deve ter pelo menos 3 caracteres' : '';
        break;
      case 'dataConsulta':
        error = !isValidDate(value) ? 'Selecione uma data válida (dia útil)' : '';
        break;
      case 'horarioConsulta':
        error = !isValidTime(value) ? 'Selecione um horário válido (horário comercial)' : '';
        break;
      case 'nomeCompleto':
        error = value.length < 3 ? 'Nome deve ter pelo menos 3 caracteres' : '';
        break;
      case 'cpf':
        error = !/^\d{11}$/.test(value) ? 'CPF deve ter 11 dígitos' : '';
        break;
      case 'email':
        error = !/\S+@\S+\.\S+/.test(value) ? 'Email inválido' : '';
        break;
      case 'cep':
        error = !/^\d{8}$/.test(value) ? 'CEP deve ter 8 dígitos' : '';
        break;
      // Adicione mais validações conforme necessário
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const isValidDate = (date) => {
    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();
    return dayOfWeek !== 0 && dayOfWeek !== 6; // 0 = Domingo, 6 = Sábado
  };

  const isValidTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours >= 9 && hours < 18; // Horário comercial: 9h às 18h
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validar todos os campos antes de enviar
    const formErrors = Object.keys(formData).reduce((acc, key) => {
      validateField(key, formData[key]);
      return { ...acc, [key]: errors[key] || '' };
    }, {});

    if (Object.values(formErrors).some(error => error !== '')) {
      setErrors(formErrors);
    } else {
      setShowConfirmation(true);
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    if (formData.cep.length === 8) {
      // Simular uma chamada de API para buscar o endereço
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          endereco: 'Rua Exemplo, 123',
          cidade: 'Cidade Exemplo',
          estado: 'EX'
        }));
      }, 1000);
    }
  }, [formData.cep]);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="consultor">Consultor Responsável</Label>
                <Input 
                  id="consultor" 
                  name="consultor" 
                  value={formData.consultor} 
                  onChange={handleChange} 
                  required 
                />
                {errors.consultor && <p className="text-red-500 text-sm">{errors.consultor}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataConsulta">Data da Consulta Orientativa</Label>
                <Input 
                  id="dataConsulta" 
                  name="dataConsulta" 
                  type="date" 
                  value={formData.dataConsulta} 
                  onChange={handleChange} 
                  required 
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.dataConsulta && <p className="text-red-500 text-sm">{errors.dataConsulta}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="horarioConsulta">Horário da Consulta</Label>
                <Input 
                  id="horarioConsulta" 
                  name="horarioConsulta" 
                  type="time" 
                  value={formData.horarioConsulta} 
                  onChange={handleChange} 
                  required 
                  min="09:00" 
                  max="17:00"
                />
                {errors.horarioConsulta && <p className="text-red-500 text-sm">{errors.horarioConsulta}</p>}
              </div>
              <div className="space-y-2">
                <Label>Modalidade da Consulta</Label>
                <RadioGroup 
                  name="modalidadeConsulta" 
                  value={formData.modalidadeConsulta} 
                  onValueChange={(value) => handleChange({ target: { name: 'modalidadeConsulta', value } })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="presencial" id="presencial" />
                    <Label htmlFor="presencial">Presencial</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="videochamada" id="videochamada" />
                    <Label htmlFor="videochamada">Videochamada</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </motion.div>
        );
      // ... (os outros cases permanecem os mesmos)
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-500"><path d="M3.5 2h17A1.5 1.5 0 0 1 22 3.5v17a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 20.5v-17A1.5 1.5 0 0 1 3.5 2Z"/><path d="M7 12h10"/><path d="M12 7v10"/></svg>
          <h2 className="text-2xl font-bold text-teal-700">Meu Dentista</h2>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mt-2">Cadastro Plano Odontológico</h3>
        <div className="flex items-center justify-between mt-4">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              {index === 0 ? <Calendar className="w-5 h-5 mr-2" /> : 
               index === 1 ? <User className="w-5 h-5 mr-2" /> : 
               index === 2 ? <MapPin className="w-5 h-5 mr-2" /> : 
               <FileText className="w-5 h-5 mr-2" />}
              <span className={`text-sm ${currentStep === index ? 'font-bold' : ''}`}>{step}</span>
            </div>
          ))}
        </div>
        <Progress value={(currentStep + 1) / steps.length * 100} className="mt-2" />
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={prevStep} disabled={currentStep === 0}>Anterior</Button>
        {currentStep < steps.length - 1 ? (
          <Button onClick={nextStep}>Próximo</Button>
        ) : (
          <Button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white" onClick={handleSubmit}>Cadastrar</Button>
        )}
      </CardFooter>
      <p className="text-sm text-gray-500 text-center mt-4">Seus dados estão protegidos conforme nossa política de privacidade.</p>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cadastro Realizado com Sucesso!</AlertDialogTitle>
            <AlertDialogDescription>
              Seu cadastro no plano odontológico foi concluído. Um e-mail de confirmação será enviado em breve com os detalhes da sua consulta orientativa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default CadastroOdontologico;
