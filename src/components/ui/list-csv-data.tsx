import { ReactElement } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableCaption,
} from "./table";

function ListOfDebts(): ReactElement {
  
  const data = [
    { name: "John", age: 30, job: "Engineer" },
    { name: "Alice", age: 25, job: "Designer" },
    { name: "Bob", age: 35, job: "Developer" },
  ];

  return (
    <>
      <div className="md:container md:mx-auto">
      
        <div className="flex flex-col items-center justify-center h-screen">
          <Table>
            <TableCaption>List of People</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Job</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((person, index) => (
                <TableRow key={index}>
                  <TableCell>{person.name}</TableCell>
                  <TableCell>{person.age}</TableCell>
                  <TableCell>{person.job}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

    </>
  );
};

export { ListOfDebts };
