// import React from "react";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
// } from "../ui/pagination";
// import Button from "../ui/button/Button";

// const PaginationComponent = ({ currentPage, onPageChange, totalPages }) => {
//   const handlePageClick = (p) => {
//     if (currentPage !== p) {
//       onpageChange(p);
//       window.scrollTo(0, 0);
//     }
//   };
//   return (
//     <Pagination className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-4">
//       <PaginationContent>
//         {pages.map((item) => (
//           <PaginationItem key={item}>
//             <PaginationLink
//               onClick={() => handlePageClick(item)}
//               isActive={currentPage === item}
//               className={`${
//                 currentPage === item
//                   ? "bg-text-green text-white"
//                   : "hover:bg-gray-100"
//               } rounded-full cursor-pointer`}
//             >
//               {item}
//             </PaginationLink>
//           </PaginationItem>
//         ))}
//         <PaginationItem>
//           <PaginationNext
//             onClick={() =>
//               handlePageClick(Math.min(totalPages, currentPage + 1))
//             }
//             className={
//               currentPage === totalPages
//                 ? "pointer-events-none opacity-50 cursor-pointer"
//                 : "cursor-pointer"
//             }
//           />
//         </PaginationItem>
//         <Button
//           variant="outline"
//           className="rounded-full font-medium px-8 py-5 cursor-pointer"
//           onClick={() => handlePageClick(totalPages)}
//         >
//           Last
//         </Button>
//       </PaginationContent>
//     </Pagination>
//   );
// };

// export default PaginationComponent;
