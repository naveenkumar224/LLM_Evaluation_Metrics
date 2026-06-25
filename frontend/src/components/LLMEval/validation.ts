import { FormState, FormValidationErrors, EvaluationProvider } from './types';

export const validateForm = (formData: FormState): FormValidationErrors => {
  const errors: FormValidationErrors = {};

  // Validate metric
  if (!formData.metric) {
    errors.metric = 'Metric is required';
  }

  // Conversation completeness uses turns instead of query/output/context
  if (formData.metric === 'conversation_completeness') {
    const turns = formData.turns || [];
    if (turns.length < 2) {
      errors.context = 'At least 2 turns (one user + one assistant) are required';
    } else if (turns.some((t) => !t.content.trim())) {
      errors.context = 'All turn content fields must be filled in';
    }
    return errors;
  }

  // Validate query
  if (!formData.query || !formData.query.trim()) {
    errors.query = 'Query is required';
  }

  // Validate output (NOT required for pure context precision/recall metrics)
  if (shouldShowLLMOutput(formData.metric)) {
    if (!formData.output || !formData.output.trim()) {
      errors.output = 'Output is required';
    }
  }

  // Validate context (required for specific metrics)
  const validContexts = formData.context.filter((ctx) => ctx && ctx.trim().length > 0);
  const contextRequired = isContextRequired(formData.metric);

  if (contextRequired) {
    if (validContexts.length === 0) {
      errors.context = 'At least one context item is required for this metric';
    } else {
      const emptyContexts = formData.context.filter((ctx) => !ctx || !ctx.trim());
      if (emptyContexts.length > 0) {
        errors.context = `${emptyContexts.length} context item(s) are empty`;
      }
    }
  }

  // expected_output validation - required for context precision/recall metrics and RAGAS score
  if (shouldShowExpectedOutput(formData.metric)) {
    if (!formData.expected_output || !formData.expected_output.trim()) {
      errors.expected_output = `Expected output is required for ${formData.metric.replace(/_/g, ' ')} metric`;
    }
  }

  return errors;
};

export const isFormValid = (errors: FormValidationErrors): boolean => {
  return Object.keys(errors).length === 0;
};

/**
 * Get available metrics for the selected provider
 */
export const getMetricsForProvider = (provider: EvaluationProvider): string[] => {
  if (provider === 'ragas') {
    return ['faithfulness', 'context_precision', 'context_recall', 'ragas_score'];
  }
  return [
    'faithfulness',
    'answer_relevancy',
    'contextual_precision',
    'contextual_recall',
    'hallucination',
    'bias',
    'toxicity',
    'pii_leakage',
    'conversation_completeness',
  ];
};

/**
 * Check if expected_output field should be shown/required
 */
export const shouldShowExpectedOutput = (metric: string): boolean => {
  const metricsRequiringExpected = [
    'contextual_precision',
    'contextual_recall',
    'context_precision',
    'context_recall',
    'ragas_score'
  ];
  return metricsRequiringExpected.includes(metric);
};

/**
 * Check if LLM output field should be shown/required
 */
export const shouldShowLLMOutput = (metric: string): boolean => {
  // Metrics that don't use/require a single LLM output field
  const metricsNotUsingOutput = [
    'contextual_precision',
    'contextual_recall',
    'context_precision',
    'context_recall',
    'conversation_completeness',
  ];
  return !metricsNotUsingOutput.includes(metric);
};

/**
 * Check if context field is required for the metric
 */
export const isContextRequired = (metric: string): boolean => {
  // Context not required for: answer_relevancy, pii_leakage, toxicity, bias, conversation_completeness (uses turns)
  const metricsNotRequiringContext = ['answer_relevancy', 'pii_leakage', 'toxicity', 'bias', 'conversation_completeness'];
  return !metricsNotRequiringContext.includes(metric);
};
