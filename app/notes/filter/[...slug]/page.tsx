import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { fetchNotes } from '@/lib/api/api';
import NotesClient from './Notes.client';
import type { NoteTag } from '@/types/note';

type Props = {
  params: Promise<{ slug: string[] }>;
};

const NotesByCategory = async ({ params }: Props) => {
  const { slug } = await params;
  if (slug[0] !== 'all' && isNoteTag(slug[0]) === false) return notFound();
  const tag = slug[0] === 'all' ? undefined : slug[0];
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag],
    queryFn: () => fetchNotes({ page: 1, search: '', tag }),
  });

  function isNoteTag(tag: string): tag is NoteTag {
    const allowedTags: string[] = [
      'Todo',
      'Work',
      'Personal',
      'Meeting',
      'Shopping',
    ];

    return allowedTags.includes(tag);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient key={tag ?? 'all'} tag={tag} />
    </HydrationBoundary>
  );
};

export default NotesByCategory;
