'use client';
import css from './NotePreview.module.css';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/api';
import Modal from '@/components/Modal/Modal';

type NotePreviewClientsProps = {
  id: string;
};

export default function NotePreviewClients({ id }: NotePreviewClientsProps) {
  const { status, data } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });
  const router = useRouter();
  const handleClose = () => {
    router.back();
  };

  return (
    <Modal onClose={handleClose}>
      <div className={css.container}>
        {status === 'pending' && <div>Loading…</div>}
        {status === 'error' && <div>Error…</div>}

        {status === 'success' && (
          <div className={css.item}>
            <div className={css.header}>
              <h2>{data.title}</h2>
            </div>
            <span className={css.tag}>{data.tag}</span>
            <p className={css.content}>{data.content}</p>
            <p className={css.date}>{data.createdAt}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
