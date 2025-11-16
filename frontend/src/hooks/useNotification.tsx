import { useToast } from "@chakra-ui/react";

// TODO: Customize toast to match Figma design
// https://www.figma.com/design/Ts9QxCIXFe4l9h6GKOLOIq/Admin-Application?node-id=5530-38022&t=d0D0hBm1Lo6YUL70-4
export default function useNotification() {
  const toast = useToast();

  const sendNotification = (message: string) => {
    toast({
      description: message,
      status: "success",
      position: "top", 
      duration: 3000,
      variant: "left-accent"
    });
  };

  return { sendNotification };
};
