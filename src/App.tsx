/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Lightbulb, 
  GraduationCap, 
  Send, 
  CheckCircle2, 
  XCircle, 
  Trophy,
  ArrowRight,
  ClipboardList,
  AlertCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from './lib/utils';

// --- Types ---

type Level = 'Fácil' | 'Intermedio' | 'Avanzado' | 'Harvard';

interface Exercise {
  id: string;
  level: Level;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'numerical' | 'case';
  options?: string[];
  correctAnswer: string | number | boolean;
  explanation: string;
}

interface Topic {
  id: string;
  title: string;
  theory: string;
  keyIdeas: {
    question: string;
    answer: string;
  }[];
  exercises: Exercise[];
}

// --- Data ---

const TOPICS: Topic[] = [
  {
    id: 'incertidumbre',
    title: 'Decisiones bajo Incertidumbre',
    theory: `
La toma de decisiones bajo incertidumbre ocurre cuando no se pueden asignar probabilidades exactas a los resultados, pero existe una creencia basada en datos históricos o experiencia intuitiva.

### Conceptos Fundamentales
1. **Estados de la Naturaleza**: Escenarios posibles que no dependen del decisor. Deben ser **mutuamente excluyentes** (no ocurren a la vez) y **colectivamente exhaustivos** (al menos uno debe ocurrir).
2. **Tabla de Rendimientos (Pay-off Table)**: Matriz que muestra el resultado de cada combinación de decisión y estado de la naturaleza.

### Métodos de Decisión
*   **Enfoque Conservador (Maximin)**: Para cada decisión, identificas el peor resultado. Luego eliges la decisión con el "mejor de los peores". Es para decisores adversos al riesgo.
*   **Enfoque Optimista (Maximax)**: Identificas el mejor resultado posible para cada decisión y eliges el máximo. Es para decisores que buscan ganar a toda costa.
*   **Minimax Regret (Arrepentimiento)**: Se basa en el costo de oportunidad. El "regret" es la diferencia entre el mejor pago posible para un estado y lo que realmente obtuviste. Se elige la opción que minimiza el arrepentimiento máximo.
`,
    keyIdeas: [
      {
        question: "¿Qué es el 'Regret'?",
        answer: "Es la diferencia entre el rendimiento de la mejor opción para un estado de la naturaleza y la opción elegida."
      },
      {
        question: "¿Cuándo usar Maximin?",
        answer: "Cuando el tomador de decisiones desea asegurar un rendimiento mínimo y evitar pérdidas catastróficas."
      },
      {
        question: "Calidad de Decisión vs. Resultado",
        answer: "Una buena decisión no garantiza un buen resultado; se mide por la información disponible al momento de decidir, no 'ex post'."
      }
    ],
    exercises: [
      { id: 'i1', level: 'Fácil', question: "¿En qué criterio elegirías la opción con el mejor de los peores resultados?", type: 'multiple-choice', options: ['Maximax', 'Maximin', 'Minimax Regret'], correctAnswer: 'Maximin', explanation: 'Maximin es el enfoque conservador que busca protegerse ante lo peor.' },
      { id: 'i2', level: 'Fácil', question: "Verdadero o Falso: Los estados de la naturaleza deben ser colectivamente exhaustivos.", type: 'true-false', options: ['V', 'F'], correctAnswer: 'V', explanation: 'Significa que al menos uno de los escenarios planteados debe ocurrir obligatoriamente.' },
      { id: 'i3', level: 'Fácil', question: "Si en una tabla 1x1 gano $50, ¿cuál es mi arrepentimiento?", type: 'numerical', correctAnswer: 0, explanation: 'Si solo hay una opción, el arrepentimiento es 0 porque no hay nada mejor que comparar.' },
      { id: 'i4', level: 'Intermedio', question: "Caso Inmobiliaria: D1(S1:20, S2:5), D2(S1:40, S2:-10). ¿Qué elige un optimista?", type: 'multiple-choice', options: ['D1', 'D2'], correctAnswer: 'D2', explanation: '40 es el máximo absoluto.' },
      { id: 'i5', level: 'Intermedio', question: "Mismo caso anterior ¿Qué elige un decisor conservador (Maximin)?", type: 'multiple-choice', options: ['D1', 'D2'], correctAnswer: 'D1', explanation: 'D1 tiene peor resultado 5. D2 tiene -10. El mejor es 5.' },
      { id: 'i6', level: 'Intermedio', question: "Si para S1 el mejor pago es 100 y tu opción rinde 40. ¿Cuál es el Regret?", type: 'numerical', correctAnswer: 60, explanation: 'Regret = Mejor - Actual = 100 - 40 = 60.' },
      { id: 'i7', level: 'Intermedio', question: "Verdadero o Falso: Una decisión de 'No Invertir' siempre tiene Regret 0.", type: 'true-false', options: ['V', 'F'], correctAnswer: 'F', explanation: 'Si la inversión hubiera dado mucho dinero, el arrepentimiento de no haber invertido es alto.' },
      { id: 'i8', level: 'Avanzado', question: "Caso Fábrica: D1 peores: 10, 20. D2 peores: 15, 15. D3 peores: 0, 50. Halla Maximin.", type: 'multiple-choice', options: ['D1', 'D2', 'D3'], correctAnswer: 'D2', explanation: 'Peores resultados: D1=10, D2=15, D3=0. El mayor es 15.' },
      { id: 'i9', level: 'Avanzado', question: "Calcula el Regret Máximo de D1: S1(Mejor=50, D1=40), S2(Mejor=20, D1=5).", type: 'numerical', correctAnswer: 15, explanation: 'Regret S1 = 10, Regret S2 = 15. Máx = 15.' },
      { id: 'i10', level: 'Avanzado', question: "En análisis de sensibilidad, ¿cómo afecta el cambio de consecuencias a la frontera?”, (V=Importante, F=No importa).", type: 'true-false', options: ['V', 'F'], correctAnswer: 'V', explanation: 'Cambiar los valores de la tabla puede cambiar totalmente la decisión óptima.' },
      { id: 'i11', level: 'Avanzado', question: "Un decisor odia perder más de $5. Si D1 tiene (40, -6) y D2 (10, -4). ¿Cuál elige?", type: 'multiple-choice', options: ['D1', 'D2'], correctAnswer: 'D2', explanation: 'Aunque D1 gana más, solo D2 cumple con el requisito de no perder más de $5.' },
      { id: 'i12', level: 'Harvard', question: "Caso PDC: Si S1 rinde 20M y S2 rinde -9M. Halla el 'Regret' si ocurre S2 y elegiste la opción de 20M (No posible, pero imagina el cálculo).", type: 'numerical', correctAnswer: 0, explanation: 'En S2, si elegiste la opción que rinde -9M teniendo una que rinde 7M (ejemplo real), el regret es real. Pero si elegiste el mejor del estado, es 0.' },
      { id: 'i13', level: 'Harvard', question: "En el enfoque Minimax Regret, ¿qué significa un arrepentimiento máximo de 0?", type: 'multiple-choice', options: ['Dominancia absoluta', 'Error en data', 'Empate'], correctAnswer: 'Dominancia absoluta', explanation: 'Significa que la opción es la mejor en TODOS los estados de la naturaleza.' },
      { id: 'i14', level: 'Harvard', question: "Analiza: ¿Puede el criterio Maximin y Maximax coincidir en la misma decisión?", type: 'true-false', options: ['V', 'F'], correctAnswer: 'V', explanation: 'Si una opción es superior tanto en su peor escenario como en su mejor escenario vs las demás.' },
      { id: 'i15', level: 'Harvard', question: "Si n=100 opciones, ¿es práctico Minimax Regret sin software?", type: 'true-false', options: ['V', 'F'], correctAnswer: 'F', explanation: 'La matriz de regret sería masiva (100 x estados).' }
    ]
  },
  {
    id: 'probabilidad',
    title: 'Probabilidad y Teorema de Bayes',
    theory: `
La probabilidad cuantifica la incertidumbre (0 a 1).

### Conceptos Críticos
*   **Probabilidad Posterior**: P(E|F). La probabilidad revisada tras ver la evidencia F.
*   **Independencia**: $P(A \cap B) = P(A)P(B)$.
*   **Paradoja de Simpson**: Un efecto aparece en grupos pero se invierte al combinarlos.
`,
    keyIdeas: [
      { question: "¿Fórmula de Prob. Condicional?", answer: "P(A|B) = P(A y B) / P(B)" },
      { question: "¿Qué hace el Teorema de Bayes?", answer: "Actualiza probabilidades previas con nueva información." }
    ],
    exercises: [
      { id: 'p1', level: 'Fácil', question: "Si P(A)=0.3 y P(B)=0.4, y son mutuamente excluyentes, ¿P(A u B)?", type: 'numerical', correctAnswer: 0.7, explanation: 'Se suman: 0.3 + 0.4 = 0.7.' },
      { id: 'p2', level: 'Fácil', question: "Verdadero o Falso: La suma de probabilidades del espacio muestral es 1.", type: 'true-false', options: ['V', 'F'], correctAnswer: 'V', explanation: 'Es el axioma fundamental de probabilidad.' },
      { id: 'p3', level: 'Fácil', question: "P(A|B) se lee como: ", type: 'multiple-choice', options: ['Prob de A y B', 'Prob de A dado B', 'Prob de B dado A'], correctAnswer: 'Prob de A dado B', explanation: 'Notación estándar de condicional.' },
      { id: 'p4', level: 'Intermedio', question: "60% son hombres. 10% de hombres fuman. ¿Prob de ser hombre fumador?", type: 'numerical', correctAnswer: 0.06, explanation: '0.60 * 0.10 = 0.06.' },
      { id: 'p5', level: 'Intermedio', question: "Si P(H)=0.6 y P(fuma|H)=0.1. ¿Cuál es la prob. condicional de fumar?", type: 'numerical', correctAnswer: 0.1, explanation: 'Ya está dada en el enunciado: 0.1.' },
      { id: 'p6', level: 'Intermedio', question: "Evento A: Aprobar. Complemento Ac: ¿Qué es?", type: 'multiple-choice', options: ['Desaprobar', 'Sacar 20', 'No dar examen'], correctAnswer: 'Desaprobar', explanation: 'El complemento es todo lo que no es A.' },
      { id: 'p7', level: 'Intermedio', question: "En Bayes, si la nueva información es 'Negativo', ¿la prob posterior suele bajar?", type: 'true-false', options: ['V', 'F'], correctAnswer: 'V', explanation: 'Generalmente la evidencia negativa reduce la sospecha de que el evento ocurra.' },
      { id: 'p8', level: 'Avanzado', question: "Empresa con 3 proveedores: A(50%), B(30%), C(20%). Defectuosos: A=1%, B=2%, C=3%. Prob de elegir uno defectuoso:", type: 'numerical', correctAnswer: 0.017, explanation: '(0.5*0.01)+(0.3*0.02)+(0.2*0.03) = 0.005+0.006+0.006 = 0.017.' },
      { id: 'p9', level: 'Avanzado', question: "Del caso anterior, si es defectuoso, ¿prob de que sea de C? (Redondea 3 dec)", type: 'numerical', correctAnswer: 0.353, explanation: 'P(C|Def) = 0.006 / 0.017 = 0.3529...' },
      { id: 'p10', level: 'Avanzado', question: "Verdadero o Falso: Los eventos independientes tienen P(A|B) = P(B).", type: 'true-false', options: ['V', 'F'], correctAnswer: 'F', explanation: 'No, es P(A|B) = P(A).' },
      { id: 'p11', level: 'Avanzado', question: "Caso Jueces: Luckett tiene 14% revocados, Kendall 12%. Pero Luckett es mejor en ambos tribunales. ¿Cómo se llama esto?", type: 'multiple-choice', options: ['Paradoja de Bayes', 'Paradoja de Simpson', 'Efecto Markov'], correctAnswer: 'Paradoja de Simpson', explanation: 'Inversión de tendencia al agregar datos.' },
      { id: 'p12', level: 'Harvard', question: "Test médico: P(Enfermo)=0.01. Sensibilidad=99%. Especificidad=99%. Si da Positivo, P(Enfermo|+) es:", type: 'numerical', correctAnswer: 0.5, explanation: 'Bayes: (0.99*0.01) / (0.99*0.01 + 0.01*0.99) = 0.0099 / 0.0198 = 0.5.' },
      { id: 'p13', level: 'Harvard', question: "¿Es posible que P(A|B) > P(A) si los eventos son independientes?", type: 'true-false', options: ['V', 'F'], correctAnswer: 'F', explanation: 'Si son independientes, P(A|B) es exactamente igual a P(A).' },
      { id: 'p14', level: 'Harvard', question: "P(A)=0.8, P(B|A)=0.5, P(B|Ac)=0.1. Halla P(A|B) (Redondea 2 dec)", type: 'numerical', correctAnswer: 0.95, explanation: 'P(B) = 0.8*0.5 + 0.2*0.1 = 0.42. P(A|B) = 0.4/0.42 = 0.952...' },
      { id: 'p15', level: 'Harvard', question: "Defina 'Known Unknowns' según las diapositivas:", type: 'multiple-choice', options: ['Certidumbre', 'Riesgo', 'Optimismo'], correctAnswer: 'Riesgo', explanation: 'Incertidumbres conocidas (podemos asignar probabilidades).' }
    ]
  },
  {
    id: 'utilidad',
    title: 'Teoría de la Utilidad',
    theory: `
Cuando el valor monetario no basta, usamos la Utilidad (atractivo relativo).

### Perfiles
*   **Adverso al Riesgo**: Curva Cóncava. Prefiere lo seguro.
*   **Buscador de Riesgo**: Curva Convexa. Ama la lotería.
*   **Neutral**: Línea Recta. Solo le importa el VME.
`,
    keyIdeas: [
      { question: "¿Por qué usar utilidad?", answer: "Porque el dinero tiene valor subjetivo distinto según la situación financiera." },
      { question: "¿Rangos de utilidad usuales?", answer: "Se suele anclar el peor resultado en 0 y el mejor en 10." }
    ],
    exercises: [
      { id: 'u1', level: 'Fácil', question: "Un decisor prefiere $10 seguros frente a una lotería con VME de $12. ¿Es?", type: 'multiple-choice', options: ['Adverso', 'Buscador', 'Neutral'], correctAnswer: 'Adverso', explanation: 'El adverso prefiere menos dinero pero seguro.' },
      { id: 'u2', level: 'Fácil', question: "Si U(ganar)=10 y U(perder)=0. Si p=0.5, la utilidad esperada es:", type: 'numerical', correctAnswer: 5, explanation: '0.5*10 + 0.5*0 = 5.' },
      { id: 'u3', level: 'Fácil', question: "Forma de la curva de un buscador de riesgos:", type: 'multiple-choice', options: ['Cóncava', 'Convexa', 'Lineal'], correctAnswer: 'Convexa', explanation: 'Indica que valora más los premios grandes.' },
      { id: 'u4', level: 'Intermedio', question: "Dada U($30k)=9.5. Si el VME de esa lotería es $45k, ¿el decisor es optimista?", type: 'true-false', options: ['V', 'F'], correctAnswer: 'F', explanation: 'Si prefiere $30k seguros a un VME de $45k, es muy conservador/adverso.' },
      { id: 'u5', level: 'Intermedio', question: "Halla la Utilidad Esperada de la Inversión B: S1(p=0.3, U=10), S2(p=0.5, U=1.5), S3(p=0.2, U=1).", type: 'numerical', correctAnswer: 3.95, explanation: '0.3*10 + 0.5*1.5 + 0.2*1 = 3 + 0.75 + 0.2 = 3.95.' },
      { id: 'u6', level: 'Intermedio', question: "Si eres neutral al riesgo, ¿cuál es tu utilidad para $100 si U($0)=0 y U($200)=10?", type: 'numerical', correctAnswer: 5, explanation: 'Neutral = Lineal. La mitad del dinero es la mitad de la utilidad.' },
      { id: 'u7', level: 'Intermedio', question: "Verdadero o Falso: La utilidad es personal y subjetiva.", type: 'true-false', options: ['V', 'F'], correctAnswer: 'V', explanation: 'Depende de la actitud de cada individuo o empresa.' },
      { id: 'u8', level: 'Avanzado', question: "Caso Swofford: ¿Por qué el presidente eligió d3 (no invertir) a pesar de que d1 tenía mejor VME?", type: 'multiple-choice', options: ['Error de cálculo', 'Miedo a la quiebra', 'Baja demanda'], correctAnswer: 'Miedo a la quiebra', explanation: 'Una pérdida de 50k lo sacaba del mercado; la utilidad de ese riesgo era 0.' },
      { id: 'u9', level: 'Avanzado', question: "Halla el punto de indiferencia 'p' para que U($X)=7.5 si U(mejor)=10 y U(peor)=0.", type: 'numerical', correctAnswer: 0.75, explanation: 'U(X) = p*10 + (1-p)*0 -> 7.5 = 10p -> p = 0.75.' },
      { id: 'u10', level: 'Avanzado', question: "Si U(x) = sqrt(x), ¿el decisor es?", type: 'multiple-choice', options: ['Adverso', 'Buscador', 'Neutral'], correctAnswer: 'Adverso', explanation: 'La raíz cuadrada es una función cóncava.' },
      { id: 'u11', level: 'Avanzado', question: "¿Puede un buscador de riesgos elegir una opción con menor VME que otra?", type: 'true-false', options: ['V', 'F'], correctAnswer: 'V', explanation: 'Sí, si la opción tiene un potencial de premio muy alto ("jackpot").' },
      { id: 'u12', level: 'Harvard', question: "En una curva logística de utilidad, ¿dónde es mayor la sensibilidad?", type: 'multiple-choice', options: ['Extremos', 'Punto de inflexión', 'Es igual'], correctAnswer: 'Punto de inflexión', explanation: 'Donde la pendiente es máxima.' },
      { id: 'u13', level: 'Harvard', question: "Si U($100)=10 y U($50)=6. ¿Eres adverso? (V/F)", type: 'true-false', options: ['V', 'F'], correctAnswer: 'V', explanation: 'U de la mitad ($50) es > 5 (que sería lo neutral). Significa que valoras más la seguridad.' },
      { id: 'u14', level: 'Harvard', question: "Calcula p si eres indiferente entre $0 seguros y una lotería de ganar $50 (U=10) o perder $50 (U=0). Tu U($0)=7.5.", type: 'numerical', correctAnswer: 0.75, explanation: 'Indiferencia: 7.5 = p*10 + (1-p)*0. p=0.75.' },
      { id: 'u15', level: 'Harvard', question: "¿Es racional un decisor que cambia de adverso a buscador según el monto?", type: 'true-false', options: ['V', 'F'], correctAnswer: 'V', explanation: 'Sí (Teoría Prospectiva), solemos ser adversos en ganancias y buscadores en pérdidas.' }
    ]
  },
  {
    id: 'mcdm-simples',
    title: 'Métodos Simples de Decisión Multicriterio',
    theory: `
Heurísticas de decisión rápida.

*   **Lexicográfico**: Prioridad total al criterio #1.
*   **Eliminación por Atributos (EBA)**: Establecer mínimos exigibles.
*   **Semilexicográfico**: Si hay "empate técnico" en el principal, ver el secundario.
`,
    keyIdeas: [
      { question: "¿Qué hace 'Satisfizer'?", answer: "Elige la primera opción que cumple los requisitos mínimos." },
      { question: "¿Problema del método ponderado?", answer: "No considera los rangos de las opciones por cada criterio." }
    ],
    exercises: [
      { id: 'ms1', level: 'Fácil', question: "Si solo compras Nike porque conoces la marca, ¿qué usas?", type: 'multiple-choice', options: ['EBA', 'Reconocimiento', 'Lexicográfico'], correctAnswer: 'Reconocimiento', explanation: 'Familiaridad = Calidad.' },
      { id: 'ms2', level: 'Fácil', question: "Verdadero o Falso: El método lexicográfico analiza todos los criterios simultáneamente.", type: 'true-false', options: ['V', 'F'], correctAnswer: 'F', explanation: 'Analiza uno por uno en orden de importancia.' },
      { id: 'ms3', level: 'Fácil', question: "¿Qué método descarta opciones que no llegan a una nota mínima?", type: 'multiple-choice', options: ['EBA', 'Maximin', 'SMART'], correctAnswer: 'EBA', explanation: 'Eliminación por Atributos.' },
      { id: 'ms4', level: 'Intermedio', question: "Caso Laptop: Crit1:RAM, Crit2:Precio. A(16GB, $1k), B(16GB, $800), C(8GB, $500). Si RAM es el Crit#1, ¿quién gana en Lexicográfico?", type: 'multiple-choice', options: ['A', 'B', 'C'], correctAnswer: 'B', explanation: 'Empate en RAM (16GB), se desempata por Precio: B es más barato.' },
      { id: 'ms5', level: 'Intermedio', question: "Mismo caso anterior. Si el único requisito EBA es 'Precio < $900', ¿quiénes quedan?", type: 'multiple-choice', options: ['Solo B', 'Solo C', 'B y C'], correctAnswer: 'B y C', explanation: 'Ambos cumplen el umbral de precio.' },
      { id: 'ms6', level: 'Intermedio', question: "Verdadero o Falso: El reconocimiento siempre lleva a la mejor decisión técnica.", type: 'true-false', options: ['V', 'F'], correctAnswer: 'F', explanation: 'A veces marcas conocidas son peores que alternativas nuevas.' },
      { id: 'ms7', level: 'Intermedio', question: "Estrategia Minimalista: Si no reconoces ninguna marca, ¿qué haces?", type: 'multiple-choice', options: ['Adivinas', 'Buscas una pista aleatoria', 'No compras'], correctAnswer: 'Buscas una pista aleatoria', explanation: 'Es el Plan B: buscar una sola razón para elegir.' },
      { id: 'ms8', level: 'Avanzado', question: "Semilexicográfico: Si la diferencia de precio es < $50 son iguales. A($300), B($340). Crit2: Calidad A(Baja), B(Alta). ¿Quién gana?", type: 'multiple-choice', options: ['A', 'B'], correctAnswer: 'B', explanation: 'Diferencia es $40 (<$50), empate en Crit1. En Crit2, B gana por calidad.' },
      { id: 'ms9', level: 'Avanzado', question: "¿Qué método puede generar ciclos de preferencia A > B > C > A?", type: 'multiple-choice', options: ['Lexicográfico', 'Semilexicográfico', 'EBA'], correctAnswer: 'Semilexicográfico', explanation: 'La intransitividad es un riesgo de este método.' },
      { id: 'ms10', level: 'Avanzado', question: "Verdadero o Falso: EBA reduce el número de alternativas viables rápidamente.", type: 'true-false', options: ['V', 'F'], correctAnswer: 'V', explanation: 'Es muy eficiente para filtrar licitaciones.' },
      { id: 'ms11', level: 'Avanzado', question: "Caso Spotify: Plan Familiar (6 cuentas), Duo (2), Individual (1). Si quiero para 3 personas, EBA descarta:", type: 'multiple-choice', options: ['Individual', 'Duo', 'Ambos'], correctAnswer: 'Ambos', explanation: 'Solo el Familiar cumple el requisito de n >= 3.' },
      { id: 'ms12', level: 'Harvard', question: "Curiosidad: ¿Cuándo el ahorro de tiempo compensa una decisión subóptima? (Metacriterio)", type: 'multiple-choice', options: ['Costo de búsqueda > Mejora', 'Nunca', 'Si eres optimista'], correctAnswer: 'Costo de búsqueda > Mejora', explanation: 'La racionalidad acotada justifica usar heurísticas.' },
      { id: 'ms13', level: 'Harvard', question: "Demuestra: Si en Lexicográfico el Criterio 1 tiene un ganador único, ¿qué peso tienen los demás criterios?", type: 'numerical', correctAnswer: 0, explanation: 'Operativamente su peso es 0 porque no influyen en nada.' },
      { id: 'ms14', level: 'Harvard', question: "Relaciona: 'Elegir la última que funcionó' es una memoria de:", type: 'multiple-choice', options: ['Resultados', 'Búsqueda', 'Indiferencia'], correctAnswer: 'Búsqueda', explanation: 'El cerebro recuerda qué criterio fue determinante antes.' },
      { id: 'ms15', level: 'Harvard', question: "Verdadero o Falso: El efecto señuelo (decoy) invalida la elección racional.", type: 'true-false', options: ['V', 'F'], correctAnswer: 'V', explanation: 'Introduce una opción dominada para manipular la preferencia relativa.' }
    ]
  },
  {
    id: 'smart',
    title: 'Método SMART y SMARTER',
    theory: `
SMART sistematiza la decisión. SMARTER usa pesos ROC.

### Pesos ROC (Rank Order Centroid)
Fórmula: $w_1 = (1 + 1/2 + ... + 1/n)/n$
Ejemplo n=2: $w_1 = (1 + 0.5)/2 = 0.75$, $w_2 = 0.25$.
`,
    keyIdeas: [
      { question: "¿Qué es una solución no dominada?", answer: "No hay ninguna otra que sea mejor en un criterio sin ser peor en otro." },
      { question: "¿Para qué sirve el análisis de sensibilidad en SMART?", answer: "Para ver si pequeños cambios en los pesos cambian la opción ganadora." }
    ],
    exercises: [
      { id: 'sm1', level: 'Fácil', question: "En un gráfico de Costo vs Beneficio, las mejores opciones están en:", type: 'multiple-choice', options: ['Arriba-Izquierda', 'Arriba-Derecha', 'Abajo-Izquierda'], correctAnswer: 'Arriba-Izquierda', explanation: 'Más beneficio (arriba) y menos costo (izquierda).' },
      { id: 'sm2', level: 'Fácil', question: "Verdadero o Falso: En SMART, los atributos deben ser redundantes.", type: 'true-false', options: ['V', 'F'], correctAnswer: 'F', explanation: 'Deben ser NO redundantes para evitar doble conteo de importancia.' },
      { id: 'sm3', level: 'Fácil', question: "¿Qué escala se usa típicamente para valores subjetivos en SMART?", type: 'numerical', correctAnswer: 100, explanation: 'Se escala de 0 a 100.' },
      { id: 'sm4', level: 'Intermedio', question: "Calcula el peso ROC para el 3er criterio de una lista de 3.", type: 'numerical', correctAnswer: 0.11, explanation: '(1/3)/3 = 0.111...' },
      { id: 'sm5', level: 'Intermedio', question: "Si para 2 criterios el peso es 75/25. Opción A: (100, 0), Opción B: (50, 100). ¿Puntaje de B?", type: 'numerical', correctAnswer: 62.5, explanation: '0.75*50 + 0.25*100 = 37.5 + 25 = 62.5.' },
      { id: 'sm6', level: 'Intermedio', question: "Verdadero o Falso: Una opción dominada puede estar en la frontera eficiente.", type: 'true-false', options: ['V', 'F'], correctAnswer: 'F', explanation: 'Por definición, la frontera eficiente solo contiene soluciones no dominadas.' },
      { id: 'sm7', level: 'Intermedio', question: "SMARTER proviene de: Multi-Attribute Rating Technique ...", type: 'multiple-choice', options: ['Enhanced Rank', 'Economic Ratio', 'Explaining Risk'], correctAnswer: 'Enhanced Rank', explanation: 'SMARTER = SMART + Exploiting Ranks.' },
      { id: 'sm8', level: 'Avanzado', question: "Si el gerente paga $120k para subir 100 puntos en Confiabilidad. ¿Cuánto vale 1 punto de utilidad?", type: 'numerical', correctAnswer: 1200, explanation: '120,000 / 100 = 1,200.' },
      { id: 'sm9', level: 'Avanzado', question: "Caso Autos: A(Ben:80, Cost:20k), B(Ben:70, Cost:15k), C(Ben:60, Cost:22k). ¿Quién es dominada?", type: 'multiple-choice', options: ['A', 'B', 'C'], correctAnswer: 'C', explanation: 'C tiene menos beneficio que A y B, y cuesta más que ambos.' },
      { id: 'sm10', level: 'Avanzado', question: "En un árbol de atributos, si dividimos 'Costos' en 'Renta' y 'Luz', los pesos de renta+luz deben sumar:", type: 'multiple-choice', options: ['100', 'El peso de Costos', 'Depende'], correctAnswer: 'El peso de Costos', explanation: 'Jerarquía de pesos.' },
      { id: 'sm11', level: 'Avanzado', question: "Verdadero o Falso: Los pesos ROC son más objetivos que los pesos directos.", type: 'true-false', options: ['V', 'F'], correctAnswer: 'V', explanation: 'Al basarse en rangos estadísticos, reducen el sesgo de asignar números al azar.' },
      { id: 'sm12', level: 'Harvard', question: "Deriva w1 para n=4. (Usa 3 decimales)", type: 'numerical', correctAnswer: 0.521, explanation: '(1 + 1/2 + 1/3 + 1/4)/4 = (2.0833)/4 = 0.5208...' },
      { id: 'sm13', level: 'Harvard', question: "En el análisis de 'Swing Weights', subir de 0 a 100 en el criterio más importante se asigna un puntaje de:", type: 'numerical', correctAnswer: 100, explanation: 'Es la referencia de anclaje para los demás pesos.' },
      { id: 'sm14', level: 'Harvard', question: "¿Pueden los pesos ROC dar como ganadora a una opción distinta que el método lexicográfico?", type: 'true-false', options: ['V', 'F'], correctAnswer: 'V', explanation: 'Sí, porque SMART es compensatorio (un buen 2do criterio puede ganar) y el lexicográfico no.' },
      { id: 'sm15', level: 'Harvard', question: "Si la frontera eficiente de Pareto es una línea recta, el trade-off es:", type: 'multiple-choice', options: ['Constante', 'Variable', 'Nulo'], correctAnswer: 'Constante', explanation: 'Relación lineal de intercambio.' }
    ]
  },
  {
    id: 'ahp',
    title: 'AHP: Proceso Analítico Jerárquico',
    theory: `
Método de Saaty basado en comparaciones por pares.

*   **Escala**: 1 (Igual) a 9 (Extrema).
*   **Reciprocidad**: $a_{ij} = 1 / a_{ji}$.
*   **Ranking**: Vector propio (prioridades).
*   **Consistencia**: CR < 0.10.
`,
    keyIdeas: [
      { question: "¿Qué es el RI?", answer: "Índice Aleatorio, depende del tamaño de la matriz (n)." },
      { question: "¿Cómo se calcula CI?", answer: "(Lambda_max - n) / (n - 1)" }
    ],
    exercises: [
      { id: 'ah1', level: 'Fácil', question: "Si el criterio A es moderadamente preferido a B, el valor es:", type: 'numerical', correctAnswer: 3, explanation: '3 es moderado en la escala Saaty.' },
      { id: 'ah2', level: 'Fácil', question: "Verdadero o Falso: Las matrices AHP deben ser cuadradas.", type: 'true-false', options: ['V', 'F'], correctAnswer: 'V', explanation: 'Comparas n elementos contra n elementos.' },
      { id: 'ah3', level: 'Fácil', question: "Si A vs B es 7, ¿qué es B vs A?", type: 'numerical', correctAnswer: 0.14, explanation: '1/7 = 0.142...' },
      { id: 'ah4', level: 'Intermedio', question: "En una matriz 3x3, ¿cuántas comparaciones únicas (sin la diagonal) se hacen?", type: 'numerical', correctAnswer: 3, explanation: 'n(n-1)/2 = 3*2/2 = 3.' },
      { id: 'ah5', level: 'Intermedio', question: "Calcula CI para n=3 si Lambda_max = 3.10.", type: 'numerical', correctAnswer: 0.05, explanation: '(3.10 - 3) / 2 = 0.05.' },
      { id: 'ah6', level: 'Intermedio', question: "Si CI=0.05 y RI=0.58. ¿Cuál es el CR? (Redondea 2 dec)", type: 'numerical', correctAnswer: 0.09, explanation: '0.05 / 0.58 = 0.086...' },
      { id: 'ah7', level: 'Intermedio', question: "Un CR de 0.15 significa que la matriz es: ", type: 'multiple-choice', options: ['Consistente', 'Inconsistente', 'Perfecta'], correctAnswer: 'Inconsistente', explanation: 'Mayor a 0.10 es inconsistente.' },
      { id: 'ah8', level: 'Avanzado', question: "Para n=4, el límite de CR es 9%. Si mi CR es 0.08, ¿debo revisar juicios?", type: 'multiple-choice', options: ['SI', 'NO'], correctAnswer: 'NO', explanation: 'Está por debajo del 9%.' },
      { id: 'ah9', level: 'Avanzado', question: "En el nivel 2 de la jerarquía AHP están:", type: 'multiple-choice', options: ['Objetivos', 'Criterios', 'Alternativas'], correctAnswer: 'Criterios', explanation: 'Niveles: 1.Objetivo, 2.Criterios, 3.Alternativas.' },
      { id: 'ah10', level: 'Avanzado', question: "Verdadero o Falso: AHP permite mezclar datos cuantitativos y cualitativos.", type: 'true-false', options: ['V', 'F'], correctAnswer: 'V', explanation: 'Es una de sus mayores ventajas.' },
      { id: 'ah11', level: 'Avanzado', question: "En una matriz consistente, si A vs B = 2 y B vs C = 3, ¿cuánto es A vs C?", type: 'numerical', correctAnswer: 6, explanation: 'Consistencia perfecta: 2 * 3 = 6.' },
      { id: 'ah12', level: 'Harvard', question: "Si la matriz es consistentemente perfecta, Lambda_max es igual a:", type: 'numerical', correctAnswer: 3, explanation: 'Para n=3. En general Lambda_max = n.' },
      { id: 'ah13', level: 'Harvard', question: "Método de aproximación: El vector de prioridades se halla promediando las columnas...", type: 'multiple-choice', options: ['Sumadas', 'Normalizadas', 'Invertidas'], correctAnswer: 'Normalizadas', explanation: 'Pasos comunes para hallar el vector sin software.' },
      { id: 'ah14', level: 'Harvard', question: "Caso: Matriz 10x10. El RI es 1.49. Si CI = 0.14, ¿es el juicio aceptable?", type: 'true-false', options: ['V', 'F'], correctAnswer: 'V', explanation: 'CR = 0.14/1.49 = 0.093 (<0.10). Sí.' },
      { id: 'ah15', level: 'Harvard', question: "¿Quién desarrolló el AHP?", type: 'multiple-choice', options: ['Thomas Bayes', 'Thomas Saaty', 'John von Neumann'], correctAnswer: 'Thomas Saaty', explanation: 'En 1980.' }
    ]
  }
];

