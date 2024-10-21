import * as yup from 'yup';
import { damagedPartsOptions } from './constants';

interface GetUsersResponseBody {
  users: object[];
}

// NOTE: Never used Yup before btw, hopefully I haven't messed this up too much.
export const mainFormValuesSchema = yup.object({
  amount: yup.number().required().min(0).max(300),
  // TODO: Validate based on `amount` value.
  allocation: yup.number().min(0).required(),
  category: yup.string().required(),
  witnesses: yup.array().of(
    yup.object({
      name: yup.string().required(),
      email: yup
        .string()
        // TODO: Better validation messages.
        .required()
        .email()
        // TODO: Debounce using Lodash or something. Returns a promise though, careful.
        // I've used blur validations in `useForm` for better UX and to reduce the API spam.
        .test('unique', 'Email is not unique', async (value) => {
          if (!value) {
            return false;
          }

          // TODO: Not sure if this is actually necessary, but better safe than sorry.
          const encodedValue = encodeURIComponent(value);
          // TODO: We cannot really use this endpoint for email validation, since it's a fulltext search.
          const url = `https://dummyjson.com/users/search?q=${encodedValue}`;
          const response = await fetch(url);

          // TODO: Error handling.
          const data: GetUsersResponseBody = await response.json();

          return data.users.length === 0;
        }),
    })
  ),
  damagedParts: yup.array().of(yup.mixed().oneOf(damagedPartsOptions)),
});

export interface MainFormValues
  extends yup.InferType<typeof mainFormValuesSchema> {}
