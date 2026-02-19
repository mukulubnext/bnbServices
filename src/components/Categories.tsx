"use client"
import { NextPage } from 'next'
import { useEffect, useState } from 'react';
import Spinner from './Spinner';
import axios from 'axios';
import CategoryCard from '@/app/categories/components/CategoryCard';
import CardSkeleton from '@/app/categories/components/CardSkeleton';
import CatCard from './CatCard';

interface Props {}

const Categories: NextPage<Props> = ({}) => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const getCategories = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/api/v1/category`);
                if (res.data.status === "success") {
                    setCategories(res.data.categories);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getCategories();
    }, []);
  return <div className="flex flex-col md:w-[80%] mx-auto py-4 not-md:p-4 gap-4">
        {!loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(0,6).map((cat) => (
              <CatCard
                key={cat.id}
                category={cat.name}
                subCategories={cat.subCategories}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        )}
</div>
}

export default Categories