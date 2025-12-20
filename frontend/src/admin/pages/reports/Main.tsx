export {};
// TODO: Refactor this component
// import React, { useState, useEffect } from "react";
// import { Flex, Text } from "@chakra-ui/react";
// import { useQuery, useMutation } from "@apollo/client";
// import ReportsTable from "./components/ReportsTable";
// import AddEmailModal from "./components/AddEmailModal";
// import EditEmailModal from "./components/EditEmailModal";
// import { GET_REPORT_RECIPIENTS } from "../../../gql/queries";
// import {
//   CREATE_REPORT_RECIPIENT,
//   UPDATE_REPORT_RECIPIENT,
//   DELETE_REPORT_RECIPIENT,
// } from "../../../gql/mutations";
//
// type ReportRecipient = {
//   report_recipient_id: number;
//   email: string;
//   weekly: boolean;
//   monthly: boolean;
//   last_report_sent: string | null;
// };
//
// type Report = {
//   id: number;
//   email: string;
//   weekly: boolean;
//   monthly: boolean;
//   lastReportSent: string;
// };
//
// export default function AdminReportsPage() {
//   const [addEmail, setAddEmail] = useState(false);
//   const [editEmail, setEditEmail] = useState(false);
//   const [selectedEmail, setSelectedEmail] = useState<any>(null);
//   const [reports, setReports] = useState<Report[]>([]);
//
//   const { loading, error, data, refetch } = useQuery(GET_REPORT_RECIPIENTS);
//   const [createReportRecipient] = useMutation(CREATE_REPORT_RECIPIENT);
//   const [updateReportRecipient] = useMutation(UPDATE_REPORT_RECIPIENT);
//   const [deleteReportRecipient] = useMutation(DELETE_REPORT_RECIPIENT);
//
//   // Transform backend data to frontend format
//   useEffect(() => {
//     if (data?.getReportRecipients) {
//       const transformed: Report[] = data.getReportRecipients.map(
//         (recipient: ReportRecipient) => ({
//           id: recipient.report_recipient_id,
//           email: recipient.email,
//           weekly: recipient.weekly,
//           monthly: recipient.monthly,
//           lastReportSent: recipient.last_report_sent || "Never",
//         })
//       );
//       setReports(transformed);
//     }
//   }, [data]);
//
//   const handleAddEmail = async (emailData: any) => {
//     try {
//       await createReportRecipient({
//         variables: {
//           email: emailData.email,
//           weekly: emailData.weekly,
//           monthly: emailData.monthly,
//         },
//       });
//       refetch();
//       setAddEmail(false);
//     } catch (err) {
//       console.error("Error creating report recipient:", err);
//     }
//   };
//
//   const handleEditEmail = async (emailData: any) => {
//     try {
//       await updateReportRecipient({
//         variables: {
//           report_recipient_id: selectedEmail.id,
//           email: emailData.email,
//           weekly: emailData.weekly,
//           monthly: emailData.monthly,
//         },
//       });
//       refetch();
//       setEditEmail(false);
//       setSelectedEmail(null);
//     } catch (err) {
//       console.error("Error updating report recipient:", err);
//     }
//   };
//
//   const handleDeleteEmail = async (id: number) => {
//     try {
//       await deleteReportRecipient({
//         variables: {
//           report_recipient_id: id,
//         },
//       });
//       refetch();
//     } catch (err) {
//       console.error("Error deleting report recipient:", err);
//     }
//   };
//
//   const handleToggleWeekly = async (id: number, weekly: boolean) => {
//     try {
//       await updateReportRecipient({
//         variables: {
//           report_recipient_id: id,
//           weekly,
//         },
//       });
//       refetch();
//     } catch (err) {
//       console.error("Error toggling weekly:", err);
//     }
//   };
//
//   const handleToggleMonthly = async (id: number, monthly: boolean) => {
//     try {
//       await updateReportRecipient({
//         variables: {
//           report_recipient_id: id,
//           monthly,
//         },
//       });
//       refetch();
//     } catch (err) {
//       console.error("Error toggling monthly:", err);
//     }
//   };
//
//   const handleEditClick = (email: any) => {
//     setSelectedEmail(email);
//     setEditEmail(true);
//   };
//
//   if (loading) {
//     return (
//       <Flex
//         width="100%"
//         height="fit-content"
//         justifyContent="center"
//         padding="20px"
//       >
//         <Text>Loading...</Text>
//       </Flex>
//     );
//   }
//
//   if (error) {
//     return (
//       <Flex
//         width="100%"
//         height="fit-content"
//         justifyContent="center"
//         padding="20px"
//       >
//         <Text color="red">Error loading reports: {error.message}</Text>
//       </Flex>
//     );
//   }
//
//   return (
//     <Flex width="100%" height="fit-content" flexDir="column" gap="15px">
//       <Flex
//         width="100%"
//         height="fit-content"
//         alignItems="center"
//         justifyContent="space-between"
//       >
//         <Flex alignItems="center" gap="15px">
//           <Text textStyle="web.h2" color="primary.700">
//             Reports
//           </Text>
//           <Text textStyle="web.b3" color="text.light.secondary" marginTop="7px">
//             Reports will be automatically generated and emailed. Edit and select
//             frequency of emails in the list below.
//           </Text>
//         </Flex>
//       </Flex>
//       <ReportsTable
//         reports={reports}
//         onAddEmail={() => setAddEmail(true)}
//         onEditEmail={handleEditClick}
//         onDeleteEmail={handleDeleteEmail}
//         onToggleWeekly={handleToggleWeekly}
//         onToggleMonthly={handleToggleMonthly}
//       />
//
//       {addEmail && (
//         <AddEmailModal
//           onClose={() => setAddEmail(false)}
//           onSubmit={handleAddEmail}
//         />
//       )}
//       {editEmail && selectedEmail && (
//         <EditEmailModal
//           email={selectedEmail}
//           onClose={() => {
//             setEditEmail(false);
//             setSelectedEmail(null);
//           }}
//           onSubmit={handleEditEmail}
//         />
//       )}
//     </Flex>
//   );
// }
