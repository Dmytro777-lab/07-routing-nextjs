import axios from 'axios';
import type { NewNote, Note, NoteTag } from '../../types/note.js';

const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export const PER_PAGE = 12;

interface FetchNotesParams {
  page: number;
  search: string;
  tag?: NoteTag;
}
interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

export const fetchNotes = async ({
  page,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await api.get<FetchNotesResponse>(`/notes`, {
    params: { page, perPage: PER_PAGE, search, tag },
  });

  return response.data;
};

export const createNote = async (note: NewNote): Promise<Note> => {
  const response = await api.post<Note>(`/notes`, note);

  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`);

  return response.data;
};
