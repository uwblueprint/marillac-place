import { useToast } from "@chakra-ui/react";

export default function useNotification() {
  const toast = useToast();

  const sendNotification = (message: string) => {
    toast({
      description: message,
      position: "top",
      duration: 3000,
      variant: "subtle",
      status: "success",
    });
  };

  return { sendNotification };
}
