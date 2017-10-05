export const required = (value) => (value ? undefined : 'Required');
export const email = (value) =>
  value && !/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i.test(value)
    ? 'Invalid email address'
    : undefined;

export const passwordStrong = (value) => value && value.length > 7 ? undefined : 'Password must me greater than 6 characters';
