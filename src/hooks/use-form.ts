'use client';

import { useCallback, useMemo, useRef, useState } from 'react';

export type ValidationErrors<TValues> = Partial<Record<keyof TValues, string>>;

interface UseFormOptions<TValues> {
  initialValues: TValues;
  validate?: (values: TValues) => ValidationErrors<TValues>;
  onSubmit?: (values: TValues) => Promise<void> | void;
}

interface UseFormReturn<TValues> {
  values: TValues;
  errors: ValidationErrors<TValues>;
  isSubmitting: boolean;
  isDirty: boolean;
  handleChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      | { name: keyof TValues; value: unknown }
  ) => void;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => Promise<void>;
  setFieldValue: <K extends keyof TValues>(name: K, value: TValues[K]) => void;
  reset: (nextValues?: Partial<TValues>) => void;
}

export function useForm<TValues extends Record<string, unknown>>(
  options: UseFormOptions<TValues>
): UseFormReturn<TValues> {
  const { initialValues, validate, onSubmit } = options;
  const [values, setValues] = useState<TValues>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<TValues>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialRef = useRef(initialValues);

  const isDirty = useMemo(() => JSON.stringify(values) !== JSON.stringify(initialRef.current), [values]);

  const runValidation = useCallback(
    (nextValues: TValues) => {
      if (!validate) return {} as ValidationErrors<TValues>;
      const validationErrors = validate(nextValues) || {};
      setErrors(validationErrors);
      return validationErrors;
    },
    [validate]
  );

  const setFieldValue = useCallback(
    <K extends keyof TValues>(name: K, value: TValues[K]) => {
      setValues((prev) => {
        const next = { ...prev, [name]: value } as TValues;
        runValidation(next);
        return next;
      });
    },
    [runValidation]
  );

  const handleChange: UseFormReturn<TValues>["handleChange"] = useCallback(
    (e) => {
      if ('target' in (e)) {
        const target = (e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>).target;
        const name = target.name as keyof TValues;
        const value: unknown = (target as HTMLInputElement).type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
        setFieldValue(name, value as TValues[keyof TValues]);
      } else {
        const { name, value } = e as { name: keyof TValues; value: unknown };
        setFieldValue(name, value as TValues[keyof TValues]);
      }
    },
    [setFieldValue]
  );

  const handleSubmit = useCallback<UseFormReturn<TValues>["handleSubmit"]>(
    async (e) => {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      const currentValues = values;
      const validationErrors = runValidation(currentValues);
      const hasErrors = Object.values(validationErrors).some(Boolean);
      if (hasErrors) return;
      if (!onSubmit) return;
      try {
        setIsSubmitting(true);
        await onSubmit(currentValues);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, runValidation, onSubmit]
  );

  const reset = useCallback((nextValues?: Partial<TValues>) => {
    const merged = { ...initialRef.current, ...(nextValues || {}) } as TValues;
    setValues(merged);
    setErrors({});
  }, []);

  return {
    values,
    errors,
    isSubmitting,
    isDirty,
    handleChange,
    handleSubmit,
    setFieldValue,
    reset,
  };
}


