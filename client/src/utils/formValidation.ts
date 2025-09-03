/**
 * Универсальная функция валидации формы
 * @param formData - объект с данными формы
 * @param requiredFields - массив ключей обязательных полей
 * @returns объект с ошибками валидации
 */
export function validateRequiredFields<T extends Record<string, any>>(
  formData: T,
  requiredFields: (keyof T)[]
): Record<string, string> {
  const errors: Record<string, string> = {};

  requiredFields.forEach((fieldKey) => {
    const value = formData[fieldKey];
    
    // Проверяем, что поле заполнено
    if (!value || (typeof value === 'string' && !value.trim())) {
      errors[fieldKey as string] = 'required';
    }
  });

  return errors;
}

/**
 * Проверяет, есть ли ошибки валидации
 * @param errors - объект с ошибками
 * @returns true если ошибок нет
 */
export function hasNoErrors(errors: Record<string, string>): boolean {
  return Object.keys(errors).length === 0;
}
