export const truncateMessage = (message: string, maxLength: number) => {
  if (message.length <= maxLength) {
    return message;
  }
  return `${message.substring(0, maxLength)}...`;
};

export default {};
