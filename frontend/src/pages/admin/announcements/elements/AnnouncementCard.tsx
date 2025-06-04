import { useMutation, gql } from '@apollo/client';
import { useToast } from '@chakra-ui/react';

const DELETE_ANNOUNCEMENT = gql`
  mutation DeleteAnnouncement($announcement_id: Int!) {
    deleteAnnouncement(announcement_id: $announcement_id)
  }
`;

const useDeleteAnnouncement = () => {
  const toast = useToast();
  const [deleteAnnouncementMutation] = useMutation(DELETE_ANNOUNCEMENT);

  const handleDeleteAnnouncement = async (announcement_id: number) => {
    if (typeof announcement_id !== 'number' || isNaN(announcement_id)) {
      toast({
        title: 'Invalid ID',
        description: 'The announcement ID is not valid.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const { data } = await deleteAnnouncementMutation({
        variables: { announcement_id },
      });

      if (data?.deleteAnnouncement) {
        toast({
          title: 'Deleted',
          description: 'Announcement deleted successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        window.location.reload();
      } else {
        throw new Error('Announcement deletion failed.');
      }
    } catch (error: any) {
      console.error('ERROR: Error in deleting announcement. ', error);
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return { handleDeleteAnnouncement };
};

export default useDeleteAnnouncement;
