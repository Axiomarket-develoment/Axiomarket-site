// import { FaChevronLeft, FaUserCircle } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// const MessageHeader = ({
//   partner,
// }: {
//   partner: { fullName: string; profileImage?: string };
// }) => {
//   const navigate = useNavigate();

//   return (
//     <div className="flex items-center justify-between p-4 bg-white border-b border-blue-200 shadow-sm">
//       {/* Back button for mobile */}
//       <div
//         className="flex items-center gap-2 lg:hidden cursor-pointer text-blue-600"
//         onClick={() => navigate(-1)}
//       >
//         <FaChevronLeft size={16} />
//         <span className="text-sm font-medium">Back</span>
//       </div>

//       {/* Profile info */}
//       <div className="flex-1 flex -ml-8 items-center gap-3 justify-center lg:justify-start">
//         <FaUserCircle className="w-12 h-12 text-blue-500" />
//         <div className="flex flex-col">
//           <h2 className="text-md font-semibold text-blue-700">{partner.fullName}</h2>
//           {/* <p className="text-xs text-blue-400">
//             @{partner.fullName.replace(/\s+/g, "").toLowerCase() || "serviceprovider"}
//           </p> */}
//         </div>
//       </div>

//       {/* Conversation info for desktop */}
//       <p className="hidden lg:flex text-xs text-blue-500">Started: 02 Oct</p>
//     </div>
//   );
// };

// export default MessageHeader;