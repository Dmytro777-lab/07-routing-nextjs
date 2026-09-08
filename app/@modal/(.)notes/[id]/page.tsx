import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/api';
import NotePreviewClients from './NotePreview.client';

type PageProps = {
  params: Promise<{ id: string }>;
};

const PageDetails = async ({ params }: PageProps) => {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClients id={id} />
    </HydrationBoundary>
  );
};

export default PageDetails;
