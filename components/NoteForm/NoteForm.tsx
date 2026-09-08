import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { createNote } from '../../lib/api';
import css from './NoteForm.module.css';
import type { NewNote } from '../../types/note';
import type { FormikHelpers } from 'formik';

interface NoteFormProps {
  onClose: () => void;
}
const initialValues: NewNote = {
  title: '',
  content: '',
  tag: 'Todo',
};
const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Name is too short')
    .max(50, 'Name is too long')
    .required('Enter the event name'),
  content: Yup.string().max(500, 'Description too long'),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'] as const)
    .required('Choose at least one topic'),
});
export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createNote,
  });
  const handleSubmit = async (
    values: NewNote,
    actions: FormikHelpers<NewNote>,
  ) => {
    await mutation.mutateAsync(values);
    await queryClient.invalidateQueries({ queryKey: ['notes'] });
    actions.resetForm();
    onClose();
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            id="content"
            as="textarea"
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field id="tag" as="select" name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" onClick={onClose} className={css.cancelButton}>
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={mutation.isPending}
          >
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
