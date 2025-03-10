import { SupabaseClient } from '@supabase/supabase-js';
import { ProcessType } from '@/types/database';

// Tipos genéricos para questionários
export interface BaseQuestionnaire {
  created_at?: string;
  updated_at?: string;
}

// Interface para questionário trabalhista
export interface TrabalhistaQuestionnaire extends BaseQuestionnaire {
  employment_start_date: string;
  employment_end_date?: string;
  company_name: string;
  job_title: string;
  salary: number;
  weekly_hours: number;
  has_overtime: boolean;
  overtime_hours_per_week?: number;
  has_benefits: boolean;
  benefits?: string[];
  termination_reason?: string;
  has_formal_contract: boolean;
  specific_claims: string[];
  documents_provided: string[];
  additional_notes?: string;
}

// Interface para questionário cível
export interface CivilQuestionnaire extends BaseQuestionnaire {
  incident_date: string;
  incident_location: string;
  claim_type: string;
  opposing_parties: string[];
  claim_value?: number;
  has_previous_agreement: boolean;
  previous_agreement_details?: string;
  has_documents: boolean;
  documents_provided: string[];
  witness_names?: string[];
  witness_contacts?: string[];
  additional_notes?: string;
}

// Interface para questionário criminal
export interface CriminalQuestionnaire extends BaseQuestionnaire {
  offense_date: string;
  offense_location: string;
  offense_type: string;
  police_report_number?: string;
  police_report_date?: string;
  has_been_charged: boolean;
  charge_details?: string;
  has_court_date: boolean;
  court_date?: string;
  court_location?: string;
  has_previous_offenses: boolean;
  previous_offenses?: string[];
  has_witnesses: boolean;
  witness_details?: string;
  has_legal_representation_before: boolean;
  additional_notes?: string;
}

// Mapa de tipos de questionários
export type QuestionnaireTypes = {
  trabalhista: TrabalhistaQuestionnaire;
  civil: CivilQuestionnaire;
  criminal: CriminalQuestionnaire;
  // Adicione outros tipos conforme necessário
  [key: string]: any; // Para outros tipos ainda não definidos especificamente
};

// Função para criar ou atualizar um questionário
export async function saveQuestionnaire<T extends ProcessType>(
  supabase: SupabaseClient,
  processId: string,
  processType: T,
  questionnaireData: QuestionnaireTypes[T]
) {
  // Verificar se já existe um questionário para este processo
  const { data: existingQuestionnaire } = await supabase
    .from('process_questionnaires')
    .select('id')
    .eq('process_id', processId)
    .single();

  if (existingQuestionnaire) {
    // Atualizar questionário existente
    return await supabase
      .from('process_questionnaires')
      .update({
        questionnaire_data: questionnaireData,
        updated_at: new Date().toISOString()
      })
      .eq('process_id', processId);
  } else {
    // Criar novo questionário
    return await supabase
      .from('process_questionnaires')
      .insert({
        process_id: processId,
        process_type: processType,
        questionnaire_data: questionnaireData
      });
  }
}

// Função para obter um questionário
export async function getQuestionnaire<T extends ProcessType>(
  supabase: SupabaseClient,
  processId: string
) {
  const { data, error } = await supabase
    .from('process_questionnaires')
    .select('process_type, questionnaire_data')
    .eq('process_id', processId)
    .single();

  if (error || !data) {
    return { data: null, error };
  }

  return {
    data: {
      process_type: data.process_type as T,
      questionnaire: data.questionnaire_data as QuestionnaireTypes[T]
    },
    error: null
  };
}

// Função para buscar questionários por tipo de processo
export async function getQuestionnairesByType<T extends ProcessType>(
  supabase: SupabaseClient,
  processType: T,
  query?: {
    field: string;
    operator: 'eq' | 'gt' | 'lt' | 'gte' | 'lte' | 'like';
    value: any;
  }
) {
  let queryBuilder = supabase
    .from('process_questionnaires')
    .select('process_id, questionnaire_data, created_at, updated_at')
    .eq('process_type', processType);

  // Adicionar filtro para campo específico no JSON se fornecido
  if (query) {
    const { field, operator, value } = query;
    const jsonPath = `questionnaire_data->${field}`;
    
    switch (operator) {
      case 'eq':
        queryBuilder = queryBuilder.eq(jsonPath, value);
        break;
      case 'gt':
        queryBuilder = queryBuilder.gt(jsonPath, value);
        break;
      case 'lt':
        queryBuilder = queryBuilder.lt(jsonPath, value);
        break;
      case 'gte':
        queryBuilder = queryBuilder.gte(jsonPath, value);
        break;
      case 'lte':
        queryBuilder = queryBuilder.lte(jsonPath, value);
        break;
      case 'like':
        queryBuilder = queryBuilder.like(jsonPath, `%${value}%`);
        break;
    }
  }

  const { data, error } = await queryBuilder;

  if (error || !data) {
    return { data: null, error };
  }

  return {
    data: data.map(item => ({
      process_id: item.process_id,
      questionnaire: item.questionnaire_data as QuestionnaireTypes[T],
      created_at: item.created_at,
      updated_at: item.updated_at
    })),
    error: null
  };
}

// Função para excluir um questionário
export async function deleteQuestionnaire(
  supabase: SupabaseClient,
  processId: string
) {
  return await supabase
    .from('process_questionnaires')
    .delete()
    .eq('process_id', processId);
} 