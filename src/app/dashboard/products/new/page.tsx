import CreateProductForm from '@/components/dashboard/CreateProductForm';
import React from 'react';

const ProductNew = () => {
  return (
    <div className='min-h-[calc(100vh-5rem)] bg-gray-100 flex flex-col items-center p-4 md:p-6'>
      <CreateProductForm />
    </div>
  );
}

export default ProductNew;
