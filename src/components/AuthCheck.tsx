"use client"
import { useAuth } from '@/context/AuthContext'
import { NextPage } from 'next'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Spinner from './Spinner';

interface Props {}

const AuthCheck: NextPage<Props> = ({}) => {
    const {user, loading} = useAuth();
    const router =useRouter();
    useEffect(()=>{
        if(!loading && user){
            router.replace("/home")
        }
    },[user, loading])
  return loading && <div className='bg-light fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-100'>
    <Spinner light={false} />
  </div>
}

export default AuthCheck