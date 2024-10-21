/**
 * Zde vytvořte formulářové vstupy pomocí react-hook-form, které:
 * 1) Budou součástí formuláře v MainForm, ale zůstanou v odděleném souboru
 * 2) Reference formuláře NEbude získána skrze Prop input (vyvarovat se "Prop drilling")
 * 3) Získá volby (options) pro pole "kategorie" z externího API: https://dummyjson.com/products/categories jako "value" bude "slug", jako "label" bude "name".
 *
 *
 * V tomto souboru budou definovány pole:
 * allocation - number; Bude disabled pokud není amount (z MainForm) vyplněno. Validace na min=0, max=[zadaná hodnota v amount]
 * category - string; Select input s volbami z API (label=name; value=slug)
 * witnesses - FieldArray - dynamické pole kdy lze tlačítkem přidat a odebrat dalšího svědka; Validace minimálně 1 svědek, max 5 svědků
 * witnesses.name - string; Validace required
 * witnesses.email - string; Validace e-mail a asynchronní validace, že email neexistuje na API https://dummyjson.com/users/search?q=[ZADANÝ EMAIL]  - tato validace by měla mít debounce 500ms
 */

import { useEffect, useState } from 'react';
import { Category } from './types';
import { TextInputField } from './TextInputField';
import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import { MainFormValues } from './validations';

export const NestedFields = () => {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const { register } = useFormContext<MainFormValues>();

  useEffect(() => {
    // TODO: Error handling.
    const fetchCategories = async () => {
      const response = await fetch('https://dummyjson.com/products/categories');
      const data = await response.json();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  const { fields, append, remove } = useFieldArray<MainFormValues>({
    name: 'witnesses',
  });

  const amount = useWatch({ name: 'amount' });

  return (
    <>
      <TextInputField name="allocation" label="Allocation" disabled={!amount} />
      <div>
        <label>
          Category
          {categories && (
            <select {...register('category')}>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
        </label>
      </div>
      {fields.map((field, fieldIndex) => (
        <div key={field.id}>
          <TextInputField name={`witnesses.${fieldIndex}.name`} label="Name" />
          <TextInputField
            name={`witnesses.${fieldIndex}.email`}
            label="Email"
          />
          {fields.length > 1 && (
            <button type="button" onClick={() => remove(fieldIndex)}>
              Remove Witness
            </button>
          )}
        </div>
      ))}
      <div>
        {fields.length < 5 && (
          <button type="button" onClick={() => append({ name: '', email: '' })}>
            Add Witness
          </button>
        )}
      </div>
    </>
  );
};
