import React from 'react';

interface Column {
  key: string;
  header: string;
  render: (row: any) => JSX.Element;
}

interface TableProps {
  columns: Column[];
  data: any[];
}

const Table: React.FC<TableProps> = ({ columns, data }) => {
  return (
    <div>
      <table className='basic-table'>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.header}</th>
            ))}
          </tr>
        </thead>
        {data.length > 0 ? (
          <tbody>
            {data.map((row) => {
              return (
                <tr key={row._id}>
                  {columns.map((column) => (
                    <td key={column.key}>{column.render(row)}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        ) : null}
      </table>
      {data.length <= 0 ? (
        <div className='w-full border border-blue-200 p-1 text-center'>
          No data found!
        </div>
      ) : null}
    </div>
  );
};

export default Table;