// --- Components ---

export default function App() {
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string | number | boolean>>({});
  const [verifiedExercises, setVerifiedExercises] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<{ status: 'success' | 'error'; message: string } | null>(null);
  const [score, setScore] = useState(0);
  const [showSummary, setShowTopicSummary] = useState(false);
  const [showFeedbackOverlay, setShowFeedbackOverlay] = useState(false);

  const currentTopic = TOPICS[currentTopicIndex];
  const currentExercise = currentTopic.exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === currentTopic.exercises.length - 1;
  const isAnswered = userAnswers[currentExercise.id] !== undefined;
  const isCurrentVerified = verifiedExercises[currentExercise.id] === true;

  const handleAnswer = (exerciseId: string, answer: string | number | boolean) => {
    if (verifiedExercises[exerciseId]) return;
    setUserAnswers(prev => ({ ...prev, [exerciseId]: answer }));
  };

  const verifyCurrentExercise = () => {
    const isCorrect = userAnswers[currentExercise.id] === currentExercise.correctAnswer;
    setVerifiedExercises(prev => ({ ...prev, [currentExercise.id]: true }));
    
    const feedbackMsg = isCorrect 
      ? `¡EXCELENTE! Respuesta correcta. 🌟 (Imagina a un pingüino de Madagascar haciendo un saludo militar impecable).`
      : `¡Cuidado por ahí! La respuesta correcta era: ${currentExercise.correctAnswer}. ${currentExercise.explanation}`;
    
    setFeedback({
      status: isCorrect ? 'success' : 'error',
      message: feedbackMsg
    });

    // Show full-screen overlay
    setShowFeedbackOverlay(true);

    // Auto-transition after 3 seconds
    setTimeout(() => {
      setShowFeedbackOverlay(false);
      if (!isLastExercise) {
        nextExercise();
      }
    }, 3000);
  };

  const nextExercise = () => {
    if (!isLastExercise) {
      setCurrentExerciseIndex(prev => prev + 1);
      setFeedback(null);
    }
  };

  const prevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
      setFeedback(null);
    }
  };

  const checkFinalScore = () => {
    let correctCount = 0;
    currentTopic.exercises.forEach(ex => {
      if (userAnswers[ex.id] === ex.correctAnswer) {
        correctCount++;
      }
    });

    const finalScore = (correctCount / currentTopic.exercises.length) * 20;
    setScore(finalScore);
    setShowTopicSummary(true);
  };

  const getPointsToImprove = () => {
    const failed = currentTopic.exercises.filter(ex => userAnswers[ex.id] !== ex.correctAnswer);
    if (failed.length === 0) return "Ninguno. ¡Dominio absoluto!";
    return failed.slice(0, 3).map(ex => `Nivel ${ex.level}: ${ex.explanation.split('.')[0]}`).join('. ');
  };

  const resetProgress = () => {
    setCurrentExerciseIndex(0);
    setUserAnswers({});
    setVerifiedExercises({});
    setFeedback(null);
    setShowTopicSummary(false);
  };

  return (
    <div id="app-container" className="flex flex-col h-screen w-full bg-[#F1F5F9] font-sans text-slate-800 overflow-hidden">
      {/* Header */}
      <header id="main-header" className="h-20 bg-slate-900 text-white flex items-center justify-between px-8 border-b-4 border-blue-500 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <div id="logo-icon" className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/30">
            T
          </div>
          <div>
            <h1 id="app-title" className="text-lg font-bold leading-tight uppercase tracking-wider">Tutor Experto Pro</h1>
            <p id="app-subtitle" className="text-xs text-slate-400">Preparación de Élite: Objetivo 20/20</p>
          </div>
        </div>
        <div className="flex items-center space-x-8">
          <div id="topic-menu" className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
            {TOPICS.map((topic, idx) => (
              <button
                key={topic.id}
                onClick={() => {
                  setCurrentTopicIndex(idx);
                  resetProgress();
                }}
                className={cn(
                  "px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all",
                  currentTopicIndex === idx 
                    ? "bg-blue-500 text-white shadow-lg" 
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                {topic.id}
              </button>
            ))}
          </div>
          <div className="h-10 w-[1px] bg-slate-700"></div>
          <div className="text-right">
            <p className="text-[10px] uppercase text-slate-400">Tema Actual</p>
            <p id="current-topic-name" className="text-sm font-semibold">{currentTopic.title}</p>
          </div>
          <div className="h-10 w-[1px] bg-slate-700"></div>
          <div id="streak-badge" className="bg-amber-500 px-4 py-1 rounded-full text-slate-900 font-bold text-sm shadow-lg shadow-amber-500/20">
            {currentTopic.exercises.length} Ejercicios
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden p-6 gap-6">
        {/* Left Sidebar: Theory & Ideas */}
        <aside className="w-[340px] flex flex-col gap-4 flex-shrink-0 overflow-y-auto pr-2 custom-scrollbar">
          {/* Progress Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
             <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold uppercase text-slate-400">Progreso del Tema</p>
                <p className="text-xs font-black text-blue-600">{currentExerciseIndex + 1}/{currentTopic.exercises.length}</p>
             </div>
             <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <motion.div 
                  className="bg-blue-500 h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentExerciseIndex + 1) / currentTopic.exercises.length) * 100}%` }}
                />
             </div>
          </div>

          {/* Theory Card */}
          <div id="theory-card" className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
              <h2 className="font-bold uppercase text-xs tracking-widest text-slate-500 flex items-center gap-2">
                <BookOpen size={14} /> 1. Teoría Detallada
              </h2>
            </div>
            <div className="text-sm leading-relaxed prose prose-slate prose-sm max-w-none">
              <ReactMarkdown>{currentTopic.theory}</ReactMarkdown>
            </div>
          </div>

          {/* Key Ideas Card */}
          <div id="key-ideas-card" className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
              <h2 className="font-bold uppercase text-xs tracking-widest text-slate-500 flex items-center gap-2">
                <Lightbulb size={14} /> 2. Ideas Clave
              </h2>
            </div>
            <div className="space-y-3">
              {currentTopic.keyIdeas.map((idea, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded border border-slate-100">
                  <p className="text-xs font-bold text-slate-700 mb-1">{idea.question}</p>
                  <p className="text-[11px] text-slate-500 leading-snug">{idea.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Center: Exercises */}
        <section className="flex-1 flex flex-col gap-3 overflow-hidden">
          <div id="exercise-container" className="flex-1 bg-white rounded-2xl shadow-md border border-slate-200 p-4 flex flex-col overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-5 bg-emerald-500 rounded-full"></div>
                <h2 className="font-bold uppercase text-[11px] tracking-widest flex items-center gap-2">
                  <ClipboardList size={14} /> 3. Ejercicios (Uno a uno)
                </h2>
              </div>
              <span className={cn(
                "text-[9px] font-bold px-2 py-0.5 rounded",
                isAnswered ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
              )}>
                {isAnswered ? "RESPUESTA MARCADA" : "PENDIENTE"}
              </span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentExercise.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={cn(
                    "w-full border rounded-2xl p-5 transition-all relative overflow-hidden",
                    currentExercise.level === 'Harvard' ? "bg-slate-900 border-slate-800 shadow-xl" : "border-slate-100 bg-slate-50/20",
                    isCurrentVerified && userAnswers[currentExercise.id] === currentExercise.correctAnswer && "border-emerald-500 bg-emerald-50/5",
                    isCurrentVerified && userAnswers[currentExercise.id] !== currentExercise.correctAnswer && "border-red-500 bg-red-50/5"
                  )}
                >
                   {/* Watermark for Harvard - smaller */}
                   {currentExercise.level === 'Harvard' && (
                     <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12 pointer-events-none">
                        <GraduationCap size={120} className="text-white" />
                     </div>
                   )}

                  <div className="flex justify-between items-start mb-3">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm",
                      currentExercise.level === 'Fácil' && "bg-emerald-100 text-emerald-600",
                      currentExercise.level === 'Intermedio' && "bg-blue-100 text-blue-600",
                      currentExercise.level === 'Avanzado' && "bg-purple-100 text-purple-600",
                      currentExercise.level === 'Harvard' && "bg-amber-400/20 text-amber-400"
                    )}>
                      Nivel {currentExercise.level}
                    </span>
                    <div className="flex items-center gap-2">
                       {isCurrentVerified && (
                          userAnswers[currentExercise.id] === currentExercise.correctAnswer 
                          ? <CheckCircle2 size={14} className="text-emerald-500" />
                          : <XCircle size={14} className="text-red-500" />
                       )}
                       <span className="text-[10px] text-slate-400 font-mono tracking-widest">#{currentExercise.id.toUpperCase()}</span>
                    </div>
                  </div>
                  
                  <div className={cn(
                    "text-md font-semibold leading-snug mb-5",
                    currentExercise.level === 'Harvard' ? "text-white" : "text-slate-700"
                  )}>
                    <ReactMarkdown>{currentExercise.question}</ReactMarkdown>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {currentExercise.type === 'true-false' && (
                      <div className="flex gap-2">
                        {['V', 'F'].map(opt => (
                          <button
                            key={opt}
                            disabled={isCurrentVerified}
                            onClick={() => handleAnswer(currentExercise.id, opt)}
                            className={cn(
                              "flex-1 py-3 rounded-xl text-md font-bold border-2 transition-all active:scale-95",
                              userAnswers[currentExercise.id] === opt 
                                ? isCurrentVerified 
                                  ? (opt === currentExercise.correctAnswer ? "bg-emerald-600 border-emerald-600 text-white" : "bg-red-600 border-red-600 text-white")
                                  : "bg-blue-600 border-blue-600 text-white" 
                                : currentExercise.level === 'Harvard' 
                                  ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                                  : "bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50/50",
                              isCurrentVerified && "cursor-default opacity-80"
                            )}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {currentExercise.type === 'multiple-choice' && currentExercise.options && (
                      <div className="flex flex-col gap-2">
                        {currentExercise.options.map(opt => (
                          <button
                            key={opt}
                            disabled={isCurrentVerified}
                            onClick={() => handleAnswer(currentExercise.id, opt)}
                            className={cn(
                              "text-left px-4 py-2.5 rounded-xl text-xs font-bold border-2 transition-all active:scale-95",
                              userAnswers[currentExercise.id] === opt 
                                ? isCurrentVerified
                                  ? (opt === currentExercise.correctAnswer ? "bg-emerald-600 border-emerald-600 text-white" : "bg-red-600 border-red-600 text-white")
                                  : "bg-blue-600 border-blue-600 text-white" 
                                : currentExercise.level === 'Harvard'
                                  ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                                  : "bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50/50",
                              isCurrentVerified && "cursor-default opacity-80"
                            )}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {currentExercise.type === 'numerical' && (
                      <div className="flex flex-col gap-1.5">
                        <label className={cn("text-[9px] font-bold uppercase opacity-60", currentExercise.level === 'Harvard' ? "text-white" : "text-slate-500")}>Resultado:</label>
                        <input 
                          type="number"
                          disabled={isCurrentVerified}
                          value={String(userAnswers[currentExercise.id] ?? '')}
                          placeholder="0.00"
                          step="0.01"
                          onChange={(e) => handleAnswer(currentExercise.id, parseFloat(e.target.value))}
                          className={cn(
                            "w-full px-4 py-2.5 rounded-xl border-2 text-md font-black outline-none transition-all shadow-inner",
                            isCurrentVerified 
                              ? (userAnswers[currentExercise.id] === currentExercise.correctAnswer ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-red-50 border-red-500 text-red-700")
                              : currentExercise.level === 'Harvard' 
                                ? "bg-slate-800 border-slate-700 text-white focus:border-amber-400" 
                                : "bg-white border-slate-100 focus:border-blue-400"
                          )}
                        />
                      </div>
                    )}

                    {currentExercise.type === 'case' && (
                       <textarea
                        disabled={isCurrentVerified}
                        value={String(userAnswers[currentExercise.id] ?? '')}
                        onChange={(e) => handleAnswer(currentExercise.id, e.target.value)}
                        placeholder="Análisis..."
                        className={cn(
                          "w-full px-4 py-2.5 rounded-xl border-2 text-xs font-medium outline-none transition-all h-24 resize-none",
                          isCurrentVerified ? "bg-slate-100 border-slate-200" :
                          currentExercise.level === 'Harvard' 
                            ? "bg-slate-800 border-slate-700 text-white focus:border-amber-400" 
                            : "bg-white border-slate-100 focus:border-blue-400"
                        )}
                       />
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Full-screen Feedback Overlay */}
              <AnimatePresence>
                {showFeedbackOverlay && feedback && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className={cn(
                      "absolute inset-0 z-40 flex flex-col items-center justify-center p-8 text-center",
                      feedback.status === 'success' ? "bg-emerald-600/95" : "bg-red-600/95"
                    )}
                  >
                    <motion.div 
                      initial={{ y: 20 }}
                      animate={{ y: 0 }}
                      className="max-w-sm w-full"
                    >
                      <div className="w-full aspect-square bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-6 border-4 border-white/20">
                        <span className={cn(
                          "text-[120px] font-black select-none",
                          feedback.status === 'success' ? "text-emerald-500" : "text-red-500"
                        )}>
                          {feedback.status === 'success' ? ':)' : ':('}
                        </span>
                      </div>
                      <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">
                        {feedback.status === 'success' ? '¡Correcto!' : '¡Oops!'}
                      </h2>
                      <p className="text-white/90 font-bold leading-tight">
                        {feedback.message}
                      </p>
                      
                      {/* Timer Bar */}
                      <div className="w-full h-1 bg-white/20 rounded-full mt-8 overflow-hidden">
                        <motion.div 
                          initial={{ width: "100%" }}
                          animate={{ width: "0%" }}
                          transition={{ duration: 3, ease: "linear" }}
                          className="bg-white h-full"
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation and Verification - less margin top */}
              <div className="flex items-center justify-between w-full mt-5">
                  <button 
                    disabled={currentExerciseIndex === 0}
                    onClick={prevExercise}
                    className="p-2.5 rounded-full border border-slate-200 bg-white text-slate-400 hover:text-slate-600 disabled:opacity-10 transition-all"
                  >
                    <Send size={16} className="rotate-180" />
                  </button>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                    <div className="flex gap-1">
                      {currentTopic.exercises.map((_, idx) => (
                        <div 
                          key={idx} 
                          className={cn(
                            "h-1 rounded-full transition-all",
                            idx === currentExerciseIndex ? "w-4 bg-blue-600" : 
                            verifiedExercises[currentTopic.exercises[idx].id] ? "w-1 bg-emerald-400" : "w-1 bg-slate-200"
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  {!isCurrentVerified ? (
                    <button 
                      onClick={verifyCurrentExercise}
                      disabled={!isAnswered}
                      className={cn(
                        "flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md active:scale-95",
                        isAnswered ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-slate-100 text-slate-300 cursor-not-allowed"
                      )}
                    >
                      Enviar <CheckCircle2 size={12} />
                    </button>
                  ) : !isLastExercise ? (
                    <button 
                      onClick={nextExercise}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-md hover:bg-slate-800 active:scale-95"
                    >
                      Siguiente <Send size={12} />
                    </button>
                  ) : (
                    <button 
                      onClick={checkFinalScore}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-md hover:bg-emerald-700 active:scale-95"
                    >
                      Terminar <Trophy size={14} />
                    </button>
                  )}
              </div>
            </div>
          </div>

          {/* Feedback Console - Slightly smaller */}
          <AnimatePresence>
            {isCurrentVerified && feedback && (
              <motion.div 
                id="feedback-console" 
                initial={{ height: 0, opacity: 0, y: 10 }}
                animate={{ height: 80, opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: 10 }}
                className={cn(
                  "h-20 rounded-xl flex items-center px-6 justify-between text-white shadow-lg transition-colors border flex-shrink-0",
                  feedback.status === 'success' ? "bg-emerald-600 border-emerald-500 shadow-emerald-600/20" : "bg-red-600 border-red-500 shadow-red-600/20"
                )}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-white/20 shadow-md">
                    <span className={cn(
                      "text-2xl font-black",
                      feedback.status === 'success' ? "text-emerald-500" : "text-red-500"
                    )}>
                      {feedback.status === 'success' ? ':)' : ':('}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-[9px] font-black uppercase opacity-70 mb-0.5 tracking-widest flex items-center gap-1">
                      {feedback.status === 'success' ? <Trophy size={8} /> : <AlertCircle size={8} />} 
                      Retroalimentación
                    </p>
                    <p className="text-xs font-bold leading-tight line-clamp-2">
                      {feedback.message}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-center pl-6 border-l border-white/20">
                  <div className="text-right">
                    <p className="text-[8px] uppercase opacity-70 font-black">Progreso</p>
                    <p className="text-[10px] font-black">
                      {isLastExercise ? "META FINAL" : "PRÓXIMA"}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Footer */}
      <footer className="h-10 bg-white border-t border-slate-200 px-8 flex items-center justify-between text-[10px] font-medium text-slate-400 flex-shrink-0">
        <div className="flex items-center gap-2">
          <GraduationCap size={12} />
          SISTEMA DE TUTORÍA V.4.2 // EXCELENCIA ACADÉMICA
        </div>
        <div>2024 © ESTRATEGIA DE EXCELENCIA EDUCATIVA</div>
      </footer>

      {/* Summary Dialog / Overlay */}
      {showSummary && (
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[32px] shadow-2xl max-w-md w-full p-10 border border-slate-100 overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-3 bg-blue-500"></div>
              
              <div className="flex flex-col items-center text-center">
                <div className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-xl",
                  score >= 18 ? "bg-amber-100 text-amber-600" : score >= 14 ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                )}>
                  {score >= 14 ? <Trophy size={40} /> : <AlertCircle size={40} />}
                </div>
                
                <h3 className="text-3xl font-black text-slate-900 mb-2">Evaluación Final</h3>
                <p className="text-slate-500 text-sm mb-8 font-medium">Tema: <span className="text-blue-600">{currentTopic.title}</span></p>
                
                <div className="grid grid-cols-2 gap-4 w-full mb-8">
                  <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 shadow-inner">
                    <p className="text-[10px] uppercase font-black text-slate-400 mb-2">Nota Obtenida</p>
                    <p className={cn(
                      "text-4xl font-black",
                      score >= 18 ? "text-amber-500" : score >= 14 ? "text-emerald-500" : "text-red-500"
                    )}>{score.toFixed(0)}<span className="text-xl opacity-60">/20</span></p>
                  </div>
                  <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 shadow-inner flex flex-col justify-center">
                    <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Estatus</p>
                    <p className="text-xs font-black text-slate-700">
                       {score === 20 ? 'ELITE GENIUS' : score >= 14 ? 'EXCELENTE' : 'REFORZAR'}
                    </p>
                  </div>
                </div>
                
                <div className="w-full text-left bg-blue-50 rounded-2xl p-5 border border-blue-100 mb-8">
                   <p className="text-[10px] uppercase font-black text-blue-400 mb-2 tracking-tighter">Puntos de mejora detectados</p>
                   <p className="text-xs text-blue-700 leading-relaxed font-bold">{getPointsToImprove()}</p>
                </div>

                <div className="flex flex-col gap-4 w-full">
                  <button 
                    onClick={() => {
                       if (currentTopicIndex < TOPICS.length - 1) {
                        setCurrentTopicIndex(idx => idx+1);
                        resetProgress();
                       } else {
                        setShowTopicSummary(false);
                       }
                    }}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:scale-[1.02] transition-all active:scale-95 shadow-xl shadow-slate-200"
                  >
                    {currentTopicIndex < TOPICS.length - 1 ? "Ir al siguiente tema" : "Cerrar Evaluación"}
                  </button>
                  
                  <button 
                    onClick={() => setShowTopicSummary(false)}
                    className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hover:text-slate-600 transition-colors"
                  >
                    Revisar respuestas de este tema
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94A3B8;
        }
      `}</style>
    </div>
  );
}
