import React from 'react';
import { createCategory } from './_actions';
import { TextInput } from '@/components/common/Inputs/text/textInput';
import SubmitButton from '@/components/SubmitButton/submitButton';
import Search from '@/components/search/search';
import Pagination from '@/components/pagination/Pagination';
import Table from '@/components/table/table';

export default function Categories() {
  return (
    <div className='w-full'>
      <h1>Categories</h1>
      <div className='flex gap-2'>
        <form action={createCategory} className='w-1/4'>
          <TextInput
            placeholder='New category'
            label='New category'
            id='categoryId'
            name='category'
            className='p-1'
            required
          />
          <SubmitButton className='btn-primary'>Save</SubmitButton>
        </form>
        <div className='w-3/4'>
          <Search placeholder='Search categories' />
          <Table columns={[]} data={[]} />
          <Pagination count={5} />
        </div>
      </div>
    </div>
  );
}
