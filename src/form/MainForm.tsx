/**
 * Zde vytvořte formulář pomocí knihovny react-hook-form.
 * Formulář by měl splňovat:
 * 1) být validován yup schématem
 * 2) formulář obsahovat pole "NestedFields" z jiného souboru
 * 3) být plně TS typovaný
 * 4) nevalidní vstupy červeně označit (background/outline/border) a zobrazit u nich chybové hlášky
 * 5) nastavte výchozí hodnoty objektem initalValues
 * 6) mít "Submit" tlačítko, po jeho stisku se vylogují data z formuláře:  "console.log(formData)"
 *
 * V tomto souboru budou definovány pole:
 * amount - number; Validace min=0, max=300
 * damagedParts - string[] formou multi-checkboxu s volbami "roof", "front", "side", "rear"
 * vykresleny pole z form/NestedFields
 */

import { useCallback } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MainFormValues, mainFormValuesSchema } from './validations';
import { TextInputField } from './TextInputField';
import { damagedPartsOptions } from './constants';
import { NestedFields } from './NestedFields';

// příklad očekávaného výstupního JSON, předvyplňte tímto objektem formulář
const initialValues = {
  amount: 250,
  allocation: 140,
  damagedParts: ['side', 'rear'],
  category: 'kitchen-accessories',
  witnesses: [
    {
      name: 'Marek',
      email: 'marek@email.cz',
    },
    {
      name: 'Emily',
      email: 'emily.johnson@x.dummyjson.com',
    },
  ],
} satisfies MainFormValues;

export const MainForm = () => {
  const form = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(mainFormValuesSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const handleSubmit = useCallback<SubmitHandler<MainFormValues>>((values) => {
    console.log(values);
  }, []);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div>
          <TextInputField label="Amount" name="amount" type="number" />
        </div>
        <div>
          {damagedPartsOptions.map((option) => (
            <label key={option}>
              <input
                type="checkbox"
                value={option}
                {...form.register('damagedParts')}
              />
              {option}
            </label>
          ))}
        </div>
        <NestedFields />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
};
