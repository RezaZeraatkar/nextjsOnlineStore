import React from 'react';
import { getCategories } from './_actions';
import Search from '@/components/search/search';
import Table from '@/components/table/table';
import Pagination from '@/components/pagination/Pagination';
import AddCategory from '@/components/forms/addCategory';
import { ICategory } from '@/types/interfaces/category';

const cols = [
  {
    key: 'category_name',
    header: 'category name',
    render: (row: ICategory) => <>{row.category_name}</>,
  },
];

export default async function Categories({
  searchParams,
}: {
  searchParams: {
    q: string | null;
    page: string | null;
  };
}) {
  const q = searchParams?.q || '';
  const page = searchParams?.page || '1';
  const categories = await getCategories(q, page);
  if (categories.success)
    return (
      <div className='w-full'>
        <h1>Categories</h1>
        <div className='flex w-full gap-5'>
          <AddCategory />
          <div className='w-3/4'>
            <Search placeholder='Search categories' />
            <Table columns={cols} data={categories?.data?.items} />
            <Pagination count={5} />
          </div>
        </div>
      </div>
    );
  else return <div>{categories.error.message}</div>;
}
