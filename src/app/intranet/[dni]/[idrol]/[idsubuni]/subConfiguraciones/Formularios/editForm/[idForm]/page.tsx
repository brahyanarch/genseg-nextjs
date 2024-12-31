"use client"
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
//import { FormData, Question, QuestionType } from './types';
//import { QuestionItem } from './question-Item';
//import { AddQuestionButton } from '@/components/Dinamyc-Form/add-question-button';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useParams } from 'next/navigation';

export type QuestionType = 'text' | 'multipleChoice' | 'singleChoice' | 'dropdown' | 'date' | 'archive';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
}

export interface FormData {
  title: string;
  questions: Question[];
}


interface QuestionItemProps {
  question: Question;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({ question, updateQuestion, deleteQuestion }) => {
  const handleTypeChange = (value: string) => {
    updateQuestion(question.id, { 
      type: value as Question['type'],
      options: value === 'select' || value === 'multiselect' ? [''] : undefined 
    });
  };

  return (
    <div className="mb-4 p-4 border rounded">
      <Input
        type="text"
        value={question.text}
        onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
        placeholder="Texto de la pregunta"
        className="mb-2 text-slate-900 dark:text-slate-100"
      />
      <Select onValueChange={handleTypeChange} value={question.type}>
        <SelectTrigger className="mb-2 text-slate-900 dark:text-slate-100">
          <SelectValue placeholder="Tipo de pregunta" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="text">Texto</SelectItem>
          <SelectItem value="dropdown">Desplegable</SelectItem>
          <SelectItem value="singleChoice">Selección única</SelectItem>
          <SelectItem value="multipleChoice">Selección múltiple</SelectItem>
          <SelectItem value="archive">Archivo</SelectItem>
          <SelectItem value="fecha">Fecha</SelectItem>
        </SelectContent>
      </Select>
      {(question.type === 'dropdown' || question.type === 'multipleChoice' || question.type === 'singleChoice') && (
        <div className="mb-2 text-slate-900 dark:text-slate-100">
          {question.options?.map((option, index) => (
            <div key={index} className="flex mb-2">
              <Input
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...(question.options || [])];
                  newOptions[index] = e.target.value;
                  updateQuestion(question.id, { options: newOptions });
                }}
                placeholder={`Opción ${index + 1}`}
                className="mr-2"
              />
              <Button onClick={() => {
                const newOptions = question.options?.filter((_, i) => i !== index);
                updateQuestion(question.id, { options: newOptions });
              }} variant="destructive">
                Eliminar
              </Button>
            </div>
          ))}
          <Button onClick={() => {
            const newOptions = [...(question.options || []), ''];
            updateQuestion(question.id, { options: newOptions });
          }} variant="outline" className="mt-2">
            Agregar Opción
          </Button>
        </div>
      )}
      <Button onClick={() => deleteQuestion(question.id)} variant="destructive" className="mt-2">
        Eliminar Pregunta
      </Button>
    </div>
  );
};


interface AddQuestionButtonProps {
  addQuestion: (type: QuestionType) => void;
}

export const AddQuestionButton: React.FC<AddQuestionButtonProps> = ({ addQuestion }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className='text-slate-900 dark:text-slate-100'>Agregar Pregunta</Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <div className="grid gap-4">
          <Button onClick={() => addQuestion('text')}>Texto</Button>
          <Button onClick={() => addQuestion('date')}>Fecha</Button>
          <Button onClick={() => addQuestion('singleChoice')}>Selección única</Button>
          <Button onClick={() => addQuestion('multipleChoice')}>Selección múltiple</Button>
          <Button onClick={() => addQuestion('dropdown')}>Selección desplegable</Button>
          <Button onClick={() => addQuestion('archive')}>Archivo</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};



export const DynamicForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    questions: [],
  });

  const { idForm } = useParams();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`https://2nlfx0w1-3000.brs.devtunnels.ms/api/form/preguntas/${idForm}`);
        const data = await response.json();
        const formattedQuestions = data.map((q: any) => ({
          id: q.id.toString(),
          type: q.type,
          text: q.questionText,
          options: q.options || [],
        }));
        setFormData(prev => ({ ...prev, questions: formattedQuestions }));
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [idForm]);

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: uuidv4(),
      type,
      text: '',
      options: type === 'dropdown' || type === 'multipleChoice' || type === 'singleChoice' ? [''] : undefined,
    };
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === id ? { ...q, ...updates } : q
      ),
    }));
  };

  const deleteQuestion = (id: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id),
    }));
  };

  const saveForm = async () => {
    try {
      const response = await fetch(`https://2nlfx0w1-3000.brs.devtunnels.ms/api/form/preguntas/${idForm}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questions: formData.questions }),
      });

      if (!response.ok) {
        throw new Error('Error saving form');
      }

      console.log('Form saved successfully');
    } catch (error) {
      console.error('Error saving form:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        placeholder="Título del formulario"
        className="mb-4"
      />
      {formData.questions.map(question => (
        <QuestionItem
          key={question.id}
          question={question}
          updateQuestion={updateQuestion}
          deleteQuestion={deleteQuestion}
        />
      ))}
      <AddQuestionButton addQuestion={addQuestion} />
      <Button onClick={saveForm} className="mt-4">
        Guardar Formulario
      </Button>
    </div>
  );
};

export default DynamicForm;