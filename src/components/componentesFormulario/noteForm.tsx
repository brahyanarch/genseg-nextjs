"use client"
import React, { useState, } from 'react';
import 'tailwindcss/tailwind.css';
type Question = {
  id: number;
  type: 'text' | 'multipleChoice' | 'singleChoice' | 'dropdown' | 'date';
  questionText: string;
  options?: string[]; // Para opción múltiple, una sola opción, dropdown
  answer?: string | string[]; // Almacenar respuesta, string para texto/una opción, array para varias opciones
};

export default function NoteForm( { formId,
  onBack
}: {
  formId: number | null;
  onBack: () => void;
}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionText, setQuestionText] = useState<string>('');
  const [questionType, setQuestionType] = useState<'text' | 'multipleChoice' | 'singleChoice' | 'dropdown' | 'date'>('text');
  const [options, setOptions] = useState<string[]>(['']); // Para opción múltiple, una sola opción, dropdown
  const [nextId, setNextId] = useState<number>(1);
  const [editingId, setEditingId] = useState<number | null>(null); // Para editar preguntas

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const addOrUpdateQuestion = () => {
    if (editingId) {
      // Actualizar pregunta
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.id === editingId
            ? {
                ...q,
                questionText: questionText,
                type: questionType,
                ...(questionType === 'multipleChoice' || questionType === 'singleChoice' || questionType === 'dropdown'
                  ? { options: options }
                  : {}),
              }
            : q
        )
      );
      setEditingId(null); // Termina edición
    } else {
      // Agregar nueva pregunta
      const newQuestion: Question = {
        id: nextId,
        type: questionType,
        questionText: questionText,
        ...(questionType === 'multipleChoice' || questionType === 'singleChoice' || questionType === 'dropdown'
          ? { options: options }
          : {}),
      };
      setQuestions([...questions, newQuestion]);
      setNextId(nextId + 1);
    }

    setQuestionText('');
    setOptions(['']);
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const editQuestion = (id: number) => {
    const questionToEdit = questions.find((q) => q.id === id);
    if (questionToEdit) {
      setEditingId(id);
      setQuestionText(questionToEdit.questionText);
      setQuestionType(questionToEdit.type);
      if (questionToEdit.options) {
        setOptions(questionToEdit.options);
      } else {
        setOptions(['']);
      }
    }
  };
  return (
    <>
        <div className="w-full max-w-6xl mx-auto p-6  rounded-lg">
          <div className='w-full flex justify-between items-center'>
          <h1 className="text-2xl font-bold mb-6">Editar Formulario {formId}</h1>
          <button type="button"  className="px-6 py-2 bg-green-500 text-white rounded-md" onClick={onBack}>
                Guardar
          </button>
          </div>
          {/* Campo para la pregunta */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Pregunta</label>
            <input
              type="text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Escribe tu pregunta..."
            />
          </div>
  
          {/* Selector de tipo de pregunta */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">Tipo de Pregunta</label>
            <select
              value={questionType}
              onChange={(e) =>
                setQuestionType(e.target.value as 'text' | 'multipleChoice' | 'singleChoice' | 'dropdown' | 'date')
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="text">Texto</option>
              <option value="multipleChoice">Opción múltiple (varias respuestas)</option>
              <option value="singleChoice">Una opción (radio buttons)</option>
              <option value="dropdown">Una opción (combobox)</option>
              <option value="date">Fecha</option>
            </select>
          </div>
  
          {/* Opciones para las preguntas de opción múltiple, radio buttons, o combobox */}
          {(questionType === 'multipleChoice' || questionType === 'singleChoice' || questionType === 'dropdown') && (
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">Opciones</label>
              {options.map((option, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md mr-2"
                    placeholder={`Opción ${index + 1}`}
                  />
                  <button
                    type="button"
                    className="text-red-500"
                    onClick={() => setOptions(options.filter((_, i) => i !== index))}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              <button type="button" onClick={addOption} className="text-blue-500 mt-2">
                + Añadir Opción
              </button>
            </div>
          )}
  
          <button onClick={addOrUpdateQuestion} className="px-4 py-2 bg-blue-500 text-white rounded-md">
            {editingId ? 'Actualizar Pregunta' : 'Añadir Pregunta'}
          </button>
  
          {/* Lista de preguntas dinámicas */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Preguntas</h2>
            {questions.map((question) => (
              <div key={question.id} className="mb-4 p-4 border border-gray-300 rounded-lg">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{question.questionText}</p>
                    {question.type === 'date' && <p>Tipo: Fecha</p>}
                    {question.type === 'text' && <p>Tipo: Texto</p>}
                    {question.type === 'multipleChoice' && <p>Tipo: Opción múltiple</p>}
                    {question.type === 'singleChoice' && <p>Tipo: Una opción</p>}
                    {question.type === 'dropdown' && <p>Tipo: Combobox</p>}
                  </div>
                  <div>
                    <button className="text-blue-500 mr-4" onClick={() => editQuestion(question.id)}>
                      Editar
                    </button>
                    <button className="text-red-500" onClick={() => removeQuestion(question.id)}>
                      Eliminar
                    </button>
                  </div>
                </div>
  
                {/* Mostrar opciones si es de tipo múltiple, radio o combobox */}
                {['multipleChoice', 'singleChoice', 'dropdown'].includes(question.type) && question.options && (
                  <ul className="mt-2">
                    {question.options.map((option, index) => (
                      <li key={index} className="ml-4 list-disc">
                        {question.type === 'multipleChoice' ? (
                          <input type="checkbox" className="mr-2" /> // Opción múltiple
                        ) : question.type === 'singleChoice' ? (
                          <input type="radio" name={`question-${question.id}`} className="mr-2" /> // Una opción
                        ) : (
                          '' // Opciones se manejan en el dropdown
                        )}
                        {option}
                      </li>
                    ))}
                  </ul>
                )}
  
                {/* Mostrar dropdown si es tipo 'combobox' */}
                {question.type === 'dropdown' && question.options && (
                  <div className="mt-2">
                    <select className="p-2 border border-gray-300 rounded-md">
                      {question.options.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
  
                {/* Mostrar el input de fecha si es de tipo 'date' */}
                {question.type === 'date' && (
                  <div className="mt-2">
                    <input type="date" className="p-2 border border-gray-300 rounded-md" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
    </>
    
  );
}
